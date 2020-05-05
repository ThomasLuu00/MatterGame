import 'phaser';
import { NinjaGirl, preloadNinjaGirl} from './ninja-girl';
import UI from './ui';
import Player from './player';
import Item from './item';
import Inventory from './inventory';
import {Kunai, preloadKunai} from './kunai';
import {Button, preloadButton} from './button';

export default class MyGame extends Phaser.Scene
{
    player : Player;
    sprite: any;
    ninja: NinjaGirl;
    shapes: Object;
    curAnim : any;
    controls : any;
    items: Array<Item> = [];
    count: number = 0;
    isInventoryOpen: Boolean = false;
    inv: any;
    constructor ()
    {
        super('myGame');
    }

    preload ()
    {
        this.load.tilemapTiledJSON("map", "../assets/map/map.json")
        this.load.image("map-tiles","../assets/map/map-tiles.png");
        preloadNinjaGirl(this);
        preloadKunai(this);
        preloadButton(this);
    }

    create ()
    {    
    
        // Create and load map
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("map-tiles");
        const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(groundLayer);
        const spawnPoint : any = map.findObject("Spawn", obj => obj.name === "Spawn Point");

        // Add assets
        this.ninja = new NinjaGirl(this.matter.world, spawnPoint.x, spawnPoint.y);
        this.player = new Player(this, this.ninja);
        let kunai = new Kunai(this.matter.world, spawnPoint.x + 200, spawnPoint.y + 200);
        let button = new Button(this, spawnPoint.x +300, spawnPoint.y +300, 'swords');
        new Button(this, spawnPoint.x +350, spawnPoint.y +300, 'swords', true);
        new Button(this, spawnPoint.x +400, spawnPoint.y +300, 'swords');

        // Smoothly follow the player
        var controlConfig = {
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
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5).setZoom(0.5);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.matter.world.createDebugGraphic(); // Shows the hitboxes
        this.createWindow(Inventory);

    }

    update(){
        this.controls.update(); // needed for camera controls

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I))){ 
            this.events.emit('toggleInventory');
        }

        if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L))){
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
                // On stop fulll screen
            } else {
                this.scale.startFullscreen();
                // On start fulll screen
            }
        }
    }

    createWindow(func)
    {
        var x = 0;
        var y = 0;

        var handle = 'window' + this.count++;

        var win = this.add.zone(x, y, 500, 1000).setInteractive({ draggable: true }).setOrigin(0);
        var demo = new func(handle, win);
        
        let scene = this.scene.add(handle, demo, true);
        this.inv = demo;
        return scene;
    }
}



const config : Phaser.Types.Core.GameConfig = {
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
                showConvexHulls: true
            },
        },


    },
};

const game = new Phaser.Game(config);
