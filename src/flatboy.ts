class FlatBoy extends Phaser.Physics.Matter.Sprite {
    shapes: Object;

    constructor(world : Phaser.Physics.Matter.World, x : number = 0, y : number = 0){
        super(world, x, y,'idle','flatboy_idle_01');

        this.shapes  = Object.assign({}, this.scene.cache.json.get('idle_shapes'), this.scene.cache.json.get('dead_shapes'));
        this.addAnimation();
        
        this.setBody(this.shapes['flatboy_idle_01']);
        this.scene.add.existing(this)
    }
        
    idle(){
        this.play('idle');
    }

    walk(){
        this.play('walk');
    }

    jump(){
        this.play('jump');
    }

    run(){
        this.play('run');
    }

    dead(){
        this.play('dead');
    }

    private addAnimation = () => {

        const animationCallBack = (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {
            //let shape = this.shapes[frame.textureFrame];
            //gameObject.setBody(shape);
        };

		this.scene.anims.create({
			key: "dead",
			frames: this.scene.anims.generateFrameNames('dead',{
                start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_dead_'
            }),
			repeat: 0,
			frameRate: 30
        });

        
        this.scene.anims.create({
			key: "idle",
			frames: this.scene.anims.generateFrameNames('idle',{
                start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_idle_'
            }),
			repeat: -1,
			frameRate: 30
        });

        
        this.on('animationstart-dead', animationCallBack, this);
        this.on('animationupdate-dead', animationCallBack, this);
        this.on('animationcomplete-dead', () => {}, this);
        this.on('animationstart-idle', animationCallBack ,this);
        this.on('animationupdate-idle', animationCallBack,this);
        this.on('animationcomplete-idle', () => {}, this);
    }
}

const preloadFlatBoy = (scene : Phaser.Scene) => {
    scene.load.atlas('dead', '../assets/dead.png', '../assets/dead_atlas.json');
    scene.load.json('dead_shapes', 'assets/dead2.json');
    scene.load.atlas('idle', '../assets/idle.png', '../assets/idle_atlas.json');
    scene.load.json('idle_shapes', 'assets/idle.json');
}

export {FlatBoy, preloadFlatBoy};