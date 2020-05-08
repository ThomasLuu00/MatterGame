import 'phaser';
import './itemmeta';

export default class Loot {
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    item: ItemData;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, item: ItemData) {
        this.item = item;
        this.scene = world.scene;
        this.sprite = this.scene.matter.add.sprite(x, y, this.item.id, 0);
        world.scene.add.existing(this.sprite);
    }
}
