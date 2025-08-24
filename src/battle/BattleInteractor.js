import { Hero } from "./common/Hero";
import { healthStep } from "./common/utils";


export class BattleInteractor{

    createEnemy () {
        return new Hero();
    }

    getEnemyDisposition() {
        return Array();
    }

    attackSession(playerDisposition, enemyDisposition) {
        let plDis = {DEF: [LEGS, BODY, BELLY], ATT:[BODY], SUPAT:[]};
        let enDis = {DEF:[BELLY, LEGS], ATT:[LEGS, HEAD], SUPAT:[]}

        const stText = (zone) => `** attacked && to ${zone} `;
        const winText = (health) => `and deal ${health} damage.`;
        const noneText = (zone) => `bat && was able to protected his ${zone}`; 
        const logText = (zone, enemy) => stText(zone) + enemy.DEF.includes(zone) ? noneText(zone) : winText(healthStep);  
        let pLog = plDis.ATT.reduce((result, zone) => {
              result.log.push(logText(zone, enDis));
              result.damage = enDis.DEF.includes(zone) ? result.damage : result.damage + healthStep; 
              return result;
            }, {log:[], damage:0 });

        if (plDis.SUPAT.length > 0) pLog = plDis.SUPAT.reduce((rezult, zone) => {
              rezult.log.push(stText(zone) + winText(healthStep * 1.5));
              rezult.damage = rezult.damage + healthStep * 1.5;
              return rezult;
            }, pLog);
        

        let enLog = enDis.ATT.reduce((rezult, zone) => {
              rezult.log.push(logText(zone, enDis));
              rezult.damage = enDis.DEF.includes(zone) ? rezult.damage : rezult.damage + healthStep; 
              return rezult;
            }, {log:[], damage:0 });

        if (enDis.SUPAT.length > 0) enLog = enDis.SUPAT.reduce((rezult, zone) => {
              rezult.log.push(stText(zone) + winText(healthStep * 1.5));
              rezult.damage = rezult.damage + healthStep * 1.5;
              return rezult;
            }, enLog);

        return pLog, enLog ;
    }


}