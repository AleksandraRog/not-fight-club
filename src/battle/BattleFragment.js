import { merge } from "rxjs";
import { di } from "../common/di";
import { Fragment } from "../common/Fragment";
import { zones } from "../common/utils";


export class BattleFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        
        this.intent$.subscribe(intent => {
            console.log('что-то происходит', intent);
            if (intent.type === 'GAME') {
                 console.log('game');
                 this.model.attackSession()
        //         this.characterName = intent.value;
        //     }
        //     if (intent.type === 'SAVE') {
        //         console.log('save data');
        //         this.model.reduce(intent);
             };
         });
    }


    async createView() {
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
        playerContainer.appendChild(this.createAttendeeView({name: 'hero', url: './//', baseScore : 150}));
        enemyContainer.appendChild(this.createAttendeeView({name: 'enemy', url: './//', baseScore : 150})) 
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
        //attackButton.disabled = 'di'
        const attackIntent$ = fromEvent(attackButton, 'click')
        .pipe(map(() => ({type: 'GAME'}))); 
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

    createAttendeeView(attendee){
        const fragment = document.createDocumentFragment();
        let name = null, avatar = null, scoreLine = null,
        scoreText = null, baseScore = null, currentScore = null;
        name = document.createElement('h6');
        name.textContent = attendee.name;
        avatar = document.createElement('div')
        avatar.textContent = attendee.url;
        scoreLine = document.createElement('div');
        scoreLine.classList.add('score-line');
        scoreText = document.createElement('div');
        currentScore = document.createElement('span');
        currentScore.classList.add('current-score');
        currentScore.textContent = attendee.baseScore;
        scoreText.appendChild(currentScore);
        scoreText.append(' / ');
        baseScore = document.createElement('span');
        baseScore.textContent = attendee.baseScore;
        scoreText.appendChild(baseScore);
        fragment.appendChild(name);
        fragment.appendChild(avatar);
        fragment.appendChild(scoreLine);
        fragment.appendChild(scoreText);

        return fragment;
    }

    createCheckbox(box, hand) {
        const fragment = document.createDocumentFragment();
        console.log(Object.values(box));
        let title = document.createElement('p');
        title.textContent = `${hand} Zones`;
        fragment.appendChild(title);
        for (const item of Object.values(box)) {
            console.log(Object.values(box));
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
}