import { Hero } from "../common/HeroClass";
import { enemies, healthStep, zones } from "../common/utils";
import { Disposition } from "./Disposition";


export class BattleInteractor{

    createEnemy () {
        let i = Math.floor(Math.random() * Object.values(enemies).length) + 1; 
        const enemy = Object.assign(new Hero(), enemies[i])
        enemy.avatar = `./assets/avatars/avatar${i+4}.jpg`
        return enemy;
    }

    createEnemyDisposition(attendee){
        let attackList = new Set();
        let num;
        do {
           num = Math.floor(Math.random() * Object.values(zones).length) + 1;
           attackList.add(Object.keys(zones).find(k => zones[k].id === num));
        } while (attackList.size < attendee.attCount);
 
        let defenceList = new Set();
        do {
            num = Math.floor(Math.random() * Object.values(zones).length) + 1;
            defenceList.add(Object.keys(zones).find(k => zones[k].id === num));
        } while (defenceList.size < attendee.defCount);
        const disp = this.updateTypeAttack(new Disposition([... attackList], [... defenceList]));
        console.log('disp',disp);
        return disp;
    }

    attackSession(playerDisposition, enemyDisposition) {
        const plDis = playerDisposition;
        const enDis = enemyDisposition;
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
              rezult.log.push(stText(zone).replace('attacked', 'criticaly attacked') + winText(healthStep * 1.5));
              rezult.damage = rezult.damage + healthStep * 1.5;
              return rezult;
            }, pLog);
        

        let enLog = enDis.attackZoneList.reduce((rezult, zone) => {
              rezult.log.push(logText(zone, enDis));
              rezult.damage = enDis.defenceZoneList.includes(zone) ? rezult.damage : rezult.damage + healthStep; 
              return rezult;
            }, {log:[], damage:0 });

        if (enDis.superAttackZoneList.length > 0) enLog = enDis.superAttackZoneList.reduce((rezult, zone) => {
              rezult.log.push(stText(zone).replace('attacked', 'criticaly attacked') + winText(healthStep * 1.5));
              rezult.damage = rezult.damage + healthStep * 1.5;
              return rezult;
            }, enLog);

        return { player:pLog, enemy:enLog } ;
    }

    updateTypeAttack(disposition) {
        
        let j = Math.floor(Math.random() * 5) + 1; 
        let newDis = disposition;
        if(newDis.attackZoneList.length > 0 && j === 1) {
            newDis.superAttackZoneList.push(...newDis.attackZoneList.slice(-1));
            newDis.attackZoneList.pop();
        }
        return  newDis;
    }


}