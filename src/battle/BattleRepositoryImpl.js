import { BattleRepository } from "./BattleRepository";
import * as mapper from "../character/player-mapper"
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
       return new mapper.dtoToPlayer(dtoPlayer); 
    }

    saveBattleResalt(player){
      this.apiClient.setItem(localStorageParametrName, new mapper.playerToDto(player));
    }
    
}