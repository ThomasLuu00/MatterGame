interface ItemData {
    id: string;
    name: string;
    description?: string;
    iconKey: string;
    imageKey: string;
    projectileId: string;
}

interface ItemCatalogue {
    readonly [index: string]: ItemData;
}

/*
enum ITEM {
    KUNAI= '#001000',
}

enum PROJECTILE {
    KUNAI= '#002000',

}
*/

const itemList: ItemCatalogue = {
    I01000: {
        id: 'I01000',
        projectileId: 'P01000',
        name: 'Kunai',
        description: '',
        iconKey: 'item-kunai',
        imageKey: 'item-kunai',
    },
};

const projectileList = {
    P01000: {
        id: 'P01000',
        texture: 'item-kunai',
    },
};

export { ItemData, ItemCatalogue, itemList, projectileList };
