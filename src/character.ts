import Projectile from "./projectile";

export default abstract class Character extends Phaser.Physics.Matter.Sprite {
    sensors: {
        top: MatterJS.BodyType;
        bottom: MatterJS.BodyType;
        left: MatterJS.BodyType;
        right: MatterJS.BodyType;
    };
    isTouching: {
        top: boolean;
        left: boolean;
        right: boolean;
        ground: boolean;
    };

    canJump = true;
    canAct = true;
    canAttack = true;

    name: string;
    animations: Array<string>;
    currentAnimation: string;

    isOnGround: boolean;

    jumpCooldownTimer: Phaser.Time.TimerEvent;
    attackCooldownTimer: Phaser.Time.TimerEvent;

    currentWeapon: Function;
    weapon1: Function;
    weapon2: Function;
    
    atkspd = 250;

    constructor(
        world: Phaser.Physics.Matter.World,
        x: number,
        y: number,
        texture: string,
        frame?: string | number,
        options?: Phaser.Types.Physics.Matter.MatterBodyConfig,
    ) {
        super(world, x, y, texture, frame, options);

        // Track which sensors are touching something
        this.isTouching = { top: false, left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
        this.canAttack = true;
        this.attackCooldownTimer = null;

        // Before matter's update, reset the player's count of what surfaces it is touching.
        this.on(
            'beforeupdate',
            () => {
                this.isTouching.top = false;
                this.isTouching.left = false;
                this.isTouching.right = false;
                this.isTouching.ground = false;
            },
            this,
        );

        this.scene.events.on('update', this.update, this);
        this.world.on('collisionstart', this.onSensorCollide, this);
        this.world.on('collisionend', this.onSensorCollideEnd, this);

        this.weapon1 = () =>{
            new Projectile(this.world, this.x, this.y, 'item-kunai').shoot(new Phaser.Geom.Point(this.x + 1, this.y));
        }
        this.weapon2 = () =>{
            new Projectile(this.world, this.x, this.y, 'item-kunai').shoot(new Phaser.Geom.Point(this.x, this.y + 1));
        }
    }

    update(): void {
        /*
        if (this.body.velocity.x > 7) this.setVelocityX(7);
        else if (velocity.x < -7) this.setVelocityX(-7);
        */
    }

    animate(texture: string) {
        if (texture != this.currentAnimation) {
            this.anims.play(texture);
            this.currentAnimation = texture;
        }
    }

    idle() {
        if (this.canAct) {
            this.setVelocityX(0);
            this.animate(this.name + '-idle');
        }
    }

    jump() {
        if (this.canAct) {
            this.canJump = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
            this.isOnGround = false;
            this.setVelocityY(-11);
            this.animate(this.name + '-jump');
        }
    }

    move(left = false) {
        if (this.canAct) {
            this.setFlipX(left);
            this.setVelocityX(left ? -7 : 7);
            this.animate(this.name + '-run');
        }
    }
    attack() {
        if (this.canAct) {
            this.canAct = false;
            this.canAttack = false;
            this.attackCooldownTimer = this.scene.time.addEvent({
                delay: this.atkspd,
                callback: () => (this.canAct = true)
            });
            this.animate(this.name + '-attack');
        }
    }

    throw() {
        if (this.canAct) {
            this.canAct = false;
            this.attackCooldownTimer = this.scene.time.addEvent({
                delay: this.atkspd,
                callback: () => (this.canAct = true)
            });
            this.animate(this.name + '-throw');
            this.weapon1();
        }
    }

    onSensorCollide(event: any): void {
        for (let i = 0; i < event.pairs.length; i++) {
            const bodyA = event.pairs[i].bodyA;
            const bodyB = event.pairs[i].bodyB;

            //if (bodyA.isSensor) return; // We only care about collisions with physical objects

            if (bodyB === this.sensors.left) {
                this.isTouching.left = true;
                if (event.pairs[i].separation > 0.5) this.x += event.pairs[i].separation - 0.5;
            } else if (bodyB === this.sensors.right) {
                this.isTouching.right = true;
                if (event.pairs[i].separation > 0.5) this.x -= event.pairs[i].separation - 0.5;
            } else if (bodyB === this.sensors.bottom) {
                this.isTouching.ground = true;
            } else if (bodyB === this.sensors.bottom) {
                this.isTouching.top = true;
            }
        }
    }

    onSensorCollideEnd(event: any): void {
        for (let i = 0; i < event.pairs.length; i++) {
            const bodyA = event.pairs[i].bodyA;
            const bodyB = event.pairs[i].bodyB;

            //if (bodyA.isSensor) return; // We only care about collisions with physical objects
            /*
            if (bodyB === this.sensors.left) {
              this.isTouching.left = false;
              if (event.pairs[i].separation > 0.5) this.x += event.pairs[i].separation - 0.5;
            } 
            else if (bodyB === this.sensors.right) {
              this.isTouching.right = false;
              if (event.pairs[i].separation > 0.5) this.x -= event.pairs[i].separation - 0.5;
            } 
            else 
            */
            if (bodyB === this.sensors.bottom) {
                this.isTouching.ground = false;
            } else if (bodyB === this.sensors.top) {
                this.isTouching.top = false;
            }
        }
    }

    abstract addAnimation(): void;
}
