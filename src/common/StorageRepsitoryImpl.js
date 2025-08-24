import { StorageRepository } from "./StorageRepository";


export class StorageRepositoryImpl extends StorageRepository{
  constructor(namespace = "app", ) {
    super();
    this.namespace = namespace;
  }

  getItem(key, session = false) {
    const storage = session ? sessionStorage : localStorage;
    const value = storage.getItem(`${this.namespace}:${key}`);
    return value ? JSON.parse(value) : null;
  }

  setItem(key, value, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.setItem(`${this.namespace}:${key}`, JSON.stringify(value));
  }

  removeItem(key, session = false) {
    const storage = session ? sessionStorage : localStorage;
    storage.removeItem(`${this.namespace}:${key}`);
  }
}