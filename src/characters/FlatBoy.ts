
class FlatBoy extends Phaser.Physics.Matter.Sprite {
    isRunning : Boolean = false;
    speed : Number = 500;
    frameRate : Number = 30;

    constructor(world : Phaser.Physics.Matter.World, x : number = 0, y : number = 0){
        super(world, 400,300,'dead','flatboy_dead_01');
    }

    idle(){
        this.anims.play('FlatBoy_Idle');
    }

    walk(){
        this.anims.play('FlatBoy_Walk');
    }

    jump(){
        this.anims.play('FlatBoy_Jump');
    }

    run(){
        this.anims.play('FlatBoy_Run');
    }

    dead(){
        this.anims.play('FlatBoy_Dead');
    }
    
    private addAnimation = () => {

		this.scene.anims.create({
			key: "dying",
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
    }
    
}

const preloadFlatBoy = (scene : Phaser.Scene) => {
    scene.load.atlas('dead', '../assets/dead.png', '../assets/dead_atlas.json');
    scene.load.json('shapes', 'assets/dead2.json')
    scene.load.atlas('idle', '../assets/idle.png', '../assets/idle_atlas.json');
    scene.load.json('idle_shapes', 'assets/idle.json')
}

export {FlatBoy, preloadFlatBoy};