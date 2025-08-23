import { Fragment } from "../common/Fragment";
import { zones } from "../common/utils";


export class BattleFragment extends Fragment {
    async createView() {
        const fragment = document.createDocumentFragment();
        let playerContainer = null, enemyContainer = null,
        dispositionContainer = null, dispositionRules = null,
        attackCheckbox = null, defenceCheckbox = null;
        playerContainer = document.createElement('div');
        playerContainer.classList.add('player-container');
        enemyContainer = document.createElement('div');
        enemyContainer.classList.add('enemy-container');
        playerContainer.appendChild(this.createAttendeeView({name: 'hero', url: './//', baseScore : 150}));
        enemyContainer.appendChild(this.createAttendeeView({name: 'enemy', url: './//', baseScore : 150})) 
        dispositionRules = document.createElement('span')
        dispositionRules.textContent = '2 att, 3 defence';
        defenceCheckbox = document.createElement('div');
        attackCheckbox = document.createElement('div');
        defenceCheckbox.appendChild(this.createCheckbox(zones, 'Defence'));
        attackCheckbox.appendChild(this.createCheckbox(zones, 'Attack'));
        dispositionContainer = document.createElement('div');
        dispositionContainer.classList.add('disposition-container');
        dispositionContainer.appendChild(dispositionRules);
        dispositionContainer.appendChild(attackCheckbox);
        dispositionContainer.appendChild(defenceCheckbox);
        fragment.appendChild(playerContainer);
        fragment.appendChild(dispositionContainer);
        fragment.appendChild(enemyContainer);
        
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
}