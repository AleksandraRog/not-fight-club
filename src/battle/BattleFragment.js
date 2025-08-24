import { fromEvent, map, merge } from "rxjs";
import { Fragment } from "../common/Fragment";
import { createImage, zones } from "../common/utils";


export class BattleFragment extends Fragment {
    constructor(fragmentState, model, player) {
        super(fragmentState, model);
        this.player = null;

        this.intent$.subscribe(intent => {
            if (intent.type === 'GAME') {
                 this.model.attackSession();
            };
         });
    }


    async createView() {
        if (!this.player) {
          this.player = await this.model.loadPlayer();
        }
        const fragment = document.createDocumentFragment();
        let playerContainer = null, enemyContainer = null,
        dispositionContainer = null, dispositionRules = null,
        attackCheckbox = null, defenceCheckbox = null,
        checkboxWrapper = null, attackButton = null,
        container = null;
        container = document.createElement('div');
        container.classList.add('main-container');
        playerContainer = document.createElement('div');
        playerContainer.classList.add('player-container');
        enemyContainer = document.createElement('div');
        enemyContainer.classList.add('enemy-container');
        playerContainer.appendChild(await this.createAttendeeView(this.player));

        enemyContainer.appendChild(await this.createAttendeeView({name: 'enemy', avatar: '../assets/images/lazy.png', health : 150})) 
        dispositionRules = document.createElement('span')
        dispositionRules.textContent = 'Please pick 2 Attack zone and 3 Defence zone';
        defenceCheckbox = document.createElement('div');
        defenceCheckbox.classList.add('checkbox-container');
        defenceCheckbox.classList.add('defence');
        attackCheckbox = document.createElement('div');
        attackCheckbox.classList.add('checkbox-container');
        attackCheckbox.classList.add('attack');
        defenceCheckbox.appendChild(this.createCheckbox(zones, 'Defence'));
        attackCheckbox.appendChild(this.createCheckbox(zones, 'Attack'));
        dispositionContainer = document.createElement('div');
        dispositionContainer.classList.add('disposition-container');
        checkboxWrapper = document.createElement('form');
        checkboxWrapper.classList.add('checkbox-form');
        attackButton = document.createElement('button');
        attackButton.textContent = 'Attake!';

        const attackIntent$ = fromEvent(attackButton, 'click')
          .pipe(map(() => ({type: 'GAME'}))
        ); 
        
        this.subscribe(merge(attackIntent$));

        dispositionContainer.appendChild(dispositionRules);
        checkboxWrapper.appendChild(attackCheckbox);
        checkboxWrapper.appendChild(defenceCheckbox);
        dispositionContainer.appendChild(checkboxWrapper);
        dispositionContainer.appendChild(attackButton);
        container.appendChild(playerContainer);
        container.appendChild(dispositionContainer);
        container.appendChild(enemyContainer);
        fragment.appendChild(container);
        
        return fragment;

    }

    async createAttendeeView(attendee){
        const fragment = document.createDocumentFragment();
        let name = null, avatar = null, scoreLine = null,
        scoreText = null, baseScore = null, currentScore = null;
        name = document.createElement('h6');
        name.textContent = attendee.name;
        avatar = await createImage(attendee.avatar || '');
        scoreLine = document.createElement('div');
        scoreLine.classList.add('score-line');
        scoreText = document.createElement('div');
        currentScore = document.createElement('span');
        currentScore.classList.add('current-score');
        currentScore.textContent = attendee.health;
        scoreText.appendChild(currentScore);
        scoreText.append(' / ');
        baseScore = document.createElement('span');
        baseScore.textContent = attendee.health;
        scoreText.appendChild(baseScore);
        fragment.appendChild(name);
        fragment.appendChild(avatar);
        fragment.appendChild(scoreLine);
        fragment.appendChild(scoreText);

        return fragment;
    }

    createCheckbox(box, hand) {
        const fragment = document.createDocumentFragment();
        let title = document.createElement('p');
        title.textContent = `${hand} Zones`;
        fragment.appendChild(title);
        for (const item of Object.values(box)) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = item.name;
            input.name = hand;
            const titleItem = document.createTextNode(item.name);
            if (hand === 'Attack'){
                label.appendChild(input);
                label.insertBefore(titleItem, input);
            } else {
                label.appendChild(input);
                label.appendChild(titleItem);
            }
            fragment.appendChild(label);
        }
        return fragment;
    }

    updateView (state) {
      const playerContainer = document.querySelector('.player-container'),
      playerName = playerContainer.querySelector('h6'),
      playerAvatar = playerContainer.querySelector('img');
      if (playerAvatar.src !== state.avatar) playerAvatar.src = state.avatar;
      playerName.textContent = state.name;
    }

    updateScor (state) {
      let losesSpan = document.querySelector('.character-loses'),
      winsSpan = document.querySelector('.character-wins'),
      nameSpan = document.querySelector('.character-name'); 
      nameSpan.textContent = state.name;
      winsSpan.textContent = `wins: ${state.wins}`;
      losesSpan.textContent = `loses: ${state.loses}`;
    }

    updateLogs (state) {
        const logList = document.querySelector('.log-list');
        const logCount = logList.querySelectorAll('li').length;
        for( let i = logCount; i < state.length; i += 1) {
            let logItem = document.createElement('li');
            logItem.textContent = state[i];
            logList.appendChild(logItem);
        }
    }

    mount() {
      this.subscriptions.push(
        this.model.player$.subscribe(state => this.updateView(state))
      );
    }

    unmount() {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];
      this.container = null;
    }
}