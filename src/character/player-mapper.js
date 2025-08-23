import * as util from "../common/utils";
import { Player } from "./player";
import { PlayerDto } from "./player-dto";


export class dtoToPlayer {
    constructor(playerDto) {
        return new Player(playerDto.name,
            playerDto.wins,
            playerDto.loses,
            playerDto.avatar,
            true,
            this.health = util.health,
            util.playerAttCount,
            util.playerDefCount
        );
    }
}

export class playerToDto {
    constructor(player) {
        return new PlayerDto (
            player.name,
            player.wins,
            player.loses,
            player.avatar
        );
    }
}
