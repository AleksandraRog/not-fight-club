import { Fragment } from "../common/Fragment";


export class SettingFragment2 extends Fragment{

  createView(){
    if (fragmentState.isLoading) {
      const p = document.createElement("p");
      p.textContent = "Загрузка...";
      return p ;
    }
    if (fragmentState.error) {
      const p = document.createElement("p");
      p.textContent = `Ошибка: ${fragmentState.error}.`;
      return p ;
    }

    let container = null, label = null, nameInput = null, nameSpan = null, editeButton = null;
    const fragment = document.createDocumentFragment();
      container = document.createElement('div');
      container.classList.add('main-container');
      label = document.createElement('label');
      label.textContent = 'Player Name:';
      nameSpan = document.createElement('span');
      nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.classList.add('character-name');
      editeButton = document.createElement('button')
      editeButton.textContent = this.fragmentState.name;
      nameInput.value = this.fragmentState.characterName;
      nameInput.hidden = this.fragmentState.isSave;
      nameSpan.hidden = !this.fragmentState.isSave;

      label.appendChild(nameSpan);
      label.appendChild(nameInput);
      label.appendChild(editeButton);
      container.appendChild(label)
      subHeader = document.createElement('h2');
      subHeader.textContent = fragmentState.name;

      
      const startButton = document.createElement('button');
      startButton.textContent = 'Fight!';
      startButton.classList.add('start-button');
  
      container.appendChild(subHeader);
      container.appendChild(startButton);

      fragment.appendChild(container);

      return fragment;
  }
}