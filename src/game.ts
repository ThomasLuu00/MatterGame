import 'phaser';
import { FlatBoy, preloadFlatBoy} from './flatboy';

export default class MyGame extends Phaser.Scene
{
    player : FlatBoy;
    shapes: Object;
    curAnim : any;

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

        
        this.player = new FlatBoy(this.matter.world, 400, 300);
        this.player.idle()
        //this.matter.add.gameObject(this.player);

        //this.matter.add.sprite(400,300,'idle','flatboy_idle_01');
   

        this.input.on('pointerdown', function(){
            this.player.idle();
        }, this);

        this.input.keyboard.on('keydown-Z', function (event) {
            this.player.dead();
        }, this);
        
    // Smoothly follow the player
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5);
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
                showStaticBody: false,
                showInternalEdges: true,
                showConvexHulls: true
            },
        },


    },
};

const game = new Phaser.Game(config);
