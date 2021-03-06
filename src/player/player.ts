import 'phaser';
import MyGame from '../game';
import InputManager from './input-manager';
import Inventory from './inventory';
import CharacterBase from '../characters/character-base';
import Weapon from '../item/weapon';
import { Items } from '../item/item-data';
import Loot from '../loot';

export default class Player {
    scene: MyGame;
    sprite: CharacterBase;
    input: InputManager;
    inventory: Inventory;
    loot: Loot = null;
    destroyed: boolean;

    UI = {
        showInventory: false,
    };

    constructor(scene, sprite) {
        this.scene = scene;
        this.input = new InputManager(this.scene);
        this.sprite = sprite;
        sprite.owner = this;
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);

        // Equipping weapon
        const wep = new Weapon(this.scene, Items.KUNAI, 1);
        wep.owner = this.sprite;
        this.sprite.equip(wep);

        this.inventory = new Inventory(20);
        this.inventory.setItem(0, wep)
        this.inventory.setItem(3, new Weapon(this.scene, Items.VORTEX, 2))
        
    }

    update() {
        if (this.destroyed || this.scene.isTyping) return;

        const isRightKeyDown = this.input.moveRight.isDown;
        const isLeftKeyDown = this.input.moveLeft.isDown;
        const isJumpKeyDown = Phaser.Input.Keyboard.JustDown(this.input.jump);
        const isAttackKeyDown = this.input.attack.isDown;
        const isThrowKeyDown = this.input.throw.isDown;
        //const isOnGround = this.sprite.isTouching.ground;
        const isWep1Down = this.input.weapon1.isDown;
        const isWep2Down = this.input.weapon2.isDown;
        const isPickUpDown = Phaser.Input.Keyboard.JustDown(this.input.pickUp);

        if (isWep1Down) {
            this.switchWeapon(1);
        }

        if (isWep2Down) {
            this.switchWeapon(2);
        }

        if (isPickUpDown){
            this.pickUp();
        }

        if (isJumpKeyDown) {
            this.sprite.jump();
        } else if (isAttackKeyDown) {
            this.sprite.attack();
        } else if (isLeftKeyDown === isRightKeyDown) {
            this.sprite.idle();
        } else if (isLeftKeyDown) {
            this.sprite.move(true);
        } else if (isRightKeyDown) {
            this.sprite.move(false);
        }
    }

    switchWeapon(slot: integer) {
        if (slot > 0 && slot < 3) {
            const wep = new Weapon(this.scene, Items.KUNAI, slot);
            wep.owner = this.sprite;
            this.sprite.equip(wep);
        }
    }

    pickUp(){
        if (this.loot){
            this.inventory.addItem(this.loot.pickUp());
            //this.loot.destroy();
            this.loot = null;
        }

    }

    toggleInventory(){
        this.UI.showInventory = !this.UI.showInventory;
    }

    destroy() {
        this.destroyed = true;

        // Event listeners
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy', this.destroy, this);
        this.sprite.destroy();
    }
}
