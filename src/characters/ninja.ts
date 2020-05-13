import CharacterBase from './character-base';

export default class NewGirl extends CharacterBase{
    setSprite(x: number, y: number): void {
        this.sprite = this.scene.matter.add.sprite(x, y, 'ninjagirl-idle', 0);
    }
    setData(): void {
        this.characterData = {
            health: 100,
        }
    }
    onUpdate(event?: any): void {
        this.sprite.anims.play('ninjagirl-idle',true);
    }
    onDestroy(event?: any): void {
        console.log('destroy')
    }
    onCollide(): void {
        console.log('collision')
    }
}