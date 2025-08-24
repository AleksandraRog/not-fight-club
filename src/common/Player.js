import { Hero } from './HeroClass';
import { playerAttCount, playerDefCount } from './utils';


export class Player extends Hero{
    constructor(name, wins, loses, avatar, player, health, attCount, defCount){
      super(name, wins, loses, avatar, player, health, attCount, defCount);
      this.avatar = '../assets/images/lazy.png';
      this.player = true;
      this.attCount = playerAttCount;
      this.defCount = playerDefCount;
    }
}