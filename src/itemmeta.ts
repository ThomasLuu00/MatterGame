import Character from './character';
import Projectile from './projectile';
import './itemdata';

class Equipment {
    owner: Character;

    weapon1: Weapon = null;
    weapon2: Weapon = null;
    weapon3: Weapon = null;
    weapon4: Weapon = null;

    /*
    helm: Helm;
    torso: Torso;
    pants: Pants;
    shoes: Shoes;
    gloves: Gloves;

    earring1: Earring;
    earring2: Earring;
    necklace: Necklace;
    ring1: Ring;
    ring2: Ring;
    */

    /*
    constructor(owner: Character) {
        this.owner = owner;
    }
    equip(item: Equipable, slot?: integer) {}

    unequip(target: any): boolean {
        return true;
    }
    */
}

class Helm {
    //
}

class Torso {
    //
}

class Pants {
    //
}

class Gloves {
    //
}

class Shoes {
    //
}

class Earring {
    //
}

class Necklace {
    //
}

class Ring {
    //
}

class Weapon implements Equipable {
    data: ItemData;

    icon: Phaser.GameObjects.Image;
    image: Phaser.Physics.Matter.Image;
    scene: Phaser.Scene;
    world: Phaser.Physics.Matter.World;

    projectile: Projectile;
    tags: Tags[];
    attributes: Attributes;

    constructor(world: Phaser.Physics.Matter.World, id: string) {
        this.world = world;
        this.scene = this.world.scene;
        this.data = itemList[id];
    }
}

interface Equipable extends Item {
    image: Phaser.Physics.Matter.Image;
    attributes: Attributes;
    tags: Tags[];
}

interface Useable {
    use: UseFunc;
}

interface Item {
    data: ItemData;
    icon: Phaser.GameObjects.Image;
}

interface UseFunc {
    (source: any, target: any): boolean;
}

type Attributes = {
    attack?: number;
    defence?: number;

    attackSpeed?: number;
    castSpeed?: number;
    jumpHeight?: number;
    moveSpeed?: number;
};

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
