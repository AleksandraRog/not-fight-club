const { Hero } = require("../common/HeroClass");
const { Player } = require("../common/Player");

export class Battle {
    constructor(player = new Player(), antyPlayer = new Hero, battleLog = []) {
        this.player = player;
        this.antyPlayer = antyPlayer;
        this.playerScor = player.health,
        this.antyPlayerScor = antyPlayer.health;
        this.playerAttakeZoneCount = player.attCount;
        this.playerDefenceZoneCount = player.defCount;
        this.battleLog = battleLog;
    };
 
} 