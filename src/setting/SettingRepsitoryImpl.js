import SettingRepository from "./SettingRepsitory"
import * as mapper from "../character/player-mapper"

export class SettingRepositoryImpl extends SettingRepository {
    constructor(apiClient) {
        super();
        this.apiClient = apiClient;
    }
    
    async getPlayer() {
        const dtoPlayer = await this.apiClient.getItem(localStorageParametrName);     
        return new mapper.dtoToPlayer(dtoPlayer);
    }

    savePlayer(player) {
        this.apiClient.setItem(localStorageParametrName, new mapper.playerToDto(player));
    }

} 

export const localStorageParametrName = 'player';
