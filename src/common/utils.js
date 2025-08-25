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

export const enemies = {
    1:{name: 'Knight', attCount: 1, defCount: 3},
    2:{name: 'Warrior', attCount: 1, defCount: 2},
    3:{name: 'Warrior 2', attCount: 2, defCount: 1},
    4:{name: 'Warrior 3', attCount: 2, defCount: 2},
}


export const createImage = (src) => new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
        img.alt = 'avatar';
    });
