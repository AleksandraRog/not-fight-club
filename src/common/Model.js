

export class Model{
    constructor(repository){
      this.repository = repository;
    }

    reduce(intent){
      throw new Error("reduce() must be implemented in subclass");
    }

}