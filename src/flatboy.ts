class FlatBoy extends Phaser.Physics.Matter.Sprite {
    shapes: Object;
    sensors: { bottom: MatterJS.BodyType; left: MatterJS.BodyType; right: MatterJS.BodyType; };
    isTouching: { left: boolean; right: boolean; ground: boolean; };
    canJump: boolean;
    jumpCooldownTimer: any;

    constructor(world : Phaser.Physics.Matter.World, x : number = 0, y : number = 0){
        super(world, x, y,'idle','flatboy_idle_01');
        this.shapes  = Object.assign({}, this.scene.cache.json.get('idle_shapes'), this.scene.cache.json.get('dead_shapes'));
        this.addAnimation();

        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const w = this.width;
        const h = this.height;

        
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h* 0.6, { chamfer: { radius: 10 } });
        this.sensors = {
          bottom: Bodies.rectangle(0, h , w * 0.25, 2, { isSensor: true }),
          left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
          right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true })

        };
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.right, this.sensors.left],
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.setPosition(x, y);
        this.toggleFlipX();

        // Track which sensors are touching something
        this.isTouching = { left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
        
        // Before matter's update, reset the player's count of what surfaces it is touching.
        this.on("beforeupdate", this.resetTouching, this);

        this.on('collidestart',this.onSensorCollide);
        this.on('collideactive',this.onSensorCollide)

   
    }
        
    onSensorCollide({ bodyA, bodyB, pair }) {
        console.log('inonsensor')
        // Watch for the player colliding with walls/objects on either side and the ground below, so
        // that we can use that logic inside of update to move the player.
        // Note: we are using the "pair.separation" here. That number tells us how much bodyA and bodyB
        // overlap. We want to teleport the sprite away from walls just enough so that the player won't
        // be able to press up against the wall and use friction to hang in midair. This formula leaves
        // 0.5px of overlap with the sensor so that the sensor will stay colliding on the next tick if
        // the player doesn't move.
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        if (bodyA === this.sensors.left) {
          this.isTouching.left = true;
          if (pair.separation > 0.5) this.x += pair.separation - 0.5;
        } else if (bodyA === this.sensors.right) {
          this.isTouching.right = true;
          if (pair.separation > 0.5) this.x -= pair.separation - 0.5;
        } else if (bodyA === this.sensors.bottom) {
          this.isTouching.ground = true;
        }
      }
    
      resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
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
            var sx = gameObject.x;
            var sy = gameObject.y;

            //let shape = this.shapes[frame.textureFrame];
            //gameObject.setBody(shape);

            gameObject.setPosition(sx, sy);
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