import { BehaviorSubject, from, Subject } from "rxjs";
import { Model } from "../common/Model";
import { Battle } from "./battle";


export class BattleModel extends Model{
    constructor(repository, storageRepository, battleInteractor) {
        super(repository, storageRepository);
        this.battleInteractor = battleInteractor;
        this.player = null;
        this.battle = new Battle;
        this.player$ = new BehaviorSubject(null);
        this.battle$ = new Subject();
        
        from(this.repository.getPlayer()).subscribe(player => {
          this.player$.next(player);
        });
        
        this.repository.playerChanges$.subscribe(player => {
          this.player$.next(player);
        });
            
    }

    attackSession(){
        console.log('batt ses',this.battleInteractor.attackSession(null, null));
    }

    async loadPlayer() {
        const player = await this.repository.getPlayer();
        this.player = player;
        this.battle.player = this.player;
        return player;
    }


}