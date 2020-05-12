import { ItemData, ItemList, itemList, projectileList, ProjectileList, PROJECTILE} from './item-data';
import Character from '../characters/character';
import { Tags, Attributes } from './meta-data';
import KunaiProjectile from '../projectiles/kunai';
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

    tags: Tags[];
    attributes: Attributes;
    owner: Character = null;

    constructor(world: Phaser.Physics.Matter.World, id: string) {
        this.world = world;
        this.scene = this.world.scene;
        this.data = itemList[id];
    }

    attack(ox, oy, x: number, y: number) {
        if (this.owner !== null) new KunaiProjectile(this.scene, ox, oy).fire(x, y);
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

export { Weapon };
