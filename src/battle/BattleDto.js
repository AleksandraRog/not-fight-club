

export class BattleDto {
    constructor(
      enemy = new HeroDto(), 
      playerScore = 0,
      enemyScore = 0,
      battleLog = [], 
      playerDisposition = new DispositionDto(),
      enemyDisposition = new DispositionDto(),
      isReady = false
    ) {
        this.enemy = enemy;
        this.playerScore = playerScore;
        this.enemyScore = enemyScore;
        this.playerDisposition = playerDisposition;
        this.enemyDisposition = enemyDisposition;
        this.battleLog = battleLog;
        this.isReady = isReady;
    }
}