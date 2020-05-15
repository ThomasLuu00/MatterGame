import CharacterBase from '../characters/character-base';
import ProjectileData from './projectile-list';

interface ProjectileInterface {
    scene: Phaser.Scene;
    projectileData: ProjectileData;
    destroyed: boolean;
    sprite: Phaser.Physics.Matter.Sprite;
    owner: CharacterBase;
}

export default abstract class ProjectileBase implements ProjectileInterface {
    scene: Phaser.Scene;
    projectileData: ProjectileData;
    destroyed = false;
    sprite: Phaser.Physics.Matter.Sprite;
    owner: CharacterBase;

    constructor(scene: Phaser.Scene, x: number, y: number, owner: CharacterBase) {
        this.scene = scene;
        this.owner = owner;
        this.setSprite(x, y);
        this.setData();
        this.sprite.setData({ class: this });
        this.sprite.setSensor(true);
        //.setActive(false).setVisible(false);

        this.sprite.setCollisionGroup(this.projectileData.collisionGroup);

        /*
        this.sprite.setOnCollide((event)=>{
            if (this.destroyed) return;
            this.onHit(event)
        }); 
        */

        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }

    fire(x: number, y: number) {
        this.onFire(x, y);
    }

    update(event?: any) {
        if (this.destroyed) return;
        this.onUpdate(event);
    }

    destroy(event?: any) {
        if (this.destroyed) return;
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy', this.destroy, this);
        this.destroyed = true;
        this.onDestroy(event);
        this.scene = null;
        this.projectileData = null;
        this.sprite.destroy();
    }
    abstract setSprite(x: number, y: number): void;
    abstract setData(): void;
    abstract onFire(x: number, y: number): void;
    abstract onHit(event?: any): void;
    abstract onUpdate(event?: any): void;
    abstract onDestroy(event?: any): void;
}
