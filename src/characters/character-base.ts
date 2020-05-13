import ProjectileBase from "../projectiles/projectile-base";

export default abstract class CharacterBase{
    scene: Phaser.Scene;
    characterData: any; 
    sprite: Phaser.Physics.Matter.Sprite;
    sensors: Sensors;
    destroyed: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number){
        this.scene = scene;
        this.setSprite(x, y);
        this.setData();
        this.setBody();
        this.scene.add.existing(this.sprite);
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }
    setBody(): void{
        const sprite = this.sprite;
        const w = this.characterData.width;
        const h = this.characterData.height;
        const x = this.sprite.x;
        const y = this.sprite.y;
        const thickness = 4;

        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const mainBody = Bodies.rectangle(-w / 2, -h / 2, w, h, { chamfer: { radius: 20 } });

        this.sensors = {
            top: Bodies.rectangle(-w / 2, -h, w- thickness, thickness, { isSensor: true, label: 'bottom' }),
            bottom: Bodies.rectangle(-w / 2, 0, w- thickness, thickness, { isSensor: true, label: 'bottom' }),
            left: Bodies.rectangle(-w, -h / 2, thickness, h - thickness, { isSensor: true, label: 'left' }),
            right: Bodies.rectangle(0, -h / 2, thickness, h - thickness, { isSensor: true, label: 'right' }),
        };

        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.top, this.sensors.bottom, this.sensors.left, this.sensors.right],
            inertia: Infinity,
        });

        const cx = sprite.centerOfMass.x;
        const cy = sprite.centerOfMass.y;

        sprite.setExistingBody(compoundBody);
        sprite.setOrigin(cx, cy);
        sprite.setPosition(x, y);

        this.sensors.bottom.onCollideCallback = () => {
            //console.log('bottom touching');
        }

        this.sensors.right.onCollideCallback = (event) => {
            //console.log(event);
            //console.log(event.bodyA.gameObject);
            if (event.bodyB.gameObject.data) {
                let projectile: ProjectileBase = event.bodyB.gameObject.data.values.projectile;
                console.log(projectile);
                projectile.destroy();
            };
        }

        //sprite.setCollidesWith([-1]);
    };

    update(event?: any): void{
        if (this.destroyed) return;
        this.onUpdate(event);
    }

    destroy(event?: any): void{
        if (this.destroyed) return;
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy',this.destroy, this);
        this.destroyed = true;
        this.onDestroy(event);
        this.scene = null;
        this.characterData = null;
        this.sensors = null;
        this.sprite.destroy();
    }
    abstract setSprite(x: number, y: number): void;
    abstract setData(): void;
    abstract onUpdate(event?: any): void;
    abstract onDestroy(event?: any): void;
    abstract onCollision(): void;
}

interface Sensors{
    top: MatterJS.BodyType;
    bottom: MatterJS.BodyType;
    left: MatterJS.BodyType;
    right: MatterJS.BodyType;
}

interface Touching{
    bottom: boolean;
    left: boolean;
    right: boolean;
}
