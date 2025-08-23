import { fromEvent, merge, EMPTY, Subject } from "rxjs";
import { map } from "rxjs/operators";

export class RootModel {

    constructor() {
      this.state = this.createScreenState();
      this.intent$ = new Subject();
      this.bindRootIntent(document.querySelector('body'));
    }

    init() {
      this.state = {
          ...this.state,
          screen: 'ENTER',   
          isLoading: false,
          name: 'Welcome',
          withHeader: false,
         withFooter: false,
      };

      this.render(this.state);

      this.intent$.subscribe(action => {
        this.updateScreen(action); // здесь обновляется стейт и рендер
      });

    }

    async updateScreen(action) {
      switch (action.type2) {
        case "LOAD_INITIAL":
          try {
            this.state.isLoading = true;
            const initial = 'ENTER';
            this.state = { ...this.state, screen: initial, isLoading: false, error: null, };
          } catch (e) {
            this.state = { ...this.state, isLoading: false, error: e.message };
          }
          break;

        case "MAIN_SCREEN_GO":
          console.log('intent in root', this.intent$);
          this.state = { ...this.state, name: 'Main', withHeader: true, withFooter: false, fragment: 'mainFragment' };
          break;

        case "BATTLE_SCREEN_GO":
          this.state = { ...this.state, name: 'Battle', withHeader: true, withFooter: true, fragment: 'battleFragment' };
          break;  

        case "SETTING_SCREEN_GO":
          this.state = { ...this.state, name: 'Setting', withHeader: true, withFooter: false, fragment: 'settingFragment' };
          if (this.currentFragment) this.currentFragment.unmount();
          break;
        
          
        case "CHARACTER_SCREEN_GO":
          this.state = { ...this.state, name: 'Character', withHeader: true, withFooter: false, fragment: 'characterFragment' };
          break;  
      }
      console.log('state up scree', this.state);
      this.render(this.state);
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
      console.log(`bindIntent modelState `, this.modelState)  
      const streams = [];
  
      const mainBtn = dom.querySelector(".main-button");
      if (mainBtn) streams.push(fromEvent(mainBtn, "click").pipe(map(() => ({ type: 'NAVIGATE', type2: "MAIN_SCREEN_GO", path: '/main' }))));
  
      const settingBtn = dom.querySelector(".setting-button");
      if (settingBtn) streams.push(fromEvent(settingBtn, "click").pipe(map(() => ({ type: 'NAVIGATE', type2: "SETTING_SCREEN_GO", path: '/setting' }))));
  
      const characterBtn = dom.querySelector(".character-button");
      if (characterBtn) streams.push(fromEvent(characterBtn, "click").pipe(map(() => ({ type: 'NAVIGATE', type2: "CHARACTER_SCREEN_GO", path: '/character' }))));
    
    //return streams.length > 0 ? merge(...streams) : EMPTY;
    if (streams.length > 0) {
      merge(...streams).subscribe(action => this.intent$.next(action)); 
    }
  }

  render(state) {
    const footer = document.querySelector("footer");
    footer.classList.toggle("hidden", !this.state.withFooter);

    const header = document.querySelector("header");
    header.classList.toggle("hidden", !this.state.withHeader);

    const headerTitle = header.querySelector('.screen-name');
    headerTitle.textContent = state.name;
  }
}
