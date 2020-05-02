import 'phaser';

export default class UI extends Phaser.Scene{
    health : number = 100;
    mainScene : Phaser.Scene;

    constructor(){
        super({ 
            key: 'UIScene', 
            active: true 
        });
    }

    create(){
        this.mainScene = this.scene.get('myGame');
        //  Our Text object to display the Score
        let info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000' });
        this.mainScene.events.on('addScore', () => {
            this.health += 10;
            info.setText('Score: ' + this.health);
        }, this);
    }
}