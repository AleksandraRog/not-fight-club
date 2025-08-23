

export class SettingModel {
    constructor(settingRepository /** @type {SettingRepository} */) {
        this.repository = settingRepository;
        this.state = this.createDefaultSettingState();
    }

    async init() {
        this.updateScreen({ type: "LOAD_INITIAL" });
    }

    async loadCharacterName() {
        try {
            this.state = { ...this.state, isLoading: true };
            const name = await this.repository.fetchCharacterName(); 
            this.state = { ...this.state, isLoading: false, characterName: name, isSave: true };
        } catch (e) {
            this.state = { ...this.state, isLoading: false, error: e.message };
        }
        return this.state;
    }

    async saveCharacterName(name) {
        try {
            await this.repository.saveCharacterName(name);
            this.state = { ...this.state, characterName: name, isSave: true };
        } catch (e) {
            this.state = { ...this.state, error: e.message };
        }
        return this.state;
    }

    toggleEdit() {
        this.state = { ...this.state, isSave: !this.state.isSave };
        return this.state;
    }

    async reduce(action) {
        switch (action.type) {
        case "INIT":
            this.state = { ...this.state, isLoading: true };
            try {
            const name = await this.repository.fetchCharacterName();
            this.state = { ...this.state, isLoading: false, characterName: name, isSave: true };
            } catch (e) {
            this.state = { ...this.state, isLoading: false, error: e.message };
            }
            return this.state;

        case "TOGGLE_EDIT":
            this.state = { ...this.state, isSave: !this.state.isSave };
            return this.state;

        case "SAVE_NAME":
            try {
            await this.repository.saveCharacterName(action.payload);
            this.state = { ...this.state, characterName: action.payload, isSave: true };
            } catch (e) {
            this.state = { ...this.state, error: e.message };
            }
            return this.state;

        default:
            return this.state;
        }
    }

    createDefaultSettingState(){
        return {
            name: 'Edit',
            characterName: '',
            isLoading: true,
            error: null
        };
    }
}