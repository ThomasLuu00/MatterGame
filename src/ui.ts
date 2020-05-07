import 'phaser';
import TextEdit from 'phaser3-rex-plugins/plugins/textedit.js';
import { HealthBar, preloadHealthBar } from './ui/healthbar';
import { Button, preloadButton } from './ui/button';

export let isOpened;

export default class UI extends Phaser.Scene {
    health = 100;
    mainScene: Phaser.Scene;
    info: Phaser.GameObjects.Text;
    editor: TextEdit;

    constructor() {
        super({
            key: 'UIScene',
            active: true,
        });
    }

    preload() {
        preloadButton(this);
        preloadHealthBar(this);
    }

    create() {
        this.mainScene = this.scene.get('myGame');

        const healthbar = new HealthBar(this, 960, 880, 'healthbar');
        healthbar.health = 100;

        //  Our Text object to display the Score
        this.info = this.add.text(860, 780, 'Score: 0', { font: '48px Arial', fill: '#000000' });
        this.info.setText('Score: ' + this.health);
        this.info.setInteractive({ useHandCursor: true });
        this.info.on('pointerdown', () => {
            this.editor.open();
        });

        this.editor = new TextEdit(this.info);

        const buttonXPos = 300;
        const buttonYPos = 880;

        const button = new Button(this, buttonXPos, buttonYPos, 'swords');
        new Button(this, buttonXPos + 50, buttonYPos, 'swords', true);
        new Button(this, buttonXPos + 100, buttonYPos, 'swords');

        this.events.on(
            'addScore',
            () => {
                this.health += 10;
                this.info.setText('Score: ' + this.health);
            },
            this,
        );

        this.events.on(
            'subtractHealth',
            () => {
                this.health -= 10;
                healthbar.health = this.health;
                this.info.setText('Score: ' + this.health);
            },
            this,
        );

        this.events.on(
            'addHealth',
            () => {
                this.health += 10;
                healthbar.health = this.health;
                this.info.setText('Score: ' + this.health);
            },
            this,
        );
    }

    update() {
        isOpened = this.editor.isOpened;
    }
}
