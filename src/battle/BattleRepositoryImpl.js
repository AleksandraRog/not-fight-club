import { BattleRepository } from "./BattleRepository";



export class BattleRepositoryImpl extends BattleRepository {
    constructor(apiClient){
        super()
        this.apiClient = apiClient;
    }
    
    getPlayer(){}
    saveBattleResalt(){}
    
}