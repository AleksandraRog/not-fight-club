import { Battle } from "./BattleClass";


export class BattleState{
    constructor(type = '', battle = new Battle()){
        this.type = type;
        this.battle = battle;
    }
}