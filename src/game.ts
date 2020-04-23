import 'phaser';
import { FlatBoy, preloadFlatBoy} from './flatboy';

export default class MyGame extends Phaser.Scene
{
    player : FlatBoy;
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
    }

    create ()
    {
        
        //this.matter.world.setBounds(0, 0, Number(config.width),Number(config.height));

        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("map-tiles");
        const groundLayer = map.createDynamicLayer("Ground", tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(groundLayer);

        const spawnPoint : any = map.findObject("Spawn", obj => obj.name === "Spawn Point");
        this.player = new FlatBoy(this.matter.world, spawnPoint.x, spawnPoint.y);
        this.player.idle()

   

        this.input.on('pointerdown', function(){
            this.player.idle();
        }, this);

        this.input.keyboard.on('keydown-Z', function (event) {
            this.player.dead();
        }, this);
        
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
    
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5).setZoom(0.5);;
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
                y: 0,
            },
            debug: {
                showStaticBody: false,
                showInternalEdges: true,
                showConvexHulls: true
            },
        },


    },
};

const game = new Phaser.Game(config);
