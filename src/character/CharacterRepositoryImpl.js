import { filter, map } from "rxjs";
import { localStorageParametrName } from "../setting/SettingRepsitoryImpl";
import { CharacterRepository } from "./CharacterReposirory";
import { dtoToPlayer } from "./player-mapper";


export class CharacterRepositoryImpl extends CharacterRepository{
    constructor(apiClient){
        super();
        this.apiClient = apiClient;
        this.characterChanges$ = this.apiClient.changePlayer$.pipe(
          filter(ev => ev.key === localStorageParametrName),
          map(ev => new dtoToPlayer(ev.value)));

    }

    async getCharacter(){
        const dtoPlayer = await this.apiClient.getItem(localStorageParametrName);
        return new dtoToPlayer(dtoPlayer);
    }
}