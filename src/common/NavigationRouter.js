

export class NavigationRouter {
    constructor(container, di) {
    this.container = container;
    this.di = di;
    this.currentFragment = null;
    this.fragments = {};
    this.rootModel = this.di.resolve('RootModel');
    
    window.addEventListener("hashchange", () => {
      this.navigate(location.hash.replace("#", "") || "/", false);
    });
  }

    async navigate(path, push = true) {

      if (!this.fragments[path]) {
        const fragInstance = this.di.resolve(path);
        this.fragments[path] = fragInstance;

        if (fragInstance.intent$) {
          fragInstance.intent$.subscribe(intent => this.rootModel.intent$.next(intent));
        }
      }

      if (this.currentFragment && this.currentFragment.unmount) {
        this.currentFragment.unmount();
      }

      const frag = this.fragments[path];
      this.container.innerHTML = '';
      this.currentFragment = frag;
      frag.createView().then(node => {
        this.container.appendChild(node);
        if (frag.mount) frag.mount(); 
      }).catch(err => console.error(err))
      

      if (push) history.pushState({}, "", "#" + path);
    }

    init() {      
      this.rootModel.intent$.subscribe(action => {
        if (action.type.startsWith("NAVIGATE")) {
          this.navigate(action.path);
        }
      });
      
      this.rootModel.init();
    }

}