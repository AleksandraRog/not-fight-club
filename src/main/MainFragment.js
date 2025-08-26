import { Fragment } from "../common/Fragment";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";


export class MainFragment extends Fragment {
    
    async createView(){
        console.log('main frag');
        const fragment = document.createDocumentFragment();
        let container = document.createElement('div');
        container.classList.add('main-container');
        let fightButton = document.createElement('button');
        fightButton.classList.add('battle-button');
        fightButton.textContent = 'Fight!';
        container.appendChild(fightButton);
        fragment.appendChild(container);
        
        this.subscribe(
          fromEvent(fightButton, "click").pipe(map(() => ({ type: 'NAVIGATE', path: '/battle' })))
        );

        return fragment;
    }
}