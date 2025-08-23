import { localStorageParametrName } from "../setting/SettingRepsitoryImpl";
import { StartRepository } from "./StartRepository";
import * as mapper from "../character/player-mapper";


export class StartRepositoryImpl extends StartRepository{
    constructor(apiClaent){
        super();
        this.apiClaent = apiClaent;
    }

    saveCharacter(character){
        this.apiClaent.setItem(new mapper.playerToDto(character), localStorageParametrName);
    }
}