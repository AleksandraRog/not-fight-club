import SettingRepository from "./SettingRepsitory"
import * as mapper from "../character/player-mapper"


// const fs = require('fs');
// const path = require('path');
// const imgPath = './assets/avatars/';

export class SettingRepositoryImpl extends SettingRepository {
    constructor(storageClient /** @type {LocalStorageClient} */) {
        super();
        this.storage = storageClient;
    }
     
    getPlayer() {
        return mapper.dtoToPlayer(storage.getItem(localStorageParametrName));
    }

    savePlayer(player) {
        this.storage.setItem(mapper.playerToDto(player), localStorageParametrName);
    }

    async getAvatarList() {
        // const files = fs.readdir(imgPath);
        // const stats = await Promise.all(files.map(file => fs.stat(path.join(imgPath,file))));
        // return files.filter((_, i) => stats[i].isFile())
        //     .map(file => path.join(imgPath, file)); 
    }

} 

const localStorageParametrName = 'player';
