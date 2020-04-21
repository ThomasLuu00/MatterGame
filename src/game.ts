import 'phaser';

export default class MyGame extends Phaser.Scene
{
    player : any;
    shapes: any;

    constructor ()
    {
        super('myGame');
    }

    preload ()
    {
        this.load.atlas('dead', '../assets/dead.png', '../assets/dead_atlas.json');
        this.load.json('shapes', 'assets/dead2.json')
        this.load.atlas('idle', '../assets/idle.png', '../assets/idle_atlas.json');
        this.load.json('idle_shapes', 'assets/idle.json')
    }

    create ()
    {
        this.shapes  = this.cache.json.get('idle_shapes');
		this.anims.create({
			key: "dying",
			frames: this.anims.generateFrameNames('dead',{
                start: 1, end: 1, zeroPad: 2, prefix: 'flatboy_dead_'
            }),
			repeat: -1,
			frameRate: 1
        });
        
        this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNames('idle',{
                start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_idle_'
            }),
			repeat: -1,
			frameRate: 1
        });

        this.matter.world.setBounds(0, 0, config.width, config.height);



        this.player = this.matter.add.sprite(400,300,'dead','flatboy_idle_01');
        this.player.setBody(this.shapes['flatboy_idle_01'], {shape: this.shapes['flatboy_idle_01']});
        this.player.play('idle');

        this.player.on('animationupdate-dying', (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : any)  => {
            let shape = this.shapes[frame.textureFrame];
            console.log(shape)
            gameObject.setBody(shape, { shape: shape });
        },this)

        this.player.on('animationupdate-idle', (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : any)  => {
            let shape = this.shapes[frame.textureFrame];
            console.log(shape)
            gameObject.setBody(shape, { shape: shape });
        },this)
        
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
