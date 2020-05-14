import 'phaser';
import ItemData from './item/item-data';
import { Data } from 'phaser';
import CharacterBase from './characters/character-base';

export default class Loot {
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    itemData: ItemData;
    destroyed = false;
    onGround = false;
    showLoot = false;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, item: ItemData) {
        this.itemData = item;
        this.scene = world.scene;
        this.sprite = this.scene.matter.add.sprite(x, y, this.itemData.imageKey, 0);
        this.sprite.setData({ class: this });
        this.sprite.setSensor(true);
        this.sprite.setOnCollideActive((e) => this.onSensorCollide(e, this));
        this.sprite.setOnCollideEnd((e) => this.onSensorCollideEnd(e, this));
        this.sprite.setCollisionGroup(-10);
        this.sprite.setMass(1);
        this.scene.events.on('update', this.update, this);
        this.scene.events.on('shutdown', this.destroy, this);
        this.scene.events.on('destroy', this.destroy, this);
    }

    onSensorCollide(event: any, context: Loot) {
        let thisData = event.bodyB?.gameObject?.data?.values.class || null;
        if (thisData !== context) {
            thisData = event.bodyA?.gameObject?.data?.values.class || null;
            //console.log((thisData === null) ? 'neither' : 'bodyA' );
        } else {
            //console.log('bodyB');
        }

        if (event.bodyA.isSensor) return;

        const thatData = event.bodyA.gameObject || null;
        if (!context.onGround && thatData?.tile) {
            // TODO: Ground should lhave tile property, will need a better way of checking in the future.
            context.sprite.setIgnoreGravity(true);
            context.sprite.setVelocityY(0);
            context.sprite.y -= 10;
            context.onGround = true;
        } else if (thatData?.data?.values?.class instanceof CharacterBase) {
            const character: CharacterBase = thatData.data.values.class;
            context.showLoot = true;
            if (character.owner) console.log('loot me');
        }
        //console.log(event.bodyA?.gameObject?.data)
        //if (event.bodyB.isSensor) return; // We only care about collisions with physical objects
        //console.log(event);
    }
    onSensorCollideEnd(event, context) {
        const thatData = event.bodyA.gameObject || null;
        if (context.onGround && thatData?.tile) {
            context.sprite.setIgnoreGravity(false);
            context.onGround = false;
        }
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
