import { filter, fromEvent, map, merge } from "rxjs";
import { Fragment } from "../common/Fragment";
import { createImage, zones } from "../common/utils";


export class BattleFragment extends Fragment {
    constructor(fragmentState, model) {
        super(fragmentState, model);
        this.logList = null;
        this.playerContainer = null;
        this.enemyContainer = null;
        this.attackCheckbox = null;
        this.defenceCheckbox = null;
        this.dispositionRules = null;
        this.playerName = null;
        this.enemyName = null;
        this.playerBaseScore = null;
        this.enemyBaseScore = null;


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

      document.querySelector('footer').classList.remove('show');
        if (!this.model.battle) {
          this.model.getBattle();
        }
        const fragment = document.createDocumentFragment();
        let dispositionContainer = null, dispositionRules = null,
        checkboxWrapper = null, attackButton = null,
        container = null;
        container = document.createElement('div');
        container.classList.add('main-container');
        container.classList.add('battle');
        this.playerContainer = document.createElement('div');
        this.playerContainer.classList.add('player-container');
        this.enemyContainer = document.createElement('div');
        this.enemyContainer.classList.add('enemy-container');
        this.playerContainer.appendChild(await this.createAttendeeView({player: true}));
          //this.model.battle.player));

        this.enemyContainer.appendChild(await this.createAttendeeView({player: false}));
          //this.model.battle.enemy));

        this.dispositionRules = document.createElement('span')
   //     dispositionRules.textContent = `Please pick ${this.model.battle.playerAttackZoneCount} Attack zone and ${this.model.battle.playerDefenceZoneCount} Defence zone`;
        this.defenceCheckbox = document.createElement('div');
        this.defenceCheckbox.classList.add('checkbox-container');
        this.defenceCheckbox.classList.add('defence');
        this.attackCheckbox = document.createElement('div');
        this.attackCheckbox.classList.add('checkbox-container');
        this.attackCheckbox.classList.add('attack');
        this.defenceCheckbox.appendChild(this.createCheckbox(zones, 'Defence'));
        this.attackCheckbox.appendChild(this.createCheckbox(zones, 'Attack'));
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

        dispositionContainer.appendChild(this.dispositionRules);
        checkboxWrapper.appendChild(this.attackCheckbox);
        checkboxWrapper.appendChild(this.defenceCheckbox);
        dispositionContainer.appendChild(checkboxWrapper);
        dispositionContainer.appendChild(attackButton);
        container.appendChild(this.playerContainer);
        container.appendChild(dispositionContainer);
        container.appendChild(this.enemyContainer);
        fragment.appendChild(container);        
        document.querySelector('footer').classList.add('show');
        return fragment;

    }

    onCreateView(state){
        this.dispositionRules.textContent = `Please pick ${state.playerAttackZoneCount} Attack zone and ${state.playerDefenceZoneCount} Defence zone`;
        this.playerBaseScore.textContent = state.player.health;
        this.enemyBaseScore.textContent = state.enemy.health;
        
        const enemyName = this.enemyContainer.querySelector('h6'),
        enemyAvatar = this.enemyContainer.querySelector('img');
        if (enemyAvatar.src !== state.enemy.avatar) enemyAvatar.src = state.enemy.avatar;
        enemyName.textContent = state.enemy.name;

        this.updateView (state); 


    }

    async createAttendeeView(attendee){
      
        const fragment = document.createDocumentFragment();
        let avatar = null, scoreLine = null,
        scoreText = null, currentScore = null;
        if(attendee.player) {
          this.playerName = document.createElement('h6');
          this.playerBaseScore = document.createElement('span');
          fragment.appendChild(this.playerName);
        } else {
          this.enemyName = document.createElement('h6');
          this.enemyBaseScore = document.createElement('span');
          fragment.appendChild(this.enemyName);
        }
        avatar = await createImage('./assets/avatars/avatar1.jpg');
        scoreLine = document.createElement('div');
        scoreLine.classList.add('score-line');
        scoreText = document.createElement('div');
        currentScore = document.createElement('span');
        currentScore.classList.add('current-score');
        currentScore.textContent = '';
        scoreText.appendChild(currentScore);
        scoreText.append(' / ');
        scoreText.appendChild(attendee.player ? this.playerBaseScore : this.enemyBaseScore);
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

      this.updatePlayer(state.player);
      this.updateCheckbox(state);
      this.updateScore({ player: true }, state);
      this.updateScore({ player: false }, state); 
      this.updateLogs(state.battleLog);
      this.updateButtonState(state);
      if(state.finish) this.updateFinish(state);
    }

    updatePlayer(state) {
      const playerName = this.playerContainer.querySelector('h6'),
      playerAvatar = this.playerContainer.querySelector('img');
      if (playerAvatar.src !== state.avatar) playerAvatar.src = state.avatar;
      playerName.textContent = state.name;
    }

    updateCheckbox(state){
      state.playerDisposition.attackZoneList.forEach(element => {
        this.attackCheckbox.querySelector(`input[value = "${zones[element].name}"]`).checked = true;
      });
      state.playerDisposition.superAttackZoneList.forEach(element => {
        this.attackCheckbox.querySelector(`input[value = "${zones[element].name}"]`).checked = true;
      });
      state.playerDisposition.defenceZoneList.forEach(element => {
        this.defenceCheckbox.querySelector(`input[value = "${zones[element].name}"]`).checked = true;
      });
    }

    updateScore (attendee, state) {
      
      const container = document.querySelector(`.${attendee.player ? 'player-container' : 'enemy-container'}`);   
      const score = attendee.player ? state.playerScore : state.enemyScore;
      const percent = Math.floor( score /(attendee.player ? state.player.health : state.enemy.health) * 100);
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
        this.logList = document.querySelector('.log-list');
        const logCount = this.logList.querySelectorAll('li').length;

        for( let i = logCount; i < state.length; i += 1) {
            let logItem = document.createElement('li');
            logItem.innerHTML = state[i]
            .replace(this.model.battle.player.name,
              `<strong>${this.model.battle.player.name}</strong>`)
            .replace(this.model.battle.enemy.name, 
              `<strong>${this.model.battle.enemy.name}</strong>`);
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
    
      if(this.model.battle) {
        this.model.pushOnCreateView();
      }
      this.subscriptions.push(
        this.model.battle$.pipe(filter
          (state => state.type === 'attack'))
          .subscribe(state => {
          this.updateScore({ player: true }, state.battle);
          this.updateScore({ player: false }, state.battle); 
          this.updateLogs(state.battle.battleLog);
          this.updateButtonState(state.battle);
          if(state.battle.finish) this.updateFinish(state.battle);
          }
        )
      );

      this.subscriptions.push(
        this.model.battle$.pipe(filter
          (state => state.type === 'restoreState'))
          .subscribe(state => {
            this.onCreateView(state.battle);}
        )
      );

      this.subscriptions.push(
        this.model.battle$.pipe(filter
          (state => state.type === 'activeAttackButton'))
          .subscribe(state => {
            this.updateButtonState(state.battle)
          })
      );

      this.subscriptions.push(
        this.model.battle$.pipe(filter
          (state => state.type === 'player'))
          .subscribe(state => this.updatePlayer(state.battle.player)
        )
      );

      this.subscriptions.push(
        this.model.battle$.pipe(filter
          (state => state.type === 'startFragment'))
          .subscribe(state => this.onCreateView(state.battle)
        )
      );


    }

    unmount() {
      this.subscriptions.forEach(s => s.unsubscribe());
      this.subscriptions = [];
      if(this.logList && this.model.battle.battleLog.length === 0) this.logList.innerHTML = '';
      this.playerContainer = null;
      this.enemyContainer = null;
      this.attackCheckbox = null;
      this.defenceCheckbox = null;
    }
}