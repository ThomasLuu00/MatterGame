import 'phaser';

import CharacterBase from './characters/character-base';
import { ItemType } from './item/item';
import Player from './player/player';

export default class Loot {
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    item: ItemType;
    destroyed = false;
    onGround = false;
    showLoot = false;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, item: ItemType) {
        this.item = item;
        this.scene = world.scene;
        this.sprite = this.scene.matter.add.sprite(x, y, this.item.iconKey, 0);
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
            context.onGround = true;
        } else if (thatData?.data?.values?.class instanceof CharacterBase) {
            const character: CharacterBase = thatData.data.values.class;
            context.showLoot = true;
            if (character.owner != null && character.owner instanceof Player) {
                const player: Player = character.owner;
                if (!player.loot) player.loot = this;
            }
        }
    }
    onSensorCollideEnd(event, context) {
        const thatData = event.bodyA.gameObject || null;
        if (context.onGround && thatData?.tile) {
            context.sprite.setIgnoreGravity(false);
            context.onGround = false;
        }
    }

    pickUp(): ItemType {
        if (this.destroyed) return;
        const temp = this.item;
        this.destroy();
        return temp;
    }
    d;
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
        this.item = null;
        this.sprite.setOnCollideActive(null);
        this.sprite.setOnCollideEnd(null);
        this.sprite.setCollisionGroup(0);
        this.sprite.destroy();
    }
}
