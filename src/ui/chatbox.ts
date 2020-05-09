import 'phaser';
import TextEdit from 'phaser3-rex-plugins/plugins/textedit.js';

let chatHistory: Array<string>;
let chatIndex = 0;

function onClosed(textObject) {
    chatHistory.push(textObject.text);
    this.scene.add.text(80, 755 + chatIndex * 50, chatHistory[chatIndex], { font: '48px Arial', fill: '#000000' });
    chatIndex++;
}

class ChatBox extends Phaser.GameObjects.Image {
    isOpened: boolean;
    icon: Phaser.GameObjects.Image;
    info: Phaser.GameObjects.Text;
    editor: TextEdit;
    config = {
        text: 'Type here',
        onClose: onClosed,
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'chatbox');
        this.scene.add.existing(this);

        chatIndex = 0;
        chatHistory = new Array<string>();

        this.icon = this.scene.add.image(x + 200, y - 180, 'chatbox');
        this.icon.setScale(2, 2);

        this.info = this.scene.add.text(100, 985, 'Type here', { font: '48px Arial', fill: '#000000' });
        this.info.setInteractive({ useHandCursor: true });
        this.info.on('pointerdown', () => {
            this.editor.open(this.config);
        });

        this.editor = new TextEdit(this.info);
        this.scene.events.on('update', this.update, this);
    }

    update() {
        this.isOpened = this.editor.isOpened;
    }
}

const preloadChatBox = (scene: Phaser.Scene) => {
    scene.load.image('chatbox', '../assets/ui/panel_Example1.png');
};

export { ChatBox, preloadChatBox };
