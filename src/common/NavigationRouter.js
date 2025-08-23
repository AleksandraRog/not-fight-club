import { RootModel } from "../root/RootModel";

export class NavigationRouter {
    constructor(container, di) {
    this.container = container;
    this.di = di;
    this.currentFragment = null;
    this.fragments = {};
    this.rootModel = new RootModel();

    window.addEventListener("hashchange", () => {
      this.navigate(location.hash.replace("#", "") || "/", false);
    });
  }

    async navigate(path, push = true) {
      console.log('nav path',path);
      if (!this.fragments[path]) {
        const fragInstance = this.di.resolve(path);
        this.fragments[path] = fragInstance;

        if (fragInstance.intent$) {
          fragInstance.intent$.subscribe(intent => this.rootModel.intent$.next(intent));
        }
      }

      const frag = this.fragments[path];
      this.container.innerHTML = '';
      frag.createView().then(node => {this.container.appendChild(node);}).catch(err => console.error(err))
    
      if (push) history.pushState({}, "", "#" + path);
    }

    init() {
      this.rootModel.intent$.subscribe(action => {
        if (action.type.startsWith("NAVIGATE")) {
          console.log('in subs for nav', action.type, action.payload, action.type2);
          this.navigate(action.path);
        }
      });
      this.rootModel.init();
      this.navigate(location.hash.replace("#", "") || "/", false);
    }

}