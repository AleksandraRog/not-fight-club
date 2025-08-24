import { Subject } from "rxjs";
import { PlayerDto } from "../character/player-dto";


export class LocalStorageClient {
  constructor(namespace = "app") {
    this.namespace = namespace;
    this.changePlayer$ = new Subject();
  }

  getItem(key) {
    const raw = localStorage.getItem(`${this.namespace}:${key}`);
    if (!raw) return null; 
    const jsonObj = JSON.parse(raw);
    return Promise.resolve(Object.assign(new PlayerDto(), jsonObj));
  }

  setItem(key, value) {
    localStorage.setItem(`${this.namespace}:${key}`, JSON.stringify(value));
    this.changePlayer$.next({ key, value });
  }

  removeItem(key) {
    localStorage.removeItem(`${this.namespace}:${key}`);
  }

  
}