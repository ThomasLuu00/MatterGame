import Character from './character';

class NinjaGirl extends Character{
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number){
        super(world, x, y, 'ninjagirlidle', 'ninja_girl_idle_00');
        this.scene.add.existing(this);
        this.addAnimation();
        this.animations = ['idle'];

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
    }

    addAnimation(): void {
        
        // Need to reset the origin whenever the frame changes
        const animationCallBack = (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {
            let cx = gameObject.centerOfMass.x
            let cy = gameObject.centerOfMass.y
            this.setOrigin(cx - 0.05, cy + 0.31);
        };

        this.scene.anims.create({
			key: "ninjagirlidle",
			frames: this.scene.anims.generateFrameNames('ninjagirlidle',{
                start: 1, end: 10, zeroPad: 2, prefix: 'ninja_girl_idle_'
            }),
			repeat: 0,
			frameRate: 30
        });

        this.on('animationstart-ninjagirlidle', animationCallBack, this);
        this.on('animationupdate-ninjagirlidle', animationCallBack, this);
        this.on('animationcomplete-ninjagirlidle', () => {}, this);
    }
    
    update(): void {
        
    }

    onSensorCollide(event: any): void {
        for (var i = 0; i < event.pairs.length; i++) {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;
 
            if (bodyA.isSensor) return; // We only care about collisions with physical objects

            if (bodyB === this.sensors.left) {
              this.isTouching.left = true;
              if (event.pairs[i].separation > 0.5) this.x += event.pairs[i].separation - 0.5;
            } 
            else if (bodyB === this.sensors.right) {
              this.isTouching.right = true;
              if (event.pairs[i].separation > 0.5) this.x -= event.pairs[i].separation - 0.5;
            } 
            else if (bodyB === this.sensors.bottom) {
              this.isTouching.ground = true;
            }
            else if (bodyB === this.sensors.bottom) {
                this.isTouching.top = true;
            }
        }
    }
}

const preloadNinjaGirl = (scene : Phaser.Scene) => {
    scene.load.atlas('ninjagirlidle', '../assets/ninja_girl/ninja_girl_idle.png', '../assets/ninja_girl/ninja_girl_idle_atlas.json');
}

export {NinjaGirl, preloadNinjaGirl};