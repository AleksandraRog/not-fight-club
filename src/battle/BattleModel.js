import { Model } from "../common/Model";


export class BattleModel extends Model{
    constructor(repository, storageRepository, battleInteractor) {
        super(repository, storageRepository);
        this.battleInteractor = battleInteractor
    }
}