import 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/constants';

export default class Background extends Phaser.Scene {
    mainScene: Phaser.Scene;
    bg1: Phaser.GameObjects.TileSprite;
    bg2: Phaser.GameObjects.TileSprite;
    camera: Phaser.Cameras.Scene2D.Camera;

    constructor() {
        super({
            active: true,
        });
    }

    preload() {
        this.load.image('bg_1', '../assets/ui/bg-1.png');
        this.load.image('bg_2', '../assets/ui/bg-2.png');
    }

    create(data) {
        this.mainScene = this.scene.get('myGame');

        this.scene.sendToBack();
        this.camera = data.camera;

        // First background
        this.bg1 = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_1');
        this.bg1.setOrigin(0, 0);
        this.bg1.setScrollFactor(0);

        // Second background
        this.bg2 = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_2');
        this.bg2.setOrigin(0, 0);
        this.bg2.setScrollFactor(0);
    }

    update() {
        // Scroll the texture of the tile sprites proportionally to the camera scroll
        this.bg1.tilePositionX = this.camera.scrollX * 0.3;
        this.bg2.tilePositionX = this.camera.scrollX * 0.6;
    }
}
