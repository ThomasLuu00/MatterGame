export default interface ItemData {
    id: string;
    name: string;
    description?: string;
    iconKey: string;
    imageKey: string;
    projectileId: string;
}

export interface ItemList {
    readonly [index: string]: ItemData;
}
export const itemList: ItemList = {
    I01000: {
        id: 'I01000',
        projectileId: 'P01000',
        name: 'Kunai',
        description: '',
        iconKey: 'item-kunai',
        imageKey: 'item-kunai',
    },
};
