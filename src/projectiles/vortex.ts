import ProjectileBase from './projectile-base';
import { Particle } from './particles';
import { projectileList } from './projectile-list';

export default class VortexProjectile extends ProjectileBase {
    speed = 5;

    setSprite(x: number, y: number): void {
        this.sprite = this.scene.matter.add.sprite(x, y, Particle.Vortex, 0);
    }

    setData(): void {
        this.projectileData = projectileList.P01000;
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
        sprite.on(
            'animationcomplete-' + Particle.Vortex,
            () => {
                if (this.destroyed) return;
                this.sprite.play(Particle.Vortex);
            },
            this,
        );
        sprite.play(Particle.Vortex);
    }

    onHit(event: any): void {
        this.destroy();
    }

    onUpdate(event: any): void {
        //
    }

    onDestroy(event: any): void {
        //
    }
}
