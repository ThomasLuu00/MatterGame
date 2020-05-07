import 'phaser';
import MyGame from './game.js';
import Character from './character';

class MultiKey {
    keys: any;
    constructor(scene, keys) {
        if (!Array.isArray(keys)) keys = [keys];
        this.keys = keys.map((key) => scene.input.keyboard.addKey(key));
    }
    // Are any of the keys down?
    isDown() {
        return this.keys.some((key) => key.isDown);
    }
    // Are all of the keys up?
    isUp() {
        return this.keys.every((key) => key.isUp);
    }
}

class InputManager {
    scene: Phaser.Scene;

    moveLeft: MultiKey;
    moveRight: MultiKey;
    crouch: MultiKey;
    jump: MultiKey;

    attack: MultiKey;
    throw: MultiKey;
    inventory: MultiKey;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Track the keys
        const { LEFT, RIGHT, UP, A, D, W, S, F, G, I } = Phaser.Input.Keyboard.KeyCodes;
        this.moveLeft = new MultiKey(scene, [LEFT, A]);
        this.moveRight = new MultiKey(scene, [RIGHT, D]);
        this.jump = new MultiKey(scene, [UP, W]);
        this.crouch = new MultiKey(scene, [UP, S]);

        this.attack = new MultiKey(scene, [F]);
        this.throw = new MultiKey(scene, [G]);
        this.inventory = new MultiKey(scene, [I]);
    }
}

export default class Player {
    scene: MyGame;
    sprite: Character;
    input: InputManager;
    destroyed: boolean;

    constructor(scene, sprite) {
        this.scene = scene;
        this.input = new InputManager(this.scene);
        this.sprite = sprite;
        this.scene.events.on('update', this.update, this);
    }

    update() {
        if (this.destroyed) return;

        if (!this.scene.isTyping) {
            const sprite: Character = this.sprite;
            const isRightKeyDown = this.input.moveRight.isDown();
            const isLeftKeyDown = this.input.moveLeft.isDown();
            const isJumpKeyDown = this.input.jump.isDown();
            const isAttackKeyDown = this.input.attack.isDown();
            const isThrowKeyDown = this.input.throw.isDown();
            const isOnGround = sprite.isTouching.ground;
            const isInAir = !isOnGround;

            if (isInAir) {
            } else if (isAttackKeyDown) {
                this.sprite.attack();
            } else if (isThrowKeyDown) {
                this.sprite.throw();
            } else if (isLeftKeyDown === isRightKeyDown) {
                this.sprite.idle();
            } else if (isLeftKeyDown) {
                this.sprite.move(true);
            } else if (isRightKeyDown) {
                this.sprite.move(false);
            }

            if (isJumpKeyDown && sprite.canJump && isOnGround) {
                sprite.isOnGround = false;
                sprite.jump();
            }
        }
    }
}
