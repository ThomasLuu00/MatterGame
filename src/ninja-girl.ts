import Character from './character';

class NinjaGirl extends Character{
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number){
        super(world, x, y, 'ninjagirl-idle', 0);
        this.scene.add.existing(this);
        this.animations = ['idle', 'run', 'jump'];
        this.name = 'ninjagirl'

        this.addAnimation();
        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const w = this.width * 0.5;
        const h = this.height * 0.7;

        const mainBody = Bodies.rectangle(-w/2, -h/2, w, h, { chamfer: { radius: 10 } });
        this.sensors = {
            top:Bodies.rectangle(-w/2, -h , w, 2, { isSensor: true, label: 'top'}),
            bottom: Bodies.rectangle(-w/2, 0, w, 2, { isSensor: true, label: 'bottom' }),
            left: Bodies.rectangle(-w, -h/2, 2, h, { isSensor: true, label: 'left' }),
            right: Bodies.rectangle(0, -h/2, 2, h, { isSensor: true, label: 'right'})
        };

        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.top, this.sensors.bottom, this.sensors.left, this.sensors.right],
            inertia: Infinity
        });

        let cx = this.centerOfMass.x
        let cy = this.centerOfMass.y

        this.setExistingBody(compoundBody);
        this.setOrigin(cx, cy);
        this.setScale(0.7);
        this.setPosition(x, y);


        this.anims.play('ninjagirl-idle')
    }

    addAnimation(): void {
        
        // Need to reset the origin whenever the frame changes
        const animationCallBack = (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {

            let ox = this.originX
            let oy = this.originY
            let scale = this.scale

            this.setOrigin(ox, oy);
            this.setScale(scale);
            this.setFixedRotation();
        };

        /*
        this.scene.anims.create({
			key: "ninjagirl-idle",
			frames: this.scene.anims.generateFrameNames('ninjagirl-idle',{
                start: 1, end: 10, zeroPad: 2, prefix: 'ninjagirl-idle' + '_'
            }),
			repeat: -1,
            frameRate: 30,
        });

        this.on('animationstart-ninjagirl-idle', animationCallBack, this);
        this.on('animationupdate-ninjagirl-idle', animationCallBack, this);
        this.on('animationcomplete-ninjagirl-idle', () => {}, this);

        this.scene.anims.create({
			key: "ninjagirl-run",
			frames: this.scene.anims.generateFrameNames('ninjagirl-run',{
                start: 1, end: 10, zeroPad: 2, prefix: 'ninjagirl-run' + '_'
            }),
			repeat: -1,
            frameRate: 30,
        });

        this.on('animationstart-ninjagirl-run', animationCallBack, this);
        this.on('animationupdate-ninjagirl-run', animationCallBack, this);
        this.on('animationcomplete-ninjagirl-run', () => {}, this);
*/
        for (var i in this.animations){
            var name = this.animations[i];
            this.scene.anims.create({
                key: 'ninjagirl-' + name,
                frames: this.scene.anims.generateFrameNames('ninjagirl-'+ name,{
                    start: 1, end: 10, zeroPad: 2, prefix: 'ninjagirl-'+ name + '_'
                }),
                repeat: -1,
                frameRate: 30,
            });
    
            this.on('animationstart-ninjagirl-' + name, animationCallBack, this);
            this.on('animationupdate-ninjagirl-' + name, animationCallBack, this);
            this.on('animationcomplete-ninjagirl-' + name, () => {}, this);
        }
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
    scene.load.atlas('ninjagirl-idle', '../assets/ninja_girl/ninja_girl_idle.png', '../assets/ninja_girl/ninja_girl_idle_atlas.json');
    scene.load.atlas('ninjagirl-run', '../assets/ninja_girl/ninja_girl_run.png', '../assets/ninja_girl/ninja_girl_run_atlas.json');
    scene.load.atlas('ninjagirl-jump', '../assets/ninja_girl/ninja_girl_jump.png', '../assets/ninja_girl/ninja_girl_jump_atlas.json');
}

export {NinjaGirl, preloadNinjaGirl};