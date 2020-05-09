import 'phaser';
import TextEdit from 'phaser3-rex-plugins/plugins/textedit.js';
import { HealthBar, preloadHealthBar } from './ui/healthbar';
import { ChatBox, preloadChatBox } from './ui/chatbox';
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
        preloadChatBox(this);
    }

    create() {
        this.mainScene = this.scene.get('myGame');

        const chatbox = new ChatBox(this, 250, 1000);

        //  Our Text object to display the Score
        const healthText = this.add.text(840, 925, 'Health: ' + this.health, { font: '48px Arial', fill: '#000000' });

        this.info = this.add.text(80, 985, 'Type here', { font: '48px Arial', fill: '#000000' });
        this.info.setInteractive({ useHandCursor: true });
        this.info.on('pointerdown', () => {
            this.editor.open();
        });

        this.editor = new TextEdit(this.info);

        const healthbar = new HealthBar(this, 960, 1000, 'healthbar');
        healthbar.health = 100;

        const buttonXPos = 1600;
        const buttonYPos = 950;

        const buttonOffset = 60;
        const col = 4;

        for (let i = 0; i < 8; i++) {
            new Button(
                this,
                i >= col ? buttonXPos + (i - col) * buttonOffset : buttonXPos + i * buttonOffset,
                i >= col ? buttonYPos + buttonOffset : buttonYPos,
                'swords',
            );
        }

        this.events.on(
            'addScore',
            () => {
                this.health += 10;
                healthText.setText('Health: ' + this.health);
            },
            this,
        );

        this.events.on(
            'subtractHealth',
            () => {
                this.health -= 10;
                healthbar.health = this.health;
                healthText.setText('Health: ' + this.health);
            },
            this,
        );

        this.events.on(
            'addHealth',
            () => {
                this.health += 10;
                healthbar.health = this.health;
                healthText.setText('Health: ' + this.health);
            },
            this,
        );
    }

    update() {
        isOpened = this.editor.isOpened;
    }
}
