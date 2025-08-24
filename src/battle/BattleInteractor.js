import { Hero } from "../common/HeroClass";
import { healthStep, zones } from "../common/utils";
import { Disposition } from "./DIsposition";


export class BattleInteractor{

    createEnemy () {
        return new Hero();
    }

    getEnemyDisposition() {
        return Array();
    }

    attackSession(playerDisposition, enemyDisposition) {
        const plDis = new Disposition(['LEGS', 'BODY', 'BELLY'], ['BODY'], ['BELLY']);
        const enDis = new Disposition(['BELLY', 'LEGS'], ['LEGS', 'HEAD'], []);
        
        const stText = (zone) => `** attacked && to ${zones[zone].name} `;
        const winText = (health) => `and deal ${health} damage.`;
        const noneText = (zone) => `bat && was able to protected his ${zones[zone].name}`; 
        const logText = (zone, enemy) => stText(zone) + (enemy.defenceZoneList.includes(zone) ? noneText(zone) : winText(healthStep));  
        let pLog = plDis.attackZoneList.reduce((result, zone) => {
              result.log.push(logText(zone, enDis));
              result.damage = enDis.defenceZoneList.includes(zone) ? result.damage : result.damage + healthStep; 
              return result;
            }, {log:[], damage:0 });

        if (plDis.superAttackZoneList.length > 0) pLog = plDis.superAttackZoneList.reduce((rezult, zone) => {
              rezult.log.push(stText(zone) + winText(healthStep * 1.5));
              rezult.damage = rezult.damage + healthStep * 1.5;
              return rezult;
            }, pLog);
        

        let enLog = enDis.attackZoneList.reduce((rezult, zone) => {
              rezult.log.push(logText(zone, enDis));
              rezult.damage = enDis.defenceZoneList.includes(zone) ? rezult.damage : rezult.damage + healthStep; 
              return rezult;
            }, {log:[], damage:0 });

        if (enDis.superAttackZoneList.length > 0) enLog = enDis.superAttackZoneList.reduce((rezult, zone) => {
              rezult.log.push(stText(zone) + winText(healthStep * 1.5));
              rezult.damage = rezult.damage + healthStep * 1.5;
              return rezult;
            }, enLog);

        return { player:pLog, enemy:enLog } ;
    }


}