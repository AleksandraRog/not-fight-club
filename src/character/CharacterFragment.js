import { fromEvent, map } from "rxjs";
import { Fragment } from "../common/Fragment";
import { createImage } from "../common/utils";


export class CharacterFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        this.mainContainer = null;       
        
        this.intent$.subscribe(intent => {
          
            if (intent.type === 'CLICK') {
                this.model.pushState(intent);
            }
            if (intent.type === 'AVATAR') { 
             this.model.changeAvatar(intent); 
       }
        });
    }


    async createView(){
        
        const fragment = document.createDocumentFragment();
        this.mainContainer = document.createElement('div');
        let mainContainer = this.mainContainer;
        mainContainer.classList.add('main-container');

       const avatarImg = await createImage(this.model.character.avatar || '');
        const clickIntent$ = fromEvent(avatarImg, 'click')
              .pipe(map(() => ({type: 'CLICK', changeClick: true}))
            );
        this.subscribe(clickIntent$);
        
        let nameSpan = document.createElement('span');
        nameSpan.classList.add('character-name');
        nameSpan.textContent = this.model.character.name || '';

        let winsSpan = document.createElement('span');
        winsSpan.classList.add('character-wins');
        winsSpan.textContent = `wins: ${this.model.character.wins || 0}'`;

        let losesSpan = document.createElement('span');
        losesSpan.classList.add('character-loses');
        losesSpan.textContent = `loses: ${this.model.character.loses || 0}`;


        mainContainer.appendChild(avatarImg);
        mainContainer.appendChild(nameSpan);
        mainContainer.appendChild(winsSpan);
        mainContainer.appendChild(losesSpan);

        fragment.appendChild(mainContainer);

        return fragment ;
    }

    updateView (state) {
      let losesSpan = document.querySelector('.character-loses'),
      winsSpan = document.querySelector('.character-wins'),
      nameSpan = document.querySelector('.character-name'),
      av = this.mainContainer.querySelector('img');
      console.log('av', state.avatar);

      av.src = state.avatar;
      nameSpan.textContent = state.name;
      winsSpan.textContent = `wins: ${state.wins}`;
      losesSpan.textContent = `loses: ${state.loses}`;
    }

    async createAvatarsContainer(state) {
      let avContainer = document.querySelector('.avatars-container');
      
      if(state.changeClick && !avContainer) {
        avContainer = document.createElement('div');
        avContainer.classList.add('avatars-container');

      }
      
      if(state.changeClick) {
        let currentAvatar = this.model.character.avatar.slice(-5, -4);
        avContainer.innerHTML = '';

        console.log('cur', currentAvatar);
        for(let i = 1; i < 5; i += 1) {
          if(i !== Number(currentAvatar)) {
            const avatar = await createImage(`./assets/avatars/avatar${i}.jpg`);
            avContainer.appendChild(avatar);
            const checkIntent$ = fromEvent(avatar, 'click')
               .pipe(map(() => ({type: 'AVATAR', url: `./assets/avatars/avatar${i}.jpg`}))
            );
            
            this.subscribe(checkIntent$);
          }
        }

        this.mainContainer.appendChild(avContainer);
        avContainer.classList.add('show')
      } else {
        avContainer.remove('show');
      }
    
    }

    mount() {
      this.subscriptions.push(
        this.model.character$.subscribe(state => {
          console.log('frag', state);
          this.updateView(state);
        })
      )

      this.subscriptions.push(
        this.model.state$.subscribe(state => this.createAvatarsContainer(state))
      )
    }

    unmount() {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];
      this.container = null;
      this.model.clearState();
    }
}