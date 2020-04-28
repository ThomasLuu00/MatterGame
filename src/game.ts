import 'phaser';
import { FlatBoy, preloadFlatBoy} from './flatboy';
import { NinjaGirl, preloadNinjaGirl} from './ninja-girl';
import Player from './player';

export default class MyGame extends Phaser.Scene
{
    player : Player;
    sprite: any;
    ninja: NinjaGirl;
    shapes: Object;
    curAnim : any;
    controls : any;

    constructor ()
    {
        super('myGame');
    }

    preload ()
    {
        this.load.tilemapTiledJSON("map", "../assets/map/map.json")
        this.load.image("map-tiles","../assets/map/map-tiles.png");
        preloadFlatBoy(this); 
        preloadNinjaGirl(this);
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
        this.sprite = new FlatBoy(this.matter.world, spawnPoint.x, spawnPoint.y);

        this.ninja = new NinjaGirl(this.matter.world, spawnPoint.x + 200, spawnPoint.y + 200);
        this.player = new Player(this, this.ninja);
        this.add.existing(this.sprite);

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

        this.matter.world.createDebugGraphic();

    
    }

    update(){
        this.controls.update();
    }
}

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: MyGame,
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
