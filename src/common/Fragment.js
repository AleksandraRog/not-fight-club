import { Subject } from "rxjs";


export class Fragment {
    constructor(fragmentState, model) {
    this.model = model;  
    this.fragmentState = fragmentState;
    this.container = null;
    this.subscriptions = [];
    this.intent$ = new Subject();
  }

  async createView() {
    throw new Error("createView() must be implemented in subclass");
  }

  updateView() {
    throw new Error("updateView() must be implemented in subclass");
  }

  subscribe(observable) {
    const sub = observable.subscribe(action => this.intent$.next(action));
    this.subscriptions.push(sub);
  }

  intent() {
    throw new Error("intent() must be implemented in subclass");
  }
}