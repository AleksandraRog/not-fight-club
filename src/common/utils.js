export const health = 150;
export const healthStep = 10;
export const playerAttCount = 1;
export const playerDefCount = 2;
export const zones = {
    HEAD: {id: 1, name: 'Head'},
    NECK:{id: 2, name: 'Neck'},
    BODY:{id: 3, name: 'Body'},
    BELLY:{id: 4, name: 'Belly'},
    LEGS:{id: 5, name: 'Legs'}
};



export function createCharacterState() {
  return {
    namePlayer: '',
    avatarPlayer: '',
    isLoading: true,
    error: null
  };
}

export function createSettingState() {
  return {
    namePlayer: ''
  };
}

