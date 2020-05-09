import 'phaser';
import MyGame from '../game.js';
import Character from '../characters/character';
import InputManager from './input-manager';
import Inventory from '../ui/inventoryUI.js';
import Equipment from './equipment.js';

export default class Player {
    scene: MyGame;
    sprite: Character;
    input: InputManager;

    inventory: Inventory;
    equipment: Equipment;

    destroyed: boolean;

    constructor(scene, sprite) {
        this.scene = scene;
        this.input = new InputManager(this.scene);
        this.sprite = sprite;
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }

    update() {
        if (this.destroyed || this.scene.isTyping) return;

        const isRightKeyDown = this.input.moveRight.isDown;
        const isLeftKeyDown = this.input.moveLeft.isDown;
        const isJumpKeyDown = this.input.jump.isDown;
        const isAttackKeyDown = this.input.attack.isDown;
        const isThrowKeyDown = this.input.throw.isDown;
        const isOnGround = this.sprite.isTouching.ground;
        const isWep1Down = this.input.weapon1.isDown;
        const isWep2Down = this.input.weapon2.isDown;

        if (isWep1Down) {
            this.sprite.switchWeapon(1);
        }

        if (isWep2Down) {
            this.sprite.switchWeapon(2);
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
        } else {
            this.sprite.idle();
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
