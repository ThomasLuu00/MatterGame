import { ItemData, ItemCatalogue, itemList, projectileList } from '../item/item-data';

export default class Projectile extends Phaser.Physics.Matter.Sprite {
    data: any;
    speed = 10;

    constructor(
        world: Phaser.Physics.Matter.World,
        originx = 0,
        originy = 0,
        targetx = 0,
        targety = 0,
        projectileId: string,
    ) {
        super(world, originx, originy, projectileList[projectileId].texture, 0);
        this.data = projectileList[projectileId];
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
        this.setVelocity(xSpeed, ySpeed);
        this.setIgnoreGravity(true);
        return this;
    }
    
    destroy(){
        this.data = null;
        super.destroy();
    }
}