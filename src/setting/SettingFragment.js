import { Fragment } from "../common/Fragment";

export class SettingFragment extends Fragment {
    async createView(){
        const fragment = document.createDocumentFragment();
        let container = document.createElement('div');
        container.classList.add('main-container');
        let nameSpan = document.createElement('span');
        nameSpan.classList.add('character-name');
        nameSpan.textContent = 'Setting span';
        container.appendChild(nameSpan);
        fragment.appendChild(container)
        return fragment;
    }
};