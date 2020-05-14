import ProjectileBase from '../projectiles/projectile-base';
import { Weapon } from '../item/itemmeta';

export default abstract class CharacterBase {
    scene: Phaser.Scene;
    characterData: CharacterData;
    sprite: Phaser.Physics.Matter.Sprite;
    sensors: Sensors;

    destroyed = false;
    maxJump = 2;
    jumpCount = 0;
    isInAir = true;

    equipment: Equipment = {
        weapon: null,
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.setSprite(x, y);
        this.setData();
        this.sprite.setData({ class: this });
        this.setBody();
        this.scene.add.existing(this.sprite);
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }

    setBody(): void {
        const sprite = this.sprite;
        const w = this.sprite.width * 0.5;
        const h = this.sprite.height * 0.7;
        const x = this.sprite.x;
        const y = this.sprite.y;
        const thickness = 4;

        const Bodies = this.scene.matter.bodies;
        const Body = this.scene.matter.body;
        const mainBody = Bodies.rectangle(-w / 2, -h / 2, w, h, { chamfer: { radius: 20 } });

        this.sensors = {
            top: Bodies.rectangle(-w / 2, -h, w - thickness, thickness, { isSensor: true, label: 'top' }),
            bottom: Bodies.rectangle(-w / 2, 0, w - thickness, thickness, { isSensor: true, label: 'bottom' }),
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
        };

        this.sensors.top.onCollideCallback = (event) => this.collide(event, this.sensors.top);
        this.sensors.bottom.onCollideCallback = (event) => {
            this.jumpCount = 0;
            this.isInAir = false;
            this.collide(event, this.sensors.bottom);
        };
        this.sensors.left.onCollideCallback = (event) => this.collide(event, this.sensors.left);
        this.sensors.right.onCollideCallback = (event) => this.collide(event, this.sensors.right);
    }

    collide(event: any, side: MatterJS.BodyType){

        if (this.destroyed) return;
        const thisData = event.bodyA.gameObject.data?.values;
        const thatData = event.bodyB.gameObject.data?.values;

        if (thisData?.class !== this) return;
        if (thatData?.class?.owner === this) return;

        if (thatData?.class instanceof ProjectileBase) {
            const projectile: ProjectileBase = thatData.class;
            this.characterData.health -= projectile.projectileData.damage;
            projectile.onHit();
        };
    }

    update(event?: any): void {
        if (this.destroyed) return;
        this.onUpdate(event);
        if (this.characterData.health <= 0) {
            this.destroy();
        }
    }

    destroy(event?: any): void {
        if (this.destroyed) return;
        this.scene.events.off('update', this.update, this);
        this.scene.events.off('shutdown', this.destroy, this);
        this.scene.events.off('destroy', this.destroy, this);
        this.destroyed = true;
        this.onDestroy(event);
        this.scene = null;
        this.characterData = null;
        this.sensors = null;
        this.sprite.destroy();
    }

    flipX() {
        this.sprite.setFlipX(!this.sprite.flipX);
        const temp = this.sensors.left;
        this.sensors.left = this.sensors.right;
        this.sensors.right = temp;
    }

    canJump(): boolean {
        return this.jumpCount < this.maxJump;
    }

    equip(item: Weapon): any {
        if (item) {
            if (this.equipment.weapon) {
                // Something wrong with the unequip function
                // return this.unequip('weapon');
            }
            this.equipment.weapon = item;
        }
    }

    unequip(key: string): any {
        if (key in this.equipment) {
            const item = this.equipment[key];
            this.equipment[key] = null;
            return item;
        }
    }

    abstract setSprite(x: number, y: number): void;
    abstract setData(): void;
    abstract onUpdate(event?: any): void;
    abstract onDestroy(event?: any): void;
    abstract onCollide(): void;
    abstract idle(): void;
    abstract move(left: boolean): void;
    abstract attack(): void;
    abstract jump(): void;
}

interface Sensors {
    top: MatterJS.BodyType;
    bottom: MatterJS.BodyType;
    left: MatterJS.BodyType;
    right: MatterJS.BodyType;
}

interface CharacterData {
    health: number;
    attackSpeed: number;
    moveSpeed: number;
    jumpSpeed: number;
}

interface Equipment {
    weapon: Weapon;
}
