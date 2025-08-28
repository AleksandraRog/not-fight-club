import { Hero } from "../common/HeroClass";
import { Player } from "../common/Player";
import { Disposition } from "./Disposition";

export class Battle {
    constructor(
      player = new Player(), 
      enemy = new Hero(), 
      battleLog = [], 
      playerDisposition = new Disposition(),
      enemyDisposition = new Disposition(),
      finish = false,
      isReady = false
    ) {
        this.player = player;
        this.enemy = enemy;
        this.playerScore = this.player.health,
        this.enemyScore = this.enemy.health;
        this.playerAttackZoneCount = this.player.attCount;
        this.playerDefenceZoneCount = this.player.defCount;
        this.playerDisposition = playerDisposition;
        this.enemyDisposition = enemyDisposition;
        this.battleLog = battleLog;
        this.finish = finish;
        this.isReady = isReady;
    }
 
} 