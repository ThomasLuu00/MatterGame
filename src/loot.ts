import 'phaser';
import ItemData from './item/item-data';

export default class Loot {
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    itemData: ItemData;
    destroyed = false;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, item: ItemData) {
        this.itemData = item;
        this.scene = world.scene;
        this.sprite = this.scene.matter.add.sprite(x, y, this.itemData.imageKey, 0);
        this.sprite.setData({ class: this });
        this.sprite.setSensor(true);
        this.sprite.setOnCollide((e) => this.onSensorCollide(e, this));
        this.sprite.setOnCollideEnd((e) => this.onSensorCollideEnd(e, this));
        this.sprite.setCollisionGroup(-10);

        this.scene.events.on('update', this.update, this);
        this.scene.events.on('shutdown', this.destroy, this);
        this.scene.events.on('destroy', this.destroy, this);
    }

    onSensorCollide(event, context) {
        //if (event.bodyB.isSensor) return; // We only care about collisions with physical objects
        console.log(event);
        context.sprite?.setIgnoreGravity(true);
    }
    onSensorCollideEnd(event, context) {
        context.sprite?.setIgnoreGravity(false);
    }
    update() {
        if (this.destroyed) return;
    }
    destroy() {
        if (this.destroyed) return;
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy', this.destroy, this);
        this.destroyed = true;
        this.scene = null;
        this.itemData = null;
        this.sprite.destroy();
    }
}
