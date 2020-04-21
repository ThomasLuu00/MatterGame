import 'phaser';

export default class MyGame extends Phaser.Scene
{
    player : Phaser.Physics.Matter.Sprite;
    shapes: Object;
    curAnim : any;

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
        this.shapes  = Object.assign({}, this.cache.json.get('idle_shapes'), this.cache.json.get('shapes'));

		this.anims.create({
			key: "dying",
			frames: this.anims.generateFrameNames('dead',{
                start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_dead_'
            }),
			repeat: 0,
			frameRate: 30
        });
        
        this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNames('idle',{
                start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_idle_'
            }),
			repeat: -1,
			frameRate: 30
        });

        this.matter.world.setBounds(0, 0, Number(config.width),Number(config.height));

        const animationCallBack = (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {

            let shape = this.shapes[frame.textureFrame];
            gameObject.setBody(shape);
            
        }

        this.player = this.matter.add.sprite(400,300,'idle','flatboy_idle_01');
        this.player.setBody(this.shapes['flatboy_idle_01']);
        //this.player.setScale(0.5);
        //this.player.play('idle');

        this.player.on('animationupdate-dying', (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {
            let shape = this.shapes[frame.textureFrame];
            gameObject.setBody(shape);
        },this)

        this.player.on('animationupdate-idle', animationCallBack,this)

        this.player.on('animationstart-idle', animationCallBack ,this)



        this.player.on('animationcomplete-idle', (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : any)  => {
            let shape = frame.textureFrame;
            console.log('end ' + shape);
        },this)

        this.input.on('pointerdown', function(){
            this.player.play('idle');
        }, this);

        this.input.keyboard.on('keydown-Z', function (event) {
            this.player.play('dying');
        }, this);

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
                y: 0
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
