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

    async getAvatarList() {
        // const files = fs.readdir(imgPath);
        // const stats = await Promise.all(files.map(file => fs.stat(path.join(imgPath,file))));
        // return files.filter((_, i) => stats[i].isFile())
        //     .map(file => path.join(imgPath, file)); 
    }

} 

export const localStorageParametrName = 'player';
