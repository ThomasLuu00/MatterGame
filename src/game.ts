import 'phaser';
import { NinjaGirl, preloadNinjaGirl } from './characters/ninja-girl';
import UI, { isOpened } from './ui';
import Player from './player/player';
import Inventory from './ui/inventoryUI';
import { Enemy } from './characters/enemy';
import { Particle, ParticleTextures } from './projectiles/particles';

export default class MyGame extends Phaser.Scene {
    player: Player;
    enemy: Enemy;
    sprite: any;
    ninja: NinjaGirl;
    shapes: Record<string, any>;
    curAnim: any;
    controls: any;
    count = 0;
    isInventoryOpen = false;
    inv: any;
    isTyping = false;

    constructor() {
        super('myGame');
    }

    preload() {
        this.load.tilemapTiledJSON('map', '../assets/map/map.json');
        this.load.image('map-tiles', '../assets/map/map-tiles.png');
        preloadNinjaGirl(this);
        this.load.image('item-kunai', '../assets/kunai.png');

        this.load.spritesheet(
            Particle.MagicSpell,
            ParticleTextures.MagicSpell.spritesheet,
            ParticleTextures.MagicSpell.spritesheetConfig,
        );
        this.load.spritesheet(
            Particle.Magic8,
            ParticleTextures.Magic8.spritesheet,
            ParticleTextures.Magic8.spritesheetConfig,
        );
        this.load.spritesheet(
            Particle.BlueFire,
            ParticleTextures.BlueFire.spritesheet,
            ParticleTextures.BlueFire.spritesheetConfig,
        );
        this.load.spritesheet(
            Particle.Casting,
            ParticleTextures.Casting.spritesheet,
            ParticleTextures.Casting.spritesheetConfig,
        );
        this.load.spritesheet(
            Particle.MagickaHit,
            ParticleTextures.MagickaHit.spritesheet,
            ParticleTextures.MagickaHit.spritesheetConfig,
        );

    }

    create() {
        // Create and load map
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('map-tiles');
        const groundLayer = map.createDynamicLayer('Ground', tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(groundLayer);
        const spawnPoint: any = map.findObject('Spawn', (obj) => obj.name === 'Spawn Point');

        // Add assets
        this.ninja = new NinjaGirl(this.matter.world, spawnPoint.x, spawnPoint.y);
        this.player = new Player(this, this.ninja);

        // Add enemy
        this.enemy = new Enemy(this.matter.world, spawnPoint.x + 100, spawnPoint.y);

        // Smoothly follow the player
        const controlConfig = {
            camera: this.cameras.main,
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            speed: 0.5,
            disableCull: true,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5).setZoom(0.5);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Setting the boolean to check if the player is typing
        this.isTyping = isOpened;

        this.matter.world.createDebugGraphic(); // Shows the hitboxes
        this.createWindow(Inventory);

        this.anims.create({
            key: Particle.MagicSpell,
            frames: this.anims.generateFrameNames(Particle.MagicSpell, ParticleTextures.MagicSpell.animConfig),
            repeat: -1,
            frameRate: 60,
        });

        this.anims.create({
            key: Particle.Magic8,
            frames: this.anims.generateFrameNames(Particle.Magic8, ParticleTextures.Magic8.animConfig),
            repeat: -1,
            frameRate: 60,
        });
        this.anims.create({
            key: Particle.BlueFire,
            frames: this.anims.generateFrameNames(Particle.BlueFire, ParticleTextures.BlueFire.animConfig),
            repeat: -1,
            frameRate: 60,
        });
        this.anims.create({
            key: Particle.Casting,
            frames: this.anims.generateFrameNames(Particle.Casting, ParticleTextures.Casting.animConfig),
            repeat: -1,
            frameRate: 60,
        });
        this.anims.create({
            key: Particle.MagickaHit,
            frames: this.anims.generateFrameNames(Particle.MagickaHit, ParticleTextures.MagickaHit.animConfig),
            repeat: -1,
            frameRate: 60,
        });

        this.add.sprite(400, 300, Particle.MagicSpell).play(Particle.MagicSpell);
        this.add.sprite(400, 400, Particle.Magic8).play(Particle.Magic8);
        this.add.sprite(500, 300, Particle.BlueFire).play(Particle.BlueFire);
        this.add.sprite(500, 400, Particle.Casting).play(Particle.Casting);
        this.add.sprite(600, 300, Particle.MagickaHit).play(Particle.MagickaHit);

       

        this.add.sprite(400, 300, Particle.MagicSpell).play(Particle.MagicSpell);
        this.add.sprite(400, 400, Particle.Magic8).play(Particle.Magic8);
    }
    update() {
        this.isTyping = isOpened;
        if (this.isTyping) {
            this.input.keyboard.disableGlobalCapture();
        } else {
            this.input.keyboard.enableGlobalCapture();
            this.controls.update(); // needed for camera controls

            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I))) {
                this.events.emit('toggleInventory');
            }

            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L))) {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                    // On stop fulll screen
                } else {
                    this.scale.startFullscreen();
                    // On start fulll screen
                }
            }
        }
    }

    createWindow(func) {
        const x = 50;
        const y = 50;

        const handle = 'window' + this.count++;

        const win = this.add.zone(x, y, 1920, 1080).setInteractive({ draggable: true }).setOrigin(0);
        const demo = new func(handle, win);

        const scene = this.scene.add(handle, demo, true);
        this.inv = demo;
        return scene;
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 1920,
    height: 1080,
    scene: [MyGame, UI],
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 1,
            },
            debug: {
                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,
                showConvexHulls: true,
            },
        },
    },
    parent: 'parent',
    dom: {
        createContainer: true,
    },
};

const game = new Phaser.Game(config);
