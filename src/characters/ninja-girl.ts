import CharacterBase from './character-base';
import { Weapon } from '../item/itemmeta';

export default class NinjaGirl extends CharacterBase{

    attackCooldownTimer: Phaser.Time.TimerEvent = null;
    canAttack: boolean = true;

    constructor(scene: Phaser.Scene, x:number, y:number){
        super(scene, x, y);
        let wep = new  Weapon(this.scene.matter.world, 'I01000');
        wep.owner = this;
        this.equip(wep);
    }
    setSprite(x: number, y: number): void {
        this.sprite = this.scene.matter.add.sprite(x, y, 'ninjagirl-idle', 0);
    }
    setData(): void {
        this.characterData = {
            health: 100,
            attackSpeed: 250,
            moveSpeed: 10,
            jumpSpeed: 10,
        }
    }
    onUpdate(event?: any): void {
        //
    }
    onDestroy(event?: any): void {
        console.log('destroy')
    }
    onCollide(): void {
        console.log('collision')
    }
    idle(): void {
        if (!this.isInAir){
            this.sprite.setVelocityX(0);
            this.sprite.anims.play('ninjagirl-idle',true);
        }
    }
    move(left: boolean = false): void {
        if (left != this.sprite.flipX) this.flipX();
        if (!this.isInAir){
            this.sprite.setVelocityX(left ? -this.characterData.moveSpeed : this.characterData.moveSpeed);
            this.sprite.anims.play('ninjagirl-run',true);
        }
    }
    attack(): void {
        if (this.canAttack && this.equipment.weapon) {
            this.canAttack = false;
            this.attackCooldownTimer = this.scene.time.addEvent({
                delay: this.characterData.attackSpeed,
                callback: () => (this.canAttack = true),
            });
            this.sprite.anims.play('ninjagirl-attack',true);
            let dir = (this.sprite.flipX ? - 100 : 100);
            let x = this.sprite.x;
            let y = this.sprite.y;
            this.equipment.weapon.attack(x + dir , y, x + dir + (this.sprite.flipX ? -1 : 1), y);
        }
    }
    jump(): void {
        if (this.canJump()){
            this.jumpCount += 1;
            this.isInAir = true;
            this.sprite.setVelocityY(-this.characterData.jumpSpeed);
            this.sprite.anims.play('ninjagirl-jump',true);
        }
    }
}

export const preloadNinjaGirl = (scene: Phaser.Scene) => {
    scene.load.atlas(
        'ninjagirl-idle',
        '../assets/ninja_girl/ninja_girl_idle.png',
        '../assets/ninja_girl/ninja_girl_idle_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-run',
        '../assets/ninja_girl/ninja_girl_run.png',
        '../assets/ninja_girl/ninja_girl_run_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-jump',
        '../assets/ninja_girl/ninja_girl_jump.png',
        '../assets/ninja_girl/ninja_girl_jump_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-throw',
        '../assets/ninja_girl/ninja_girl_throw.png',
        '../assets/ninja_girl/ninja_girl_throw_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-attack',
        '../assets/ninja_girl/ninja_girl_attack.png',
        '../assets/ninja_girl/ninja_girl_attack_atlas.json',
    );
    scene.load.atlas(
        'ninjagirl-jump-attack',
        '../assets/ninja_girl/ninja_girl_jump_attack.png',
        '../assets/ninja_girl/ninja_girl_jump_attack_atlas.json',
    );
};

export function addNinjaGirlAnimations(scene) {
    scene.anims.create({
        key: 'ninjagirl-idle',
        frames: scene.anims.generateFrameNames('ninjagirl-idle', {
            start: 0,
            end: 9,
            zeroPad: 2,
            prefix: 'ninjagirl-idle_',
        }),
        repeat: 0,
        frameRate: 10,
    });
    scene.anims.create({
        key: 'ninjagirl-run',
        frames: scene.anims.generateFrameNames('ninjagirl-run', {
            start: 0,
            end: 9,
            zeroPad: 2,
            prefix: 'ninjagirl-run_',
        }),
        repeat: 0,
        frameRate: 10,
    });
    scene.anims.create({
        key: 'ninjagirl-jump',
        frames: scene.anims.generateFrameNames('ninjagirl-jump', {
            start: 0,
            end: 2,
            zeroPad: 2,
            prefix: 'ninjagirl-jump_',
        }),
        repeat: 0,
        frameRate: 10,
    });
    scene.anims.create({
        key: 'ninjagirl-attack',
        frames: scene.anims.generateFrameNames('ninjagirl-attack', {
            start: 0,
            end: 9,
            zeroPad: 2,
            prefix: 'ninjagirl-attack_',
        }),
        repeat: 0,
        frameRate: (1000 / scene.atkspd) * 10,
    });
    scene.anims.create({
        key: 'ninjagirl-throw',
        frames: scene.anims.generateFrameNames('ninjagirl-throw', {
            start: 0,
            end: 9,
            zeroPad: 2,
            prefix: 'ninjagirl-throw_',
        }),
        repeat: 0,
        frameRate: (1000 / scene.atkspd) * 10,
    });
}