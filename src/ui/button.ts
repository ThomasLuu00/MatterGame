import 'phaser';

class Button extends Phaser.GameObjects.Image {
    isDown: boolean;
    isStuck: boolean;
    isSticky: boolean;
    downDepth: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        image: string,
        onDownCallback?: Function,
        onReleaseCallback?: Function,
        isSticky = false,
    ) {
        super(scene, x, y, image);
        this.scene.add.existing(this);
        this.isSticky = isSticky;
        this.isDown = false;
        this.downDepth = 4;

        this.setInteractive({ useHandCursor: true });
        this.setPosition(this.x, this.y - this.downDepth / 2);

        this.on(
            'pointerdown',
            () => {
                if (!this.isDown) {
                    this.setScale(0.7);
                    this.isDown = true;
                    onDownCallback();
                } else if (this.isDown && this.isSticky) {
                    this.setScale(1);
                    this.isDown = false;
                }
            },
            this,
        );
        this.on(
            'pointerup',
            () => {
                if (this.isDown && !this.isSticky) {
                    this.setScale(1);
                    this.isDown = false;
                    onReleaseCallback();
                }
            },
            this,
        );
        this.on(
            'pointerout',
            () => {
                if (this.isDown && !this.isSticky) {
                    this.setScale(1);
                    this.isDown = false;
                }
            },
            this,
        );
    }
}

const preloadButton = (scene: Phaser.Scene) => {
    scene.load.image('button-blue', '../assets/ui/menu/blue_button09.png');
    scene.load.image('buttondown-blue', '../assets/ui/menu/blue_button10.png');
    scene.load.image('swords', '../assets/swords.png');
    scene.load.image('exitLeft', '../assets/ui/exitLeft.png');
    scene.load.image('gear', '../assets/ui/gear.png');
    scene.load.image('information', '../assets/ui/information.png');
    scene.load.image('menuGrid', '../assets/ui/menuGrid.png');
    scene.load.image('return', '../assets/ui/return.png');
};

export { Button, preloadButton };
