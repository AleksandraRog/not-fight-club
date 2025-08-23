export class PlayerDto {
  constructor(name, wins = 0, loses = 0, avatar = ''){
  this.name = name;
  this.avatar = avatar;
  this.wins = wins;
  this.loses = loses;
  }
}