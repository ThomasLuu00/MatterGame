import CharacterBase from './character-base';

export default class NewGirl extends CharacterBase{
    setSprite(x: number, y: number): void {
        this.sprite = this.scene.matter.add.sprite(x, y, 'ninjagirl-idle', 0);
    }
    setData(): void {
        this.characterData = {
            health: 100,
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
        this.sprite.anims.play('ninjagirl-attack',true);
    }
    jump(): void {
        if (this.canJump()){
            console.log(this.jumpCount)
            this.jumpCount += 1;
            this.isInAir = true;
            this.sprite.setVelocityY(-this.characterData.jumpSpeed);
            this.sprite.anims.play('ninjagirl-jump',true);
        }
    }
}
