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
    justDown() {
        return this.keys.some((key) => Phaser.Input.Keyboard.JustDown(key));
    }
}

class InputManager {
    scene: Phaser.Scene;

    moveLeft: Phaser.Input.Keyboard.Key;
    moveRight: Phaser.Input.Keyboard.Key;
    crouch: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;

    attack: Phaser.Input.Keyboard.Key;
    throw: Phaser.Input.Keyboard.Key;
    inventory: Phaser.Input.Keyboard.Key;
    weapon1: Phaser.Input.Keyboard.Key;
    weapon2: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Track the keys
        const { LEFT, RIGHT, UP, A, D, W, S, F, G, I, ONE, TWO} = Phaser.Input.Keyboard.KeyCodes;
        this.moveLeft = this.scene.input.keyboard.addKey(A);
        this.moveRight = this.scene.input.keyboard.addKey(D);
        this.jump = this.scene.input.keyboard.addKey(W);
        this.crouch = this.scene.input.keyboard.addKey(S);

        this.attack = this.scene.input.keyboard.addKey(F);
        this.throw = this.scene.input.keyboard.addKey(G);
        this.inventory = this.scene.input.keyboard.addKey(I);
        this.weapon1 = this.scene.input.keyboard.addKey(ONE);
        this.weapon2 = this.scene.input.keyboard.addKey(TWO);
        
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
        if (this.destroyed || this.scene.isTyping || !this.sprite.canAct) return;

            const isRightKeyDown = this.input.moveRight.isDown;
            const isLeftKeyDown = this.input.moveLeft.isDown;
            const isJumpKeyDown = this.input.jump.isDown;
            const isAttackKeyDown = this.input.attack.isDown;
            const isThrowKeyDown = this.input.throw.isDown;
            const isOnGround = this.sprite.isTouching.ground;
            const isWep1Down = this.input.weapon1.isDown;
            const isWep2Down = this.input.weapon2.isDown;

        if (isWep1Down){
            this.sprite.switchWeapon(1);
        }

        if (isWep2Down){
            this.sprite.switchWeapon(2);
        }


        if (isJumpKeyDown) {
            this.sprite.jump();
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
        } else {
            this.sprite.idle();
        }
        
    }
}
