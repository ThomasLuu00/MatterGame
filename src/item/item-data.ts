import { ItemType } from "./item";
import Tags from "../meta/tags";

export enum Items {
    KUNAI = 'kunai',
    VORTEX = 'vortex',
}

type ItemList = {
    readonly [index in Items]: ItemType;
}

export const itemList: ItemList = {
    kunai: {
        id: 'I01000',
        name: 'Kunai',
        description: 'A sharp knife used by ninjas',
        iconKey: 'item-kunai',
        tags: [Tags.EQUIPABLE, Tags.RANGED]
    },
    vortex: {
        id: 'I01001',
        name: 'Vortex',
        description: 'Spawn the void.',
        iconKey: 'Vortex',
        tags: [Tags.EQUIPABLE, Tags.RANGED]
    },
};

