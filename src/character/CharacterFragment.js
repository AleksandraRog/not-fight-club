import { Fragment } from "../common/Fragment";
import image from '../assets/images/lazy.png';


export class CharacterFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        
        this.intent$.subscribe(intent => {
            console.log('что-то происходит', intent);
            if (intent.type === 'TEXT_CHANGE') {
                console.log('text change');
                this.characterName = intent.value;
            }
            if (intent.type === 'SAVE') {
                console.log('save data');
                this.model.reduce(intent);
            }
        });
    }


    async createView(){
        
        const fragment = document.createDocumentFragment();
        let container = document.createElement('div');
        container.classList.add('main-container');

        const avatarImg = await this.createImage(image);

        let nameSpan = document.createElement('span');
        nameSpan.classList.add('character-name');
        nameSpan.textContent = this.model.character$.value?.name || '';

        let winsSpan = document.createElement('span');
        winsSpan.classList.add('character-wins');
        winsSpan.textContent = `wins: ${this.model.character$.value?.wins || 0}'`;

        let losesSpan = document.createElement('span');
        losesSpan.classList.add('character-loses');
        losesSpan.textContent = `loses: ${this.model.character$.value?.loses || 0}`;


        container.appendChild(avatarImg);
        container.appendChild(nameSpan);
        container.appendChild(winsSpan);
        container.appendChild(losesSpan);

        fragment.appendChild(container);

        return fragment ;
    }

    updateView (state) {
      let losesSpan = document.querySelector('.character-loses'),
      winsSpan = document.querySelector('.character-wins'),
      nameSpan = document.querySelector('.character-name'); 
      nameSpan.textContent = state.name;
      winsSpan.textContent = `wins: ${state.wins}`;
      losesSpan.textContent = `loses: ${state.loses}`;
    }

    createImage = (src) => new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
        img.alt = 'avatar';
    });

    mount() {
      this.subscriptions.push(
        this.model.character$.subscribe(state => this.updateView(state))
      );
    }

    unmount() {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];
      this.container = null;
    }
}