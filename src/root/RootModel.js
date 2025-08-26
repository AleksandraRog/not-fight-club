import { fromEvent, merge, EMPTY, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Model } from "../common/Model";

export class RootModel extends Model{

    constructor(repository, storageRepository) {
      super(repository, storageRepository);
      this.state = this.createScreenState();
      this.intent$ = new Subject();
      this.bindRootIntent(document.querySelector('body'));
    }

    init() {
      const firstEnter = location.hash === "" || location.hash === "#/";
  
      if (firstEnter) {
        this.clearState();
      } else {
        this.restoreState();
      }          

      this.intent$.subscribe(action => {
        if (action.type.startsWith("NAVIGATE")) {
          console.log('int', action);
          this.updateScreen(action); 
          this.saveState();
        }
      });

      const currentPath = location.hash.replace("#", "");

      this.getPlayer();

      if (!currentPath) {
        this.intent$.next({ type: 'NAVIGATE', path: '/' });
      } else {
        this.intent$.next({ type: 'NAVIGATE', path: currentPath });
      }
    }

    async updateScreen(action) {

      switch (action.path) {
        case "/":
          try {
            this.state.isLoading = true;
            const initial = await this.getPlayer();
            if (initial) {
              this.intent$.next({type: 'NAVIGATE', path: '/main'});
            } else {
              this.state = { ...this.state, screen: 'Start', isLoading: false, error: null };
            }
          } catch (e) {
            this.state = { ...this.state, isLoading: false, error: e.message };
          }
          break;

        case "/main":
          console.log('main');
          this.state = { ...this.state, name: 'Main', withHeader: true, withFooter: false, fragment: 'mainFragment' };
          break;

        case "/battle":
          this.state = { ...this.state, name: 'Battle', withHeader: true, withFooter: true, fragment: 'battleFragment' };
          break;  

        case "/setting":
          this.state = { ...this.state, name: 'Setting', withHeader: true, withFooter: false, fragment: 'settingFragment' };
          if (this.currentFragment) this.currentFragment.unmount();
          break;
        
          
        case "/character":
          this.state = { ...this.state, name: 'Character', withHeader: true, withFooter: false, fragment: 'characterFragment' };
          break;  
      }

      this.render(this.state);
      this.saveState();
    }

  createScreenState() {
      return {
        screen: 'DEFAULT',
        name: 'Welcome',
        withHeader: false,
        withFooter: false, 
        isLoading: true,
        error: null,
        fragment: null
      }
  }

  bindRootIntent(dom) {
    const streams = [];
  
    const mainBtn = dom.querySelector(".main-button");
    if (mainBtn) streams.push(fromEvent(mainBtn, "click").pipe(map(() => ({ type: 'NAVIGATE', path: '/main' }))));
  
    const settingBtn = dom.querySelector(".setting-button");
    if (settingBtn) streams.push(fromEvent(settingBtn, "click").pipe(map(() => ({ type: 'NAVIGATE', path: '/setting' }))));
  
    const characterBtn = dom.querySelector(".character-button");
    if (characterBtn) streams.push(fromEvent(characterBtn, "click").pipe(map(() => ({ type: 'NAVIGATE', path: '/character' }))));
    
    if (streams.length > 0) {
      merge(...streams).subscribe(action => this.intent$.next(action)); 
    }
  }

  render(state) {
    const footer = document.querySelector("footer");
    footer.classList.add('fade-in');
    footer.classList.toggle('show', this.state.withFooter);

    const header = document.querySelector("header");
    header.classList.add('fade-in');
    header.classList.toggle('show', this.state.withHeader);

    const headerTitle = header.querySelector('.screen-name');
    headerTitle.textContent = state.name;
  }

  async getPlayer() {

    const player = await this.repository.getPlayer();
    console.log('player', player);
    return player;
  }

  restoreState() {

    const savedState = this.storageRepository.getItem('rootState', true);
    if (savedState) {
      this.state = savedState;
    }
  }

  saveState(){
    this.storageRepository.setItem('rootState', this.state, true); 
  }

  clearState() {
    this.storageRepository.removeItem('rootState', true);
  }
}
