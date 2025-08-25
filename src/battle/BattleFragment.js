import { filter, fromEvent, map, merge } from "rxjs";
import { Fragment } from "../common/Fragment";
import { createImage, zones } from "../common/utils";


export class BattleFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        this.player = null;
        this.logList = null

        this.intent$.subscribe(intent => {
            if (intent.type === 'GAME') {
                 this.model.attackSession();
            };
            if (intent.type === 'CHECK'){
              this.model.updatePlayerDisposition(intent)
            }

            if (intent.type === 'SAVE'){
              this.model.savePlayerResult(intent);
            }
         });
        
    }


    async createView() {
        if (!this.player) {
          this.player = await this.model.loadPlayer();
        }
        console.log('проверки созд вью');
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

        enemyContainer.appendChild(await this.createAttendeeView(this.model.battle.enemy));

        dispositionRules = document.createElement('span')
        dispositionRules.textContent = `Please pick ${this.model.battle.playerAttackZoneCount} Attack zone and ${this.model.battle.playerDefenceZoneCount} Defence zone`;
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
        attackButton.disabled = true;

        const attackIntent$ = fromEvent(attackButton, 'click')
          .pipe(map(() => ({type: 'GAME'}))
        ); 

        const checkIntent$ = fromEvent(checkboxWrapper, 'change').pipe(
        filter(ev => ev.target.type === "checkbox"),
        map(ev => ({
          type: 'CHECK',
          group: ev.target.name,
          value: ev.target.value,
          checked: ev.target.checked
        }))); 

        this.subscribe(merge(attackIntent$, checkIntent$));

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
        this.createScore(attendee, scoreLine, currentScore);

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

    updateScore (attendee, state) {
      console.log('проверки обн прог');
      const container = document.querySelector(`.${attendee.player ? 'player-container' : 'enemy-container'}`);   
      const score = attendee.player ? state.playerScore : state.enemyScore;
      const percent = Math.floor( score / attendee.health * 100);
      const progress = container.querySelector('.score-line');  
      progress.style.background = `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #C4C4C4 ${percent}%, #C4C4C4 100%)`;
      const currentScore = container.querySelector('.current-score');
      currentScore.textContent = score;  
    }

    createScore(attendee, progress, currentScore){ 
      const score = attendee.player ? this.model.battle.playerScore : this.model.battle.enemyScore;
      const percent = Math.floor( score / attendee.health * 100);
      progress.style.background = `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #C4C4C4 ${percent}%, #C4C4C4 100%)`;
      currentScore.textContent = score;
    }

    updateButtonState(state) {
      const attackButton = document.querySelector('.disposition-container button');
      attackButton.disabled = !state.isReady || state.finish;
    }

    updateLogs (state) {
        console.log('проверки обн лог');
        this.logList = document.querySelector('.log-list');
        const logCount = this.logList.querySelectorAll('li').length;
        for( let i = logCount; i < state.length; i += 1) {
            let logItem = document.createElement('li');
            logItem.innerHTML = state[i].replace(this.model.player.name, `<strong>${this.model.player.name}</strong>`).replace(this.model.battle.enemy.name, `<strong>${this.model.battle.enemy.name}</strong>`);
            this.logList.appendChild(logItem);
        }
    }

    updateFinish(state) {
      if(state.finish) {
        const container = document.querySelector('.main-container');
        let finishMessage = document.createElement('div');
        finishMessage.classList.add('finish-message');
        container.appendChild(finishMessage);
        finishMessage.classList.add('show');
        if(state.playerScore > state.enemyScore) {
          finishMessage.textContent = 'Congratulation with your win!';
        } else {
          finishMessage.textContent = 'Maybe next time :(';
        }
        
        const navIntent$ = fromEvent(finishMessage, 'click').pipe(map(() => ({type: 'NAVIGATE', path: '/character'})));
        const saveIntent$ = fromEvent(finishMessage, 'click').pipe(map(() => ({type: 'SAVE', result: state.playerScore > state.enemyScore ? 1 : -1 })));
        this.subscribe(merge(saveIntent$,navIntent$));
      }
    }

    

    mount() {
      this.subscriptions.push(
        this.model.player$.subscribe(state => this.updateView(state))
      );

      this.subscriptions.push(
        this.model.battle$.subscribe(state => {
          console.log('проверка остатков подписки')
          this.updateScore(state.player, state);
          this.updateScore(state.enemy, state); 
          this.updateButtonState(state);
          this.updateLogs(state.battleLog);
          this.updateFinish(state);
        })
      );
    }

    unmount() {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];
      this.container = null;
      this.logList = null;
    }
}