import { ProjectileData } from '../item/item-data';
import { Particle } from './particles';

export default class Projectile extends Phaser.Physics.Matter.Sprite {

    projectileData: ProjectileData;
    speed = 20;
    destroyed: boolean = false;

    constructor(
        world: Phaser.Physics.Matter.World,
        originx = 0,
        originy = 0,
        targetx = 0,
        targety = 0,
        projectileData: ProjectileData,
    ) {
        super(world, originx, originy, projectileData.texture, 0);
        this.projectileData = projectileData;

        this.setCollisionGroup(this.projectileData.collisionGroup);
        this.setOnCollide((event)=>{
            if (this.destroyed) return;
            this.onHit(event);
            this.destroy();
        }); 

        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.shoot(targetx, targety);
    }

    shoot(x: number, y: number) {
        this.scene.add.existing(this);
        const direction = Math.atan((x - this.x) / (y - this.y));
        // Calculate X and y velocity of bullet to moves it from shooter to target
        const mod: number = y >= this.y ? 1 : -1;

        const xRatio: number = mod * Math.sin(direction);
        const yRatio: number = mod * Math.cos(direction);
        const xSpeed: number = this.speed * xRatio;
        const ySpeed: number = this.speed * yRatio;

        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, x, y) + Phaser.Math.DegToRad(90);
        this.setIgnoreGravity(true);
        this.setVelocity(xSpeed, ySpeed);
        this.setFrictionAir(0);
        return this;
    }

    update() {
        if (this.destroyed) return;
        // Event to be called on update. this might be called once after onHit.
    }

    onHit(event) {
        this.world.scene.add.sprite(this.x, this.y, Particle.Magic8).play(Particle.Magic8);
    }
    
    destroy(){
        this.destroyed = true;
        this.projectileData = null;
        this.world.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        super.destroy();
    }
}