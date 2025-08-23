

export class LocalStorageClient {
  constructor(namespace = "app") {
    this.namespace = namespace;
  }

  getItem(key) {
    return localStorage.getItem(`${this.namespace}:${key}`);
  }

  setItem(key, value) {
    localStorage.setItem(`${this.namespace}:${key}`, value);
  }

  removeItem(key) {
    localStorage.removeItem(`${this.namespace}:${key}`);
  }
}