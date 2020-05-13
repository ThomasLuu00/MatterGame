import CharacterBase from './character-base';
import { Weapon } from '../item/itemmeta';

export default class NewGirl extends CharacterBase{

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
