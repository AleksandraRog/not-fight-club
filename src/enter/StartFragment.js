import { Fragment } from "../common/Fragment";
import { fromEvent, merge } from "rxjs";
import { map } from "rxjs/operators";


export class StartFragment extends Fragment {
    constructor(fragmentState, model){
        super(fragmentState, model);
        this.characterName = '';
        
        this.intent$.subscribe(intent => {
          if (intent.type === 'TEXT_CHANGE') {
            this.characterName = intent.value;
          }
          if (intent.type === 'SAVE') {
            this.model.reduce(intent);
          }
        });
    }

  async createView() {
    const fragment = document.createDocumentFragment();
    const title = document.createElement('h1');
    title.textContent = 'Create Your Character';
    const labelCharacterNameInput = document.createElement('label');
    labelCharacterNameInput.textContent = 'Character Name';
    const characterNameInput = document.createElement('input');
    characterNameInput.type = 'text';
    characterNameInput.value = this.characterName;
    labelCharacterNameInput.appendChild(characterNameInput);
    const textChangeIntent$ = fromEvent(characterNameInput, 'input').pipe(map((e) => ({type: 'TEXT_CHANGE', value: e.target.value})));

    const button = document.createElement("button");
    button.textContent = "Create character!";
     
    fragment.appendChild(title);
    fragment.appendChild(labelCharacterNameInput);
    fragment.appendChild(button);

    const navIntent$ = fromEvent(button, 'click').pipe(map(() => ({type: 'NAVIGATE', type2: 'MAIN_SCREEN_GO', path: '/main'})));
    const saveIntent$ = fromEvent(button, 'click').pipe(map(() => ({type: 'SAVE', characterName: this.characterName})));    
    this.subscribe(
      merge(textChangeIntent$, saveIntent$, navIntent$)
    );

    return fragment;
  }

}