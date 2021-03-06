import Inventory from "../player/inventory";
import Player from "../player/player";
import ItemCell from "./item-cell";

export default class InventoryWindow extends Phaser.GameObjects.Container{
    numSlots: number;
    rows: number= 4;
    cols: number= 5;
    cells: {[index:number]:Phaser.GameObjects.Image}={};
    items: {[index:number]:Phaser.GameObjects.Image}={};
    player: Player;
    inventory: Inventory;
    
    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y);
        this.setVisible(true);
        this.setActive(true);
        this.player = player;
        this.inventory = player.inventory;
        this.numSlots = this.inventory.count;
        this.setVisible(this.player.UI.showInventory);
        this.setActive(this.player.UI.showInventory);

        this.setInteractive(new Phaser.Geom.Rectangle(-50, -50, 500, 400), Phaser.Geom.Rectangle.Contains);
        this.scene.input.setDraggable(this);
        this.scene.input.enableDebug(this);

        this.scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        const config = {
            width: 100,
            height: 100,
        }

        let count = 0;
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++){
                this.cells[count] = this.createIcon('tile', c * config.width, r * config.width, config.width);
                if (this.inventory[count].item) {
                    this.items[count] = this.createIcon(this.inventory[count].item.iconKey, c * config.width, r * config.width, config.width);
                }
                else {
                    this.cells[count] = null
                }

                const i = count;
                this.inventory[i] = new Proxy(this.inventory[i], {
                    set: (target, key, value, receiver)=>{
                        let result = Reflect.set(target, key, receiver);
                        if (key === 'item'){
                            this.items[i]?.destroy();
                            this.items[i] = (value) ? this.createIcon(value.iconKey, c * config.width, r * config.width, config.width) : null;
                        }
                        return result;
                    }
                });
                count++;
            }
        }

        this.player.UI = new Proxy(this.player.UI, {
            set: (target, key, value, receiver)=>{
                let result = Reflect.set(target, key, value, receiver);
  
                if (key === 'showInventory'){
                    this.setVisible(value);
                    this.setActive(value);
                }
                return result;
            }
        })
        this.scene.add.existing(this);
    }

    private createIcon(texture: string, x: number, y: number, width: number): Phaser.GameObjects.Image{
        let icon = this.scene.add.image(x, y, texture);
        icon.setScale(width/icon.width);
        this.add(icon);
        return icon;
    }
}


