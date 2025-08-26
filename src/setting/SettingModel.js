import { Model } from "../common/Model";


export class SettingModel extends Model{
    constructor(repository, storageRepository){
        super(repository, storageRepository);
        this.player = null;
        this.state = this.createDefaultSettingState();
    }
    
    reduce(intent) {
        this.player.name = intent.characterName;
        this.repository.savePlayer(this.player);
    } 

    async loadPlayer() {
        const player = await this.repository.getPlayer();
        this.player = player;
        return player;
    }

    

    toggleEdit() {
        this.state = { ...this.state, isSave: !this.state.isSave };
        return this.state;
    }

    createDefaultSettingState(){
        return {
            name: 'Edit',
            characterName: '',
            isLoading: true,
            error: null
        };
    }

    restoreState() {
      const savedState = this.storageRepository.getItem('rootState', true);
      if (savedState) {
        this.state = savedState;
      }
    }

    saveState() {
      this.storageRepository.setItem('rootState', this.state, true); 
    }

    clearState() {
      this.storageRepository.removeItem('rootState', true);
    }
}