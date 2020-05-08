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

export default class InputManager {
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
        const {A, D, W, S, F, G, I, ONE, TWO } = Phaser.Input.Keyboard.KeyCodes;
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