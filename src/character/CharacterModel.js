import { BehaviorSubject, from} from "rxjs";
import { Model } from "../common/Model";


export class CharacterModel extends Model{
    constructor(repository, storagRepository = null){
      super(repository, storagRepository);
      this.character$ = new BehaviorSubject(null);

      from(this.repository.getCharacter()).subscribe(player => {
        this.character$.next(player);
      });

      this.repository.characterChanges$.subscribe(player => {
        this.character$.next(player);
      });
    }    
}
