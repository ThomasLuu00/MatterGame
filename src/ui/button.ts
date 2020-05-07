import 'phaser';

class Button extends Phaser.GameObjects.Image {
    isDown: boolean;
    isStuck: boolean;
    isSticky: boolean;
    icon: Phaser.GameObjects.Image;
    downDepth: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        icon: string,
        isSticky = false,
        onDownCallback?: Function,
        onReleaseCallback?,
    ) {
        super(scene, x, y, 'button-blue');
        this.scene.add.existing(this);
        this.isSticky = isSticky;
        this.isDown = false;
        this.downDepth = 4;

        this.setInteractive({ useHandCursor: true });
        this.icon = this.scene.add.image(x, y, icon);
        this.icon.setScale((this.width / this.icon.width) * 0.7);
        this.icon.setPosition(this.x, this.y - this.downDepth / 2);

        this.on(
            'pointerdown',
            () => {
                if (!this.isDown) {
                    this.setTexture('buttondown-blue');
                    this.icon.setPosition(this.x, this.y);
                    this.isDown = true;
                    this.scene.events.emit('subtractHealth');
                } else if (this.isDown && this.isSticky) {
                    this.setTexture('button-blue');
                    this.icon.setPosition(this.x, this.y - this.downDepth / 2);
                    this.isDown = false;
                }
            },
            this,
        );

        this.on(
            'pointerup',
            () => {
                if (this.isDown && !this.isSticky) {
                    this.setTexture('button-blue');
                    this.icon.setPosition(this.x, this.y - this.downDepth / 2);
                    this.isDown = false;
                }
            },
            this,
        );

        this.on(
            'pointerout',
            () => {
                if (this.isDown && !this.isSticky) {
                    this.setTexture('button-blue');
                    this.icon.setPosition(this.x, this.y - this.downDepth / 2);
                    this.isDown = false;
                }
            },
            this,
        );
    }
}

const preloadButton = (scene: Phaser.Scene) => {
    scene.load.image('button-blue', '../assets/menu/blue_button09.png');
    scene.load.image('buttondown-blue', '../assets/menu/blue_button10.png');
    scene.load.image('swords', '../assets/swords.png');
};

export { Button, preloadButton };
