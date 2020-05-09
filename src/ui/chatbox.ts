import 'phaser';

class ChatBox extends Phaser.GameObjects.Image {
    icon: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'chatbox');
        this.scene.add.existing(this);
        
        this.setScale(1, 1);
    }
}

const preloadChatBox = (scene: Phaser.Scene) => {
    scene.load.image('chatbox', '../assets/ui/panel_Example1.png');
};

export { ChatBox, preloadChatBox };
