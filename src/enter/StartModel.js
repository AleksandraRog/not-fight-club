import { Player } from "../character/player";
import { Model } from "../common/Model";


export class StartModel extends Model{

  reduce(intent) {
    const character = new Player(intent.characterName);
    this.repository.saveCharacter(character);
  }    
}