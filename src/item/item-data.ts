interface ItemData {
    id: string;
    name: string;
    description?: string;
    iconKey: string;
    imageKey: string;
    projectileId: string;
}

interface ItemList {
    readonly [index: string]: ItemData;
}

enum PROJECTILE_COLLISION_GROUP {
    NORMAL=-1,
    FFENABLED=-2,
}

const itemList: ItemList = {
    I01000: {
        id: 'I01000',
        projectileId: 'P01000',
        name: 'Kunai',
        description: '',
        iconKey: 'item-kunai',
        imageKey: 'item-kunai',
    },
};

enum PROJECTILE{
    KUNAI = 'P01000',
}

type ProjectileList = {readonly [P in PROJECTILE]: ProjectileData;}

interface ProjectileData{
    id: PROJECTILE;
    texture: string;
    collisionGroup: PROJECTILE_COLLISION_GROUP;
    damage: number;
}

const projectileList: ProjectileList = {
    P01000: {
        id: PROJECTILE.KUNAI,
        texture: 'item-kunai',
        collisionGroup: PROJECTILE_COLLISION_GROUP.NORMAL,
        damage: 50,
    },
};

enum Things { ONE, TWO }
type ThingMap = {[TKey in Things]: boolean};
export { ItemData, ItemList, ProjectileData, ProjectileList, itemList, projectileList, PROJECTILE};
