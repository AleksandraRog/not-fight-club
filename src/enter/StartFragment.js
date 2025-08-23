import { Fragment } from "../common/Fragment";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";


export class StartFragment extends Fragment {
    constructor(fragmentState){
        super(fragmentState);
        this.characterName = '';

        this.intent$.subscribe(intent => {
            if (intent.type === 'TEXT_CHANG') {
                this.characterName = intent.value;
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

    this.subscribe(
        fromEvent(characterNameInput, 'input').pipe(map((e) => ({type: 'TEXT_CHANGE', value: e.target.value})))
    );

    const button = document.createElement("button");
    button.textContent = "Create character!";
     
    fragment.appendChild(title);
    fragment.appendChild(labelCharacterNameInput);
    fragment.appendChild(button);

   
    this.subscribe(
      fromEvent(button, "click").pipe(map(() => ({ type: 'NAVIGATE', type2: "MAIN_SCREEN_GO", path: '/main' })))
    );

    return fragment;
  }

}