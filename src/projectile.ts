export default class Projectile extends Phaser.Physics.Matter.Sprite{

    speed = 10;

    constructor (world : Phaser.Physics.Matter.World, x : number = 0, y : number = 0, anim: string)
    {
        super(world, x, y, anim, 0);
    }

    shoot(target: Phaser.Geom.Point)
    {
        this.scene.add.existing(this);
        let direction = Math.atan( (target.x-this.x) / (target.y-this.y));
        // Calculate X and y velocity of bullet to moves it from shooter to target
        let mod: number = (target.y >= this.y) ? 1 : -1;

        let xRatio: number = mod * Math.sin(direction);
        let yRatio: number = mod * Math.cos(direction);
        let xSpeed: number = this.speed * xRatio;
        let ySpeed: number  = this.speed * yRatio;

        this.rotation = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y) + Phaser.Math.DegToRad(90);
        this.setVelocity(xSpeed, ySpeed);
        this.setIgnoreGravity(true);
    }
};