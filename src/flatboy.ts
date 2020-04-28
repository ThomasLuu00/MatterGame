class FlatBoy extends Phaser.Physics.Matter.Sprite{
    shapes: Object;
    sensors: { 
        top: MatterJS.BodyType, 
        bottom: MatterJS.BodyType,
        left: MatterJS.BodyType,
        right: MatterJS.BodyType
    };
    isTouching: { 
        top: boolean,
        left: boolean,
        right: boolean,
        ground: boolean,
    };
    canJump: boolean;
    jumpCooldownTimer: any;
    animation: string 
    animations: Array<string>;

    constructor(world : Phaser.Physics.Matter.World, x : number = 0, y : number = 0){
        super(world, x, y,'idle','flatboy_idle_01',{ render: { sprite: { xOffset: 70, yOffset: 0 } }});
        this.shapes  = Object.assign({}, this.scene.cache.json.get('idle_shapes'), this.scene.cache.json.get('dead_shapes'));
        this.addAnimation();
        this.animations = ['idle', 'walk', 'run', 'dead']
        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const w = this.width;
        const h = this.height;

        const mainBody = Bodies.rectangle(0, 0, w * 0.3, h* 0.38, { chamfer: { radius: 10 } });
        this.sensors = {
            top:Bodies.rectangle(0, -h* 0.18 , w * 0.15, 2, { isSensor: true, label: 'top'}),
            bottom: Bodies.rectangle(0, h* 0.2 , w * 0.15, 2, { isSensor: true, label: 'bottom' }),
            left: Bodies.rectangle(-w * 0.15, 0, 2, h * 0.38, { isSensor: true, label: 'left' }),
            right: Bodies.rectangle(w * 0.15, 0, 2, h * 0.38, { isSensor: true, label: 'right'})
        };

        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.top,this.sensors.right, this.sensors.left,this.sensors.bottom],
            inertia: Infinity
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.setPosition(x, y);

        let cx = this.centerOfMass.x
        let cy = this.centerOfMass.y
        this.setOrigin(cx - 0.05, cy + 0.31);

        // Track which sensors are touching something
        this.isTouching = { top: false, left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
        
        // Before matter's update, reset the player's count of what surfaces it is touching.
        this.on("beforeupdate", this.resetTouching, this);
        this.world.on('collisionstart',this.onSensorCollide,this);

    }
        
    onSensorCollide(event) {

        for (var i = 0; i < event.pairs.length; i++) {

            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;
 
            if (bodyA.isSensor) return; // We only care about collisions with physical objects
            if (bodyB === this.sensors.left) {
              this.isTouching.left = true;
              if (event.pairs[i].separation > 0.5) this.x += event.pairs[i].separation - 0.5;
            } else if (bodyB === this.sensors.right) {
              this.isTouching.right = true;
              if (event.pairs[i].separation > 0.5) this.x -= event.pairs[i].separation - 0.5;
            } else if (bodyB === this.sensors.bottom) {
              this.isTouching.ground = true;
            }
        }
      }
    
      resetTouching(){
        this.isTouching.top = false;
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }
    animate(name : string){
        if (name != this.animation){
            this.anims.play(name);
            this.animation = name;
        }
    }

    private addAnimation = () => {

        const animationCallBack = (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {
            var sx = gameObject.x;
            var sy = gameObject.y;

            //let shape = this.shapes[frame.textureFrame];
            //gameObject.setBody(shape);

            //gameObject.setPosition(sx, sy);
            let cx = gameObject.centerOfMass.x
            let cy = gameObject.centerOfMass.y
            this.setOrigin(cx - 0.05, cy + 0.31);
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