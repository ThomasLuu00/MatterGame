
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
    
    private addAnimation(){
        let dying = this.scene.anims.generateFrameNames('dead',{
            start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_dead_'
        })
        this.scene.anims.create({key: 'dead', frames: dying, frameRate:30, repeat:-1});
    }
    
}

const preloadFlatBoy = (scene : Phaser.Scene) => {
    scene.load.atlas("dead", "../assets/dead.png", "../assets/dead_atlas.json");
}

export {FlatBoy, preloadFlatBoy};