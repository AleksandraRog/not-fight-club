import { BehaviorSubject, concatMap, delay, from, of, Subject } from "rxjs";
import { Model } from "../common/Model";
import { Battle } from "./BattleClass";
import { BattleState } from "./BattleState";


export class BattleModel extends Model{
    constructor(repository, storageRepository, battleInteractor) {
        super(repository, storageRepository);
        this.battleInteractor = battleInteractor;
        this.battle = null;
        this.battleQueue$ = new Subject();
        this.battle$ = new BehaviorSubject(null);
        
        

        this.battleQueue$
          .pipe(
            concatMap(event => from([event]).pipe(delay(event.delay || 0)))
          )
          .subscribe(event => {
            this.battle$.next(event.state);
          });

        this.restoreState();
        this.getBattle();



        
        
        this.repository.playerChanges$.subscribe(player => {
          this.battle.player = player;
          this.battle$.next(new BattleState('player', this.battle));
        });    
    }

    async attackSession(){
        this.battle.enemyDisposition = this.battleInteractor.createEnemyDisposition(this.battle.enemy);

        const result = await this.battleInteractor.attackSession(this.battle.playerDisposition, this.battle.enemyDisposition);
        this.battle.playerScore -= result.player.damage;
        this.battle.enemyScore -= result.enemy.damage;
        if(this.battle.playerScore <= 0 || this.battle.enemyScore <= 0) this.battle.finish = true;
    
        result.player.log.forEach(element => {
          this.battle.battleLog.push(element.replaceAll('**', this.battle.player.name).replaceAll('&&', this.battle.enemy.name))
        });
        result.enemy.log.forEach(element => {
          this.battle.battleLog.push(element.replaceAll('&&', this.battle.player.name).replaceAll('**', this.battle.enemy.name))
        })
        this.saveState();
        this.battle$.next(new BattleState('attack', this.battle));
    }

    async loadPlayer() {
        const player = await this.repository.getPlayer();
        this.battle.player = player;
        this.battle.player = this.battle.player;
        this.saveState();
        return player;
    }

    createEnemy(){
      return this.battleInteractor.createEnemy();
    }

    createEnemyDisposition(){
      this.battle.enemyDisposition = this.battleInteractor.createEnemyDisposition(this.battle.enemy);
      this.saveState();      
    }

    async updateTypePlayerAttack(){
      const playerDis = await this.battleInteractor.updateTypeAttack(this.battle.playerDisposition)
      this.battle.playerDisposition = playerDis;
      this.saveState();
    }

    updatePlayerDisposition(intent){
      const disp = this.battle.playerDisposition;
      if(intent.group === 'Attack') {
          if(intent.checked && !disp.attackZoneList.includes(intent.value.toUpperCase())){ 
            
            this.battle.playerDisposition.attackZoneList.push(intent.value.toUpperCase());
          } else {
            this.battle.playerDisposition.attackZoneList = disp.attackZoneList.filter(val => val !== intent.value.toUpperCase());
            this.battle.playerDisposition.superAttackZoneList = disp.superAttackZoneList.filter(val => val !== intent.value.toUpperCase());
          }; 
      }

      if(intent.group === 'Defence') {
        intent.checked ? this.battle.playerDisposition.defenceZoneList.push(intent.value.toUpperCase()) :
          this.battle.playerDisposition.defenceZoneList = disp.defenceZoneList.filter(val => val !== intent.value.toUpperCase());
      }
      this.saveState();
      this.pushBattleChange();
    }

    pushBattleChange(){
      this.updateTypePlayerAttack()
      const attackZones = this.battle.playerDisposition.attackZoneList.length;
      const defenceZones = this.battle.playerDisposition.defenceZoneList.length;
      const superAttackZones = this.battle.playerDisposition.superAttackZoneList.length;

      this.battle.isReady =
      (attackZones + superAttackZones) === this.battle.playerAttackZoneCount &&
      defenceZones === this.battle.playerDefenceZoneCount;
      
       
      this.saveState();
      this.battle$.next(new BattleState('activeAttackButton', this.battle));
    }

    savePlayerResult(intent){
      intent.result > 0 ? this.battle.player.wins += Math.abs(intent.result) : this.battle.player.loses += Math.abs(intent.result);
      this.repository.saveBattleResalt(this.battle.player);
      this.repository.removeBattle();
      this.resetBattle();

    }

    getBattle(){
      
      if(!this.battle) {
        from(this.repository.getBattle()).subscribe(bat =>  {
          (bat.battle) ? this.battle = bat.battle : this.resetBattle();
          this.battle.player = bat.player;
          this.battleQueue$.next({state: new BattleState('startFragment', this.battle), delay: 15});
        });
      } else {

      from(this.repository.getPlayer()).subscribe(player =>  {
          this.battle.player = player;
          this.saveState();
          this.battleQueue$.next({state: new BattleState('startFragment', this.battle), delay: 15});
        });
      }

    
    }

    async resetBattle(){
      this.battle = new Battle();
      this.battle.enemy = this.createEnemy();
      this.battle.player = await this.repository.getPlayer();
      this.clearState();
    }

    restoreState() {
      const savedState = this.storageRepository.getItem('battleState', true);
      if (savedState) {
        this.battle = savedState;

      this.battleQueue$.next( {state: new BattleState('restoreState', this.battle), delay: 0});
      }
    }

    pushOnCreateView(){
      this.battleQueue$.next({state: new BattleState('restoreState', this.battle), delay: 0});
    }

    saveState() {
      this.storageRepository.setItem('battleState', this.battle, true); 
    }

    saveBattle() {
      this.repository.saveBattle(this.battle); 
    }

    clearState() {
      this.storageRepository.removeItem('battleState', true);
    }


}