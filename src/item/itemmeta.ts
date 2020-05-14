import { ItemData, ItemList, itemList, projectileList, ProjectileList, PROJECTILE} from './item-data';
import { Tags, Attributes } from './meta-data';
import KunaiProjectile from '../projectiles/kunai';
import CharacterBase from '../characters/character-base';
import VortexProjectile from '../projectiles/vortex';
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
    owner: CharacterBase = null;
    projectile: number;

    constructor(world: Phaser.Physics.Matter.World, id: string, projectile: number = 1) {
        this.world = world;
        this.scene = this.world.scene;
        this.data = itemList[id];
        this.projectile = projectile;
    }

    attack(ox, oy, x: number, y: number) {
        if (this.owner !== null) {
            switch (this.projectile){
                case 1:
                    new KunaiProjectile(this.scene, ox, oy, this.owner).fire(x, y);
                    break;
                case 2:
                    new VortexProjectile(this.scene, ox + ((this.owner?.sprite?.flipX ? -100 : 100)), oy, this.owner).fire(x + ((this.owner?.sprite?.flipX ? -101 : 101)), y);
                    break;
            }

        }
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
