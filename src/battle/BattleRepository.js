

export class BattleRepository {
    
    async getPlayer(){
        throw new Error("getPlayer() must be implemented in subclass");
    }
    saveBattleResalt(){
        throw new Error("saveBattleResalt() must be implemented in subclass");
    }
    
}