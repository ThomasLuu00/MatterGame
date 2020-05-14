import 'phaser';
import MyGame from '../game.js';
import InputManager from './input-manager';
import Inventory from '../ui/inventoryUI.js';
import CharacterBase from '../characters/character-base.js';
import { Weapon } from '../item/itemmeta';

export default class Player {
    scene: MyGame;
    sprite: CharacterBase;
    input: InputManager;

    inventory: Inventory;

    destroyed: boolean;

    constructor(scene, sprite) {
        this.scene = scene;
        this.input = new InputManager(this.scene);
        this.sprite = sprite;
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);

        // Equipping weapon
        const wep = new Weapon(this.scene, 'I01000', 1);
        wep.owner = this.sprite;
        this.sprite.equip(wep);
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

        if (isWep1Down) {
            this.switchWeapon(1);
        }

        if (isWep2Down) {
            this.switchWeapon(2);
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
            const wep = new Weapon(this.scene, 'I01000', slot);
            wep.owner = this.sprite;
            this.sprite.equip(wep);
        }
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
