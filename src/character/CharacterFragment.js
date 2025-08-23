import { Fragment } from "../common/Fragment";
import image from '../assets/images/lazy.png';


export class CharacterFragment extends Fragment {
    async createView(){
        const fragment = document.createDocumentFragment();
        let container = document.createElement('div');
        container.classList.add('main-container');

        const avatarImg = await this.createImage(image);

        let nameSpan = document.createElement('span');
        nameSpan.classList.add('character-name');
        nameSpan.textContent = 'Character span';

        let winsSpan = document.createElement('span');
        winsSpan.classList.add('character-wins');
        winsSpan.textContent = 'wins: 555';

        let losesSpan = document.createElement('span');
        losesSpan.classList.add('character-loses');
        losesSpan.textContent = 'loses: 555';


        container.appendChild(avatarImg);
        container.appendChild(nameSpan);
        container.appendChild(winsSpan);
        container.appendChild(losesSpan);

        fragment.appendChild(container);

        return fragment ;
    }

    createImage = (src) => new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
        img.alt = 'avatar';
    });
}