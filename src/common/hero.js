import * as util from "./utils.js";

export class Hero {
  constructor(name = '', wins = 0, loses = 0, avatar = '', player = false, health = util.health, attCount = 0, defCount = 0){
  this.name = name;
  this.avatar = avatar;
  this.wins = wins;
  this.loses = loses;
  this.player = player;
  this.health = health;
  this.attCount = attCount;
  this.defCount = defCount;
  }
}