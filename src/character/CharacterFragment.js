import { fromEvent, map, merge } from "rxjs";
import { Fragment } from "../common/Fragment";
import { createImage } from "../common/utils";


export class CharacterFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        this.mainContainer = null; 
        this.avatarContainer = null;      
        
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
      av.src = state.avatar;
      nameSpan.textContent = state.name;
      winsSpan.textContent = `wins: ${state.wins}`;
      losesSpan.textContent = `loses: ${state.loses}`;
    }

    async createAvatarsContainer(state) {
      if(!state.changeClick) this.avatarContainer.classList.remove('show');
           
      if(state.changeClick && !this.avatarContainer) {
        this.avatarContainer = document.createElement('div');
        this.avatarContainer.classList.add('avatars-container');

      }
      
      if(state.changeClick) {
        let currentAvatar = this.model.character.avatar.slice(-5, -4);
        this.avatarContainer.innerHTML = '';

        const closeButton = document.createElement('button');
        this.avatarContainer.appendChild(closeButton);
        closeButton.textContent = 'cls';
        const closeIntent$ = fromEvent(closeButton, 'click')
          .pipe(map(() => ({type: 'CLICK', changeClick: false})));
            
        this.subscribe(closeIntent$);

        const wrapper = document.createElement('div');
        

        for(let i = 1; i < 5; i += 1) {
          if(i !== Number(currentAvatar)) {
            const avatar = await createImage(`./assets/avatars/avatar${i}.jpg`);
            wrapper.appendChild(avatar);
            const checkIntent$ = fromEvent(avatar, 'click')
               .pipe(map(() => ({type: 'AVATAR', url: `./assets/avatars/avatar${i}.jpg`}))
            );
            const updateAvatarIntent$ = fromEvent(avatar, 'click')
               .pipe(map(() => ({type: 'CLICK', changeClick: true}))
            );
            
            this.subscribe(merge(checkIntent$, updateAvatarIntent$));
          }
        }
        this.avatarContainer.appendChild(wrapper);
        this.mainContainer.appendChild(this.avatarContainer);
        this.avatarContainer.classList.add('show')
      } else {
        this.avatarContainer.remove('show');
      }
    
    }

    mount() {
      this.subscriptions.push(
        this.model.character$.subscribe(state => {
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
      this.mainContainer = null; 
      this.avatarContainer = null;     
    }
}