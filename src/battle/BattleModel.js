import { BehaviorSubject, from, Subject } from "rxjs";
import { Model } from "../common/Model";
import { Battle } from "./BattleClass";


export class BattleModel extends Model{
    constructor(repository, storageRepository, battleInteractor) {
        super(repository, storageRepository);
        this.battleInteractor = battleInteractor;
        this.player = null;
        this.battle = new Battle();
        this.battle.enemy = this.createEnemy();
        this.player$ = new BehaviorSubject(null);
        this.battle$ = new Subject();
        
        from(this.repository.getPlayer()).subscribe(player => {
          this.player$.next(player);
        });
        
        this.repository.playerChanges$.subscribe(player => {
          this.player = player;
          this.player$.next(player);
        });    
    }

    async attackSession(){
        this.battle.enemyDisposition = this.battleInteractor.createEnemyDisposition(this.battle.enemy);

        const result = await this.battleInteractor.attackSession(this.battle.playerDisposition, this.battle.enemyDisposition);
        this.battle.playerScore -= result.player.damage;
        this.battle.enemyScore -= result.enemy.damage;
        if(this.battle.playerScore <= 0 || this.battle.enemyScore <= 0) this.battle.finish = true;
    
        result.player.log.forEach(element => {
          this.battle.battleLog.push(element.replace('**', this.player.name).replace('&&', this.battle.enemy.name))
        });
        result.enemy.log.forEach(element => {
          this.battle.battleLog.push(element.replace('&&', this.player.name).replace('**', this.battle.enemy.name))
        })

        this.battle$.next(this.battle);
    }

    async loadPlayer() {
        const player = await this.repository.getPlayer();
        this.player = player;
        this.battle.player = this.player;
        return player;
    }

    createEnemy(){
      return this.battleInteractor.createEnemy();
    }

    createEnemyDisposition(){
       this.battle.enemyDisposition = this.battleInteractor.createEnemyDisposition(this.battle.enemy);
    }

    async updateTypePlayerAttack(){
      const playerDis = await this.battleInteractor.updateTypeAttack(this.battle.playerDisposition)
      this.battle.playerDisposition = playerDis;
    }

    updatePlayerDisposition(intent){
      const disp = this.battle.playerDisposition;
      if(intent.group === 'Attack') {
          if(intent.checked){ 
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

      this.battle$.next(this.battle);

    }

    savePlayerResult(intent){
      intent.result > 0 ? this.player.wins += Math.abs(intent.result) : this.player.loses += Math.abs(intent.result);
      this.repository.saveBattleResalt(this.player);
      this.resetBattle();

    }

    resetBattle(){
      this.battle = new Battle();
      this.battle.player = this.player;
      this.battle.enemy = this.createEnemy();
    }


}