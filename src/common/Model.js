

export class Model{
    constructor(repository, storageRepository){
      this.repository = repository;
      this.storageRepository = storageRepository;
    }

    reduce(){
      throw new Error("reduce() must be implemented in subclass");
    }

}