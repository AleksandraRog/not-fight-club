import { Fragment } from "../common/Fragment";
import { fromEvent, merge } from "rxjs";
import { map } from "rxjs/operators";


export class SettingFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        this.fragmentState = { isSave: false };
        this.player = null;
        
        this.intent$.subscribe(intent => {
            console.log('что-то происходит', intent);
            if (intent.type === 'TEXT_CHANGE') {
                console.log('setting text change');
                this.player.name = intent.value;
            }
            if (intent.type === 'SAVE') {
                console.log('setting save data');
                this.model.reduce(intent);

                this.fragmentState = {... this.fragmentState, isSave: !this.fragmentState.isSave }
                this.updateView();
                if(this.fragmentState.isSave) {
                    this.model.reduce(intent)
                }
            }
        });
    }

    async createView() {   
      if (!this.player) {
        this.player = await this.model.loadPlayer();
      }

      let label = null, nameInput = null, 
      nameSpan = null, editeButton = null;
      const fragment = document.createDocumentFragment();
      const container = document.createElement('div');
      container.classList.add('main-container');
      label = document.createElement('label');
      label.textContent = 'Player Name:';
      nameSpan = document.createElement('span');
      nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.name = 'character-name';
      nameSpan.classList.add('character-name');
      editeButton = document.createElement('button');
      editeButton.textContent = this.fragmentState.isSave ? 'Save': 'Edit';
      nameInput.value = this.player.name;
      nameSpan.textContent = this.player.name;
      nameInput.classList.toggle("hidden", !this.fragmentState.isSave);
      nameSpan.classList.toggle("hidden", this.fragmentState.isSave);

      label.appendChild(nameSpan);
      label.appendChild(nameInput);
      container.appendChild(label);
      container.appendChild(editeButton);

      const textChangeIntent$ = fromEvent(nameInput, 'input').pipe(map((e) => ({type: 'TEXT_CHANGE', value: e.target.value})));
      const saveIntent$ = fromEvent(editeButton, 'click').pipe(map(() => ({type: 'SAVE', characterName: this.player.name})));    
      this.subscribe(
            merge(textChangeIntent$, saveIntent$)
      );

      fragment.appendChild(container);
      
      return fragment;
    }

    updateView () {
      let editeButton = document.querySelector('.main-container button');
      let nameInput = document.querySelector('.main-container input');
      let nameSpan = document.querySelector('.main-container .character-name'); 
      editeButton.textContent = this.fragmentState.isSave ? 'Save': 'Edit';
      nameInput.value = `${this.player.name}`;
      nameSpan.textContent = this.player.name;
      nameInput.classList.toggle("hidden", !this.fragmentState.isSave);
      nameSpan.classList.toggle("hidden", this.fragmentState.isSave);
    }
};