

export class DispositionDto{
    constructor(attackZoneList = [], defenceZoneList = [], superAttackZoneList = []){
        this.attackZoneList = attackZoneList;
        this.defenceZoneList = defenceZoneList;
        this.superAttackZoneList =superAttackZoneList;
    }
}