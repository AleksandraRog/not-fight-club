import { BattleRepository } from "./BattleRepository";
import * as mapper from "../character/player-mapper";
import * as battleMapper from './BattleMapper';
import { localStorageParametrName } from "../setting/SettingRepsitoryImpl";
import { filter, map } from "rxjs";



export class BattleRepositoryImpl extends BattleRepository {
    constructor(apiClient){
        super()
        this.apiClient = apiClient;
        this.playerChanges$ = this.apiClient.changePlayer$.pipe(
          filter(ev => ev.key === localStorageParametrName),
            map(ev => new mapper.dtoToPlayer(ev.value)
          )
        );
        
    }    
    
    async getPlayer(){
       const dtoPlayer = await this.apiClient.getItem(localStorageParametrName);     
       return (dtoPlayer) ? new mapper.dtoToPlayer(dtoPlayer) : null; 
    }

    saveBattleResalt(player){
      this.apiClient.setItem(localStorageParametrName, new mapper.playerToDto(player));
    }

    async saveBattle(battle){
       this.apiClient.setItem('localStorageBattle', new battleMapper.battleToDto(battle)); 
    }

    async getBattle() {
      const dtoBattle = await this.apiClient.getItem('localStorageBattle');
      const battle = (dtoBattle) ? new battleMapper.dtoToBattle(dtoBattle) : null;
      const player = await this.getPlayer();
      return {battle: battle, player: player} ;
    }

    async removeBattle() {
      this.apiClient.removeItem('localStorageBattle');
    }
    
}