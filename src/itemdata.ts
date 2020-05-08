interface ItemData {
    id: string;
    name: string;
    description?: string;
    iconKey: string;
    imageKey: string;
}

interface ItemCatalogue {
    readonly [index: string]: ItemData;
}

const itemList: ItemCatalogue = {
    '#01000': {
        id: '#01000',
        name: 'Kunai',
        description: '',
        iconKey: 'kunai',
        imageKey: 'kunai',
    },
    '#001001': {
        id: '#001001',
        name: 'Sword',
        description: '',
        iconKey: 'sword',
        imageKey: 'sword',
    },
};
