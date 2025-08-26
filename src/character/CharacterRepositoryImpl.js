import { filter, map } from "rxjs";
import { localStorageParametrName } from "../setting/SettingRepsitoryImpl";
import { CharacterRepository } from "./CharacterReposirory";
import * as mapper from "./player-mapper";


export class CharacterRepositoryImpl extends CharacterRepository{
    constructor(apiClient){
        super();
        this.apiClient = apiClient;
        this.characterChanges$ = this.apiClient.changePlayer$.pipe(  
          filter(ev => ev.key === localStorageParametrName),
          map(ev => {
            return new mapper.dtoToPlayer(ev.value)}));

    }

    async getCharacter(){
        const dtoPlayer = await this.apiClient.getItem(localStorageParametrName);
        return (dtoPlayer) ? new mapper.dtoToPlayer(dtoPlayer) : null;
    }

    saveCharacter(player) {
        this.apiClient.setItem(localStorageParametrName, new mapper.playerToDto(player));
    }
}