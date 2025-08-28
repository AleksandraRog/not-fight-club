import { Hero } from "../common/HeroClass";
import { Battle } from "./BattleClass";
import { BattleDto } from "./BattleDto";
import { Disposition } from "./Disposition";
import { DispositionDto } from "./DispositionDto";
import { HeroDto } from "./HeroDto";


export class battleToDto{
    constructor(battle = new Battle()) {
        return new BattleDto(
            heroToDto(battle.enemy),
            battle.playerScore,
            battle.enemyScore,
            battle.battleLog,
            dispositionToDto(battle.playerDisposition),
            dispositionToDto(battle.enemyDisposition),
            battle.isReady
        );
    }
}

export class dispositionToDto {
    constructor(disposition = new Disposition()) {
        return new DispositionDto(
            disposition.attackZoneList,
            disposition.defenceZoneList,
            disposition.superAttackZoneList
        )
    }
}

export class heroToDto {
    constructor(hero = new Hero()){
        return new HeroDto(
            hero.name,
            hero.avatar,
            hero.player,
            hero.health,
            hero.attCount,
            hero.defCount
        )
    }
}

export class dtoToBattle {
    constructor(battleDto = new BattleDto()){
        let battle = new Battle();
        battle.enemy = dtoToHero(battleDto.enemy);
        battle.battleLog = battleDto.battleLog;
        battle.playerScore = battleDto.playerScore;
        battle.enemyScore = battleDto.enemyScore;
        battle.playerDisposition = dtoToDisposition(battleDto.playerDisposition);
        battle.enemyDisposition = dtoToDisposition(battleDto.enemyDisposition);
        battle.isReady = battleDto.isReady;
        return battle;
    }
}

export class dtoToHero{
    constructor(heroDto = new HeroDto()) {
        let hero = new Heho();
        hero.name = heroDto.name;
        hero.avatar = heroDto.avatar;
        hero.player = heroDto.player;
        hero.health = heroDto.health;
        hero.attCount = heroDto.attCount;
        hero.defCount = heroDto.defCount;
        return hero;
    }

}

export class dtoToDisposition {
    constructor(dtoDisposition = new DispositionDto()) {
        return new DispositionDto(
            dtoDisposition.attackZoneList,
            dtoDisposition.defenceZoneList,
            dtoDisposition.superAttackZoneList
        )
    }
}