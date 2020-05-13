import { Weapon } from '../item/itemmeta';
import Equipment from '../player/equipment';
import ProjectileBase from '../projectiles/projectile-base';

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
    canMove = true;
    canAttack = true;

    isParalyzed = false;
    isPoisoned = false;
    isDead = false;

    name: string;
    animations: Array<string>;
    currentAnimation: string;

    isOnGround: boolean;

    jumpCooldownTimer: Phaser.Time.TimerEvent;
    attackCooldownTimer: Phaser.Time.TimerEvent;

    equipment: Equipment;

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

        this.equipment = new Equipment();
        const weapon = new Weapon(this.world, 'I01000');
        weapon.owner = this;
        this.equipment.weaponSlot1 = weapon;
        //this.equipment.weaponSlot1 = new Weapon(this.world, 'IO1000');
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
        this.setVelocityX(0);
        this.animate(this.name + '-idle');
    }

    jump() {
        if (this.canJump) {
            this.canJump = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true),
            });
            this.isOnGround = false;
            this.setVelocityY(-11);
            this.animate(this.name + '-jump');
        }
    }

    move(left = false) {
        if (this.canMove) {
            this.setFlipX(left);
            this.setVelocityX(left ? -7 : 7);
            this.animate(this.name + '-run');
        }
    }
    attack() {
        if (this.canAttack && this.equipment.weapon) {
            this.canAttack = false;
            this.attackCooldownTimer = this.scene.time.addEvent({
                delay: this.atkspd,
                callback: () => (this.canAttack = true),
            });
            this.animate(this.name + '-attack');
            let dir = (this.flipX ? - 100 : 100) // TODO: dont hardcode this
            this.equipment.weapon.attack(this.x + dir , this.y, this.x + dir + (this.flipX ? -1 : 1), this.y);
        }
    }

    switchWeapon(slot: integer) {
        if (slot > 0 && slot < 3) {
            this.equipment.setWeapon(slot);
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
            } else if (bodyB === this.sensors.top) {
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
