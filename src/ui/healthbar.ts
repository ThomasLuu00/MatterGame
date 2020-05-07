import 'phaser';

class HealthBar extends Phaser.GameObjects.Image {
    icon: Phaser.GameObjects.Image;
    health: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        icon: string,
        isSticky = false,
        onDownCallback?: Function,
        onReleaseCallback?,
    ) {
        super(scene, x, y, 'bg_healthbar');
        this.scene.add.existing(this);

        this.icon = this.scene.add.image(x, y, icon);
        this.icon.setPosition(this.x - this.width / 2, this.y);
        this.icon.setOrigin(0, 0.5);

        this.scene.events.on('update', this.update, this);
    }

    update() {
        this.icon.setScale(1 * (this.health / 100), 1);
    }
}

const preloadHealthBar = (scene: Phaser.Scene) => {
    scene.load.image('bg_healthbar', '../assets/bg_healthbar.png');
    scene.load.image('healthbar', '../assets/healthbar.png');
};

export { HealthBar, preloadHealthBar };
