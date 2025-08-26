

export class CharacterRepository {
    async getCharacter(){
        throw new Error("getCharacter() must be implemented in subclass");
    }

    saveCharacter(player) {
        throw new Error("saveCharacter() must be implemented in subclass");
    }
}