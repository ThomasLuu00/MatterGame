import 'phaser';
import { HealthBar, preloadHealthBar } from './ui/healthbar';
import { ChatBox, preloadChatBox, addText } from './ui/chatbox';
import { Button, preloadButton } from './ui/button';
import { Toolbar, preloadToolbar } from './ui/toolbar';
import Player from './player/player';
import { GAME_WIDTH } from './utils/constants';
import InventoryWindow from './ui/inventory-window';

export let isOpened;

export default class UI extends Phaser.Scene {
    player: Player;
    mainScene: Phaser.Scene;
    chatbox: ChatBox;
    toolbar: Toolbar;
    inventory: InventoryWindow;

    constructor() {
        super({
            active: true,
        });
    }

    preload() {
        this.load.bitmapFont('kenvector_future', '../assets/ui/fonts/font.png', '../assets/ui/fonts/font.fnt');
        preloadButton(this);
        preloadHealthBar(this);
        preloadChatBox(this);
        preloadToolbar(this);
    }

    create(data) {
        this.mainScene = this.scene.get('myGame');

        // Getting player reference
        this.player = data.player;

        this.chatbox = new ChatBox(this, 300, 1000);
        this.toolbar = new Toolbar(this, 1000, 870);
        this.inventory = new InventoryWindow(this, 200, 200, this.player);

        //  Our Text object to display the Score
        const healthText = this.add.text(840, 925, 'Health: ' + this.player.sprite.characterData.health, {
            font: '48px Arial',
            fill: '#000000',
        });

        // this.add.bitmapText(840, 825, 'kenvector_future', 'asfsfsdfsdfa', 64);

        const healthbar = new HealthBar(this, GAME_WIDTH / 2, 1000, 'healthbar');
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
