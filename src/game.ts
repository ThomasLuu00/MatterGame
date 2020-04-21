import 'phaser';

export default class MyGame extends Phaser.Scene
{
    player : Phaser.Physics.Matter.Sprite;
    shapes: any;

    constructor ()
    {
        super('myGame');
    }

    preload ()
    {
        this.load.atlas("dead", "../assets/dead.png", "../assets/dead_atlas.json");
        this.load.json('shapes', 'assets/test.json')
    }

    create ()
    {

   
        this.matter.world.setBounds(0, 0, config.width, config.height);
        this.shapes  = this.cache.json.get('shapes')
        this.player = this.matter.add.sprite(400,300,'dead','flatboy_dead_01');
        this.player.setCircle(0); // figure out a better method after
        let test = this.matter.add.sprite(600,300,'dead','flatboy_dead_01').setVelocityX(-10);
        let dying = this.anims.generateFrameNames('dead',{
            start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_dead_'
        })

        this.matter.add.gameObject(this.player, {shape: this.shapes.dead})

        this.player.setScale(0.5);
    }
}

const config = {
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
                y: 0
            },
            debug: true,
            showStaticBody: true,
            showInternalEdges: true,
            showConvexHulls: true
        },

    },
};

const game = new Phaser.Game(config);
