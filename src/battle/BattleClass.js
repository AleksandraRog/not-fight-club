import { Disposition } from "./Disposition";

const { Hero } = require("../common/HeroClass");
const { Player } = require("../common/Player");

export class Battle {
    constructor(player = new Player(), enemy = new Hero, battleLog = []) {
        this.player = player;
        this.enemy = enemy;
        this.playerScore = this.player.health,
        this.enemyScore = this.enemy.health;
        this.playerAttackZoneCount = player.attCount;
        this.playerDefenceZoneCount = player.defCount;
        this.playerDisposition = new Disposition();
        this.enemyDisposition = new Disposition();
        this.battleLog = battleLog;
        this.finish = false;
        this.isReady = false;
    };
 
} 