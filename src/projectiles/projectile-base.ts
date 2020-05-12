import { ProjectileData } from '../item/item-data';

interface ProjectileInterface {
    scene: Phaser.Scene
    projectileData: ProjectileData;
    destroyed: boolean;
    sprite: Phaser.Physics.Matter.Sprite;

}

export default abstract class ProjectileBase{
    scene: Phaser.Scene;
    projectileData: ProjectileData;
    destroyed: boolean = false;
    sprite: Phaser.Physics.Matter.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number){
        this.scene = scene;
        this.setData();
        this.sprite = this.scene.matter.add.sprite(x, y, this.projectileData.texture, 0);//.setActive(false).setVisible(false);


        this.sprite.setCollisionGroup(this.projectileData.collisionGroup);
        this.sprite.setOnCollide((event)=>{
            if (this.destroyed) return;
            this.onHit(event);
        }); 

        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }

    fire(x: number, y: number){
        //this.sprite.setActive(true).setVisible(true);
        this.onFire(x, y);
    }
    update(event?: any){
        if (this.destroyed) return;
        this.onUpdate(event);
    }
    destroy(event?: any){
        if (this.destroyed) return;
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy',this.destroy, this);
        this.destroyed = true;
        this.onDestroy(event);
        this.scene = null;
        this.projectileData = null;
        this.sprite.destroy();
    }
    abstract setData(): void;
    abstract onFire(x: number, y: number): void;
    abstract onHit(event: any): void
    abstract onUpdate(event: any): void;
    abstract onDestroy(event: any): void;
}