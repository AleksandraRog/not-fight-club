

export class HeroDto {
  constructor(name = '', avatar = '', player = false, health = 0, attCount = 0, defCount = 0){
  this.name = name;
  this.avatar = avatar;
  this.player = player;
  this.health = health;
  this.attCount = attCount;
  this.defCount = defCount;
  }
}