import 'phaser';
import { HealthBar, preloadHealthBar } from './ui/healthbar';
import { ChatBox, preloadChatBox, addText } from './ui/chatbox';
import { Button, preloadButton } from './ui/button';
import { Toolbar, preloadToolbar } from './ui/toolbar';
import Player from './player/player';

export let isOpened;

export default class UI extends Phaser.Scene {
    player: Player;
    mainScene: Phaser.Scene;
    chatbox: ChatBox;
    toolbar: Toolbar;

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
        preloadToolbar(this);
    }

    create(data) {
        this.mainScene = this.scene.get('myGame');

        // Getting player reference
        this.player = data.player;

        this.chatbox = new ChatBox(this, 400, 1000);
        this.toolbar = new Toolbar(this, 1000, 870);

        //  Our Text object to display the Score
        const healthText = this.add.text(840, 925, 'Health: ' + this.player.sprite.characterData.health, {
            font: '48px Arial',
            fill: '#000000',
        });

        const healthbar = new HealthBar(this, 960, 1000, 'healthbar');
        healthbar.health = 100;

        const buttonXPos = 1400;
        const buttonYPos = 850;

        const buttonOffset = 125;
        const col = 4;

        const buttonIcons: string[] = [
            'information',
            'exitLeft',
            'gear',
            'information',
            'information',
            'return',
            'return',
            'return',
        ];

        for (let i = 0; i < 8; i++) {
            new Button(
                this,
                i >= col ? buttonXPos + (i - col) * buttonOffset : buttonXPos + i * buttonOffset,
                i >= col ? buttonYPos + buttonOffset : buttonYPos,
                buttonIcons[i],
                () => {
                    this.events.emit('subtractHealth');
                },
            );
        }

        this.events.on(
            'addScore',
            () => {
                this.player.sprite.characterData.health += 10;
                healthText.setText('Health: ' + this.player.sprite.characterData.health);
            },
            this,
        );

        this.events.on(
            'subtractHealth',
            () => {
                this.player.sprite.characterData.health -= 10;
                healthbar.health = this.player.sprite.characterData.health;
                healthText.setText('Health: ' + this.player.sprite.characterData.health);
                addText('Button clicked');
            },
            this,
        );

        this.events.on(
            'addHealth',
            () => {
                this.player.sprite.characterData.health += 10;
                healthbar.health = this.player.sprite.characterData.health;
                healthText.setText('Health: ' + this.player.sprite.characterData.health);
            },
            this,
        );

        this.events.on(
            'expandChatbox',
            () => {
                this.chatbox.setPanelVisible();
            },
            this,
        );
    }

    update() {
        isOpened = this.chatbox.isOpened;

        const isWep1Down = this.player.input.weapon1.isDown;
        const isWep2Down = this.player.input.weapon2.isDown;

        if (isWep1Down) {
            this.toolbar.selectCell(0);
        }

        if (isWep2Down) {
            this.toolbar.selectCell(1);
        }
    }
}
