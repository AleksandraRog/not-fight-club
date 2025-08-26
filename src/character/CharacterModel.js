import { BehaviorSubject, from, Subject} from "rxjs";
import { Model } from "../common/Model";


export class CharacterModel extends Model{
    constructor(repository, storageRepository){
      super(repository, storageRepository);
      this.state = null;
      this.character = null;
      this.character$ = new BehaviorSubject();
      this.state$ = new Subject();

      from(this.repository.getCharacter()).subscribe(player => {
        this.character = player;
        this.character$.next(player);
        this.saveState();
      });

      this.repository.characterChanges$.subscribe(player => {
        this.character = player;
        this.character$.next(player);
        this.saveState();
      });

      this.restoreState();
    } 
    
    pushState(intent){
      this.state$.next({changeClick: intent.changeClick})
    }

    changeAvatar(intent){
      this.character.avatar = intent.url;
      this.repository.saveCharacter(this.character);
    }

    restoreState() {
      const savedState = this.storageRepository.getItem('characterState', true);
      if (savedState) {
        this.character = savedState;
      }
    }

    saveState() {
      this.storageRepository.setItem('characterState', this.character, true); 
    }

    clearState() {
      this.storageRepository.removeItem('characterState', true);
    }
}
