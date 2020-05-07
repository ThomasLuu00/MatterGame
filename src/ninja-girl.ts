import Character from './character';

class NinjaGirl extends Character {
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
        super(world, x, y, 'ninjagirl-idle', 0);
        this.scene.add.existing(this);
        this.animations = ['idle', 'run', 'jump', 'throw', 'attack', 'jump-attack'];
        this.name = 'ninjagirl';

        this.addAnimation();
        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const w = this.width * 0.5;
        const h = this.height * 0.7;

        const mainBody = Bodies.rectangle(-w / 2, -h / 2, w, h, { chamfer: { radius: 20 } });
        this.sensors = {
            top: Bodies.rectangle(-w / 2, -h, w, 2, { isSensor: true, label: 'top' }),
            bottom: Bodies.rectangle(-w / 2, 0, w, 2, { isSensor: true, label: 'bottom' }),
            left: Bodies.rectangle(-w, -h / 2, 2, h, { isSensor: true, label: 'left' }),
            right: Bodies.rectangle(0, -h / 2, 2, h, { isSensor: true, label: 'right' }),
        };

        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.top, this.sensors.bottom, this.sensors.left, this.sensors.right],
            inertia: Infinity,
        });

        const cx = this.centerOfMass.x;
        const cy = this.centerOfMass.y;

        this.setExistingBody(compoundBody);
        this.setOrigin(cx, cy);
        this.setScale(0.7);
        this.setPosition(x, y);

        this.anims.play('ninjagirl-idle');
    }

    addAnimation(): void {
        // Need to reset the origin whenever the frame changes
        const animationCallBack = (
            anim: Phaser.Animations.Animation,
            frame: Phaser.Animations.AnimationFrame,
            gameObject: Phaser.Physics.Matter.Sprite,
        ) => {
            const ox = this.originX;
            const oy = this.originY;
            const scale = this.scale;

            this.setOrigin(ox, oy);
            this.setScale(scale);
            this.setFixedRotation();
        };

        const config = {
            idle: {
                key: 'ninjagirl-idle',
                frames: this.scene.anims.generateFrameNames('ninjagirl-idle', {
                    start: 0,
                    end: 9,
                    zeroPad: 2,
                    prefix: 'ninjagirl-idle_',
                }),
                repeat: -1,
                frameRate: 30,
            },
            run: {
                key: 'ninjagirl-run',
                frames: this.scene.anims.generateFrameNames('ninjagirl-run', {
                    start: 0,
                    end: 9,
                    zeroPad: 2,
                    prefix: 'ninjagirl-run_',
                }),
                repeat: -1,
                frameRate: 30,
            },
            jump: {
                key: 'ninjagirl-jump',
                frames: this.scene.anims.generateFrameNames('ninjagirl-jump', {
                    start: 0,
                    end: 2,
                    zeroPad: 2,
                    prefix: 'ninjagirl-jump_',
                }),
                repeat: 0,
                frameRate: 30,
            },
            throw: {
                key: 'ninjagirl-throw',
                frames: this.scene.anims.generateFrameNames('ninjagirl-throw', {
                    start: 0,
                    end: 9,
                    zeroPad: 2,
                    prefix: 'ninjagirl-throw_',
                }),
                repeat: 0,
                frameRate: 30,
            },
            attack: {
                key: 'ninjagirl-attack',
                frames: this.scene.anims.generateFrameNames('ninjagirl-attack', {
                    start: 0,
                    end: 9,
                    zeroPad: 2,
                    prefix: 'ninjagirl-attack_',
                }),
                repeat: 0,
                frameRate: 30,
            },
            'jump-attack': {
                key: 'ninjagirl-jump-attack',
                frames: this.scene.anims.generateFrameNames('ninjagirl-jump-attack', {
                    start: 0,
                    end: 9,
                    zeroPad: 2,
                    prefix: 'ninjagirl-jump-attack_',
                }),
                repeat: 0,
                frameRate: 30,
            },
        };

        for (const i in this.animations) {
            const name = this.animations[i];
            this.scene.anims.create(config[name]);

            this.on('animationstart-ninjagirl-' + name, animationCallBack, this);
            this.on('animationupdate-ninjagirl-' + name, animationCallBack, this);
            this.on(
                'animationcomplete-ninjagirl-' + name,
                () => {
                    this.canAct = true;
                },
                this,
            );
        }
    }
}

const preloadNinjaGirl = (scene: Phaser.Scene) => {
    scene.load.atlas(
        'ninjagirl-idle',
        '../assets/ninja_girl/ninja_girl_idle.png',
        '../assets/ninja_girl/ninja_girl_idle_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-run',
        '../assets/ninja_girl/ninja_girl_run.png',
        '../assets/ninja_girl/ninja_girl_run_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-jump',
        '../assets/ninja_girl/ninja_girl_jump.png',
        '../assets/ninja_girl/ninja_girl_jump_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-throw',
        '../assets/ninja_girl/ninja_girl_throw.png',
        '../assets/ninja_girl/ninja_girl_throw_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-attack',
        '../assets/ninja_girl/ninja_girl_attack.png',
        '../assets/ninja_girl/ninja_girl_attack_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-jump-attack',
        '../assets/ninja_girl/ninja_girl_jump_attack.png',
        '../assets/ninja_girl/ninja_girl_jump_attack_atlas.json',
    );
};

export { NinjaGirl, preloadNinjaGirl };
