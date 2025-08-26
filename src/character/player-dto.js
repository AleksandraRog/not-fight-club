export class PlayerDto {
  constructor(name, wins = 0, loses = 0, avatar){
  this.name = name;
  this.wins = wins;
  this.loses = loses;
  this.avatar = avatar;
  }
}