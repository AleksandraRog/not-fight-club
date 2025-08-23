

export class DIModule {
  constructor() {
    this.services = new Map();
  }

  register(key, instance) {
    this.services.set(key, instance);
  }

  resolve(key) {
    return this.services.get(key);
  }
}