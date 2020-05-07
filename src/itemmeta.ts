class Equipment implements Item{

    data: ItemData;

    icon: Phaser.GameObjects.Image
    image: Phaser.Physics.Matter.Image;
    scene: Phaser.Scene;
    world: Phaser.Physics.Matter.World;

    
    constructor(world: Phaser.Physics.Matter.World, id: string){
        this.world = world;
        this.scene = this.world.scene;
        this.data = itemList[id];
    }

    equip(target: any) : boolean {
        return true;
    };
    unequip(target: any) : boolean {
        return true;
    };
}

interface Equipable {
    attributes: Attributes;
    tags: Tags[];

    equip: EquipFunc;
    unequip: UnequipFunc;
}

interface Useable {
    use: UseFunc;
}

interface Item {
    data: ItemData;
}

interface UseFunc {
    (source: any, target: any): boolean;
}
interface EquipFunc {
    (target: any): boolean;
}
interface UnequipFunc {
    (target: any): boolean;
}

interface ItemData{
    id: string;
    name: string;
    description?: string;
    iconKey: string;
    imageKey: string;
}

type Attributes = {
    attack?: number;
    defence?: number;

    attackSpeed?: number;
    castSpeed?: number;
    jumpHeight?: number;
    moveSpeed?: number;
}

enum Tags {
    // Item Type
    EQUIPABLE = 'Equipable',
    USEABLE = 'Useable',
    
    // Attack types
    MELEE = 'Melee',
    MAGIC = 'Magic',
    RANGED = 'Ranged',

    // Status Effects
    SLOW = 'Slow',
    STUN = 'Stun',
    BURN = 'Burn',
    POISON = 'Poison',
    EXHUAST = 'Exhuast',
    SILENCE = 'Silence',
}

interface ItemCatalogue {
    readonly [index: string]: ItemData;
}

const itemList: ItemCatalogue = {
    '#01000':{
        id: '#01000',
        name: 'Kunai',
        description: '',
        iconKey: 'kunai',
        imageKey: 'kunai',
    },
    '#001001':{
        id: '#001001',
        name: 'Sword',
        description: '',
        iconKey: 'sword',
        imageKey: 'sword',
    },
}