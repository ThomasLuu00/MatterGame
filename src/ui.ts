import 'phaser';
import { HealthBar, preloadHealthBar } from './ui/healthbar';

export default class UI extends Phaser.Scene{
    health : number = 100;
    mainScene : Phaser.Scene;

    constructor(){
        super({ 
            key: 'UIScene', 
            active: true 
        });
    }

    preload ()
    {
        preloadHealthBar(this);
    }

    create(){
        this.mainScene = this.scene.get('myGame');
        //  Our Text object to display the Score
        let info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000' });
        let healthbar = new HealthBar(this, 400,  100, 'healthbar');
        healthbar.health = 100;
        info.setText('Score: ' + this.health);
        
        this.mainScene.events.on('addScore', () => {
            this.health += 10;
            info.setText('Score: ' + this.health);
        }, this);

        this.mainScene.events.on('subtractHealth', () => {
            this.health -= 10;
            healthbar.health = this.health;
            info.setText('Score: ' + this.health);
        }, this);

        this.mainScene.events.on('addHealth', () => {
            this.health += 10;
            healthbar.health = this.health;
            info.setText('Score: ' + this.health);
        }, this);

    }
}