import Tags from '../meta/tags';
import Attributes from '../meta/attributes';
import CharacterBase from '../characters/character-base';
import KunaiProjectile from '../projectiles/kunai';
import VortexProjectile from '../projectiles/vortex';
import { Equipable, ItemType } from './item';
import { itemList, Items } from './item-data';

export default class Weapon implements ItemType, Equipable {

    scene: Phaser.Scene;

    id: Items;
    name: string;
    description: string;
    iconKey: string;
    tags: Tags[];
    attributes: Attributes;

    owner: CharacterBase = null;
    projectile: number;

    constructor(scene: Phaser.Scene, id: Items, projectile = 1) {
        this.scene = scene;
        this.id = id;

        let itemData = itemList[this.id]
        this.name = itemData.name;
        this.description = itemData.description;
        this.iconKey = itemData.iconKey;
        this.tags = itemData.tags;
        this.attributes = {
            attack: 20,
        }
        this.projectile = projectile;
    }

    attack(ox, oy, x: number, y: number) {
        if (this.owner !== null) {
            switch (this.projectile) {
                case 1:
                    new KunaiProjectile(this.scene, ox, oy, this.owner).fire(x, y);
                    break;
                case 2:
                    new VortexProjectile(
                        this.scene,
                        ox + (this.owner?.sprite?.flipX ? -100 : 100),
                        oy,
                        this.owner,
                    ).fire(x + (this.owner?.sprite?.flipX ? -101 : 101), y);
                    break;
            }
        }
    }
}
