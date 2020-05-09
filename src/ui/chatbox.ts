import 'phaser';
import TextEdit from 'phaser3-rex-plugins/plugins/textedit.js';
import { GridTable } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { Label } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

let chatHistory: any[];
let chatIndex = 0;
let panel: GridTable;

function onClosed(textObject) {
    chatHistory.push({
        id: chatIndex,
        font: '48px Arial',
        color: 0x260e04,
        text: textObject.text,
    });
    panel.setItems(chatHistory);
    panel.layout();
    chatIndex++;
}

class ChatBox extends Phaser.GameObjects.Image {
    isOpened: boolean;
    info: Phaser.GameObjects.Text;
    editor: TextEdit;
    config = {
        onClose: onClosed,
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'chatbox');
        this.scene.add.existing(this);

        this.x = x + 75;
        this.displayWidth = 700;

        const icon: Phaser.GameObjects.Image = this.scene.add.image(x, y, 'chatbox');

        chatIndex = 0;
        chatHistory = [];

        panel = new GridTable(this.scene, {
            x: x + 125,
            y: y - 180,
            width: 800,
            height: 400,

            scrollMode: 0,

            // Elements
            background: icon,

            table: {
                cellWidth: 100,
                cellHeight: 50,
                columns: 1,
                mask: {
                    padding: 1,
                },
                reuseCellContainer: true,
            },

            // slider: {
            //     track: trackGameObject,
            //     thumb: thumbGameObject,
            // },

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,

                table: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                const scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index;
                if (cellContainer === null) {
                    // No reusable cell container, create a new one
                    cellContainer = new Label(scene, {
                        width: width,
                        height: height,

                        orientation: 0,
                        // background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                        // icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                        text: scene.add.text(0, 0, item.text, { font: item.font, background: item.color }),

                        space: {
                            icon: 10,
                            left: 15,
                            top: 0,
                        },
                    });
                }

                // Set child properties of cell container
                cellContainer.setMinSize(width, height); // Size might changed
                return cellContainer; // or null
            },
        }).layout();

        this.info = this.scene.add.text(100, 985, 'Type here', {
            font: '48px Arial',
            fixedWidth: this.width,
            fixedHeight: this.height / 2 - 25,
            valign: 'center',
            color: 'black',
        });
        this.info.setInteractive({ useHandCursor: true });
        this.info.on('pointerdown', () => {
            this.info.setText('');
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
