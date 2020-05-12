import ProjectileBase from './projectile-base';
import { ProjectileData, projectileList } from '../item/item-data';
import { Particle } from './particles';


export default class KunaiProjectile extends ProjectileBase{

    speed = 100;

    setData(): void {
        this.projectileData = projectileList.P01000
    }

    onFire(x: number, y: number): void {
        const sprite = this.sprite;
        const direction = Math.atan((x - sprite.x) / (y - sprite.y));
        // Calculate X and y velocity of bullet to moves it from shooter to target
        const mod: number = y >= sprite.y ? 1 : -1;

        const xRatio: number = mod * Math.sin(direction);
        const yRatio: number = mod * Math.cos(direction);
        const xSpeed: number = this.speed * xRatio;
        const ySpeed: number = this.speed * yRatio;

        sprite.rotation = Phaser.Math.Angle.Between(sprite.x, sprite.y, x, y) + Phaser.Math.DegToRad(90);
        sprite.setIgnoreGravity(true);
        sprite.setFrictionAir(0);
        sprite.setVelocity(xSpeed, ySpeed);
    }

    onHit(event: any): void {
        const sprite = this.sprite;
        let effect = this.scene.add.sprite(sprite.x, sprite.y, Particle.Magic8);
        effect.once('animationcomplete-' + Particle.Magic8,
            () => {   
                effect.destroy();
            },
        );
        effect.play(Particle.Magic8);
        this.destroy();
    }

    onUpdate(event: any): void {
        //
    }

    onDestroy(event: any): void {
        //
    }

}