import { Hero } from "../common/hero";
import { Model } from "../common/Model";


export class StartModel extends Model{

  reduce(intent) {
    const character = new Hero(intent.characterName);
    this.repository.saveCharacter(character);
  }    
}