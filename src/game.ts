import 'phaser';
import UI, { isOpened } from './ui';
import Player from './player/player';
import Inventory from './ui/inventoryUI';
import EnemyNinja from './characters/enemy-ninja';
import { Particle, ParticleTextures, addParticleAnimations } from './projectiles/particles';
import CharacterBase from './characters/character-base';
import NinjaGirl, { preloadNinjaGirl, addNinjaGirlAnimations } from './characters/ninja-girl';
import Loot from './loot';
import { itemList, Items } from './item/item-data';
import Background from './background';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/constants';
import Weapon from './item/weapon';

export default class MyGame extends Phaser.Scene {
    player: Player;
    enemy: EnemyNinja;
    sprite: any;
    ninja: NinjaGirl;
    shapes: Record<string, any>;
    curAnim: any;
    controls: any;
    count = 0;
    isInventoryOpen = false;
    inv: any;
    isTyping = false;
    test: CharacterBase;

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
        this.load.spritesheet(
            Particle.Vortex,
            ParticleTextures.Vortex.spritesheet,
            ParticleTextures.Vortex.spritesheetConfig,
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
        //this.ninja = new NinjaGirl(this.matter.world, spawnPoint.x, spawnPoint.y);

        this.test = new NinjaGirl(this, spawnPoint.x, spawnPoint.y);
        this.player = new Player(this, this.test);

        // Add UI scene
        this.scene.add('UIScene', UI, true, { player: this.player });

        this.enemy = new EnemyNinja(this, spawnPoint.x + 100, spawnPoint.y);
        new Loot(this.matter.world, spawnPoint.x + 200, spawnPoint.y, itemList.kunai);

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
        this.cameras.main.startFollow(this.player.sprite.sprite, false, 0.5, 0.5).setZoom(0.5);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Add background scene
        this.scene.add('BackgroundScene', Background, true, {
            camera: this.cameras.main,
            mapWidth: map.widthInPixels,
            mapHeight: map.heightInPixels,
        });

        // Setting the boolean to check if the player is typing
        this.isTyping = isOpened;

        this.matter.world.createDebugGraphic(); // Shows the hitboxes
        //this.createWindow(Inventory);

        addNinjaGirlAnimations(this);
        addParticleAnimations(this);
    }
    update() {
        this.isTyping = isOpened;
        if (this.isTyping) {
            this.input.keyboard.disableGlobalCapture();
        } else {
            this.input.keyboard.enableGlobalCapture();
            this.controls.update(); // needed for camera controls

            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I))) {
                this.player.toggleInventory();
                this.player.inventory.setItem(5, new Weapon(this, Items.VORTEX, 2));
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
    /*
    createWindow(func) {
        const x = 50;
        const y = 50;

        const handle = 'window' + this.count++;

        const win = this.add.zone(x, y, GAME_WIDTH, GAME_HEIGHT).setInteractive({ draggable: true }).setOrigin(0);
        const demo = new func(handle, win);

        const scene = this.scene.add(handle, demo, true);
        this.inv = demo;
        return scene;
    }
    */
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: [MyGame],
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
