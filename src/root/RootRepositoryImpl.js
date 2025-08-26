import { dtoToPlayer } from "../character/player-mapper";
import { localStorageParametrName } from "../setting/SettingRepsitoryImpl";
import { RootRepository } from "./RootRepository";



export class RootRepositoryImpl extends RootRepository{
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
    }

    async getPlayer(){
        const dtoPlayer = await this.apiClient.getItem(localStorageParametrName);     
        return (dtoPlayer) ? new dtoToPlayer(dtoPlayer) : null;
    }
}