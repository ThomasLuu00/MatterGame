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
        
        const config = {
            width: 100,
            height: 100,
        }

        let count = 0;
        //console.log(this.player.inventory[count].item)
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++){
                this.cells[count] = this.createIcon('tile', c * config.width, r * config.width, config.width);
                this.items[count] = (this.inventory[count].item) ? this.createIcon(this.inventory[count].item.iconKey, c * config.width, r * config.width, config.width) : null;
                
                this.inventory[count] = new Proxy(this.inventory[count], {
                    set: (target, key, value, receiver)=>{
                        let result = Reflect.set(target, key, receiver);
                        this.items[count]?.destroy();
                        this.items[count] = (value) ? this.createIcon(value.iconKey, c * config.width, r * config.width, config.width) : null;
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

    update(){

    }

    private createIcon(texture: string, x: number, y: number, width: number){
        let icon = this.scene.add.image(x, y, texture);
        icon.setScale(width/icon.width);
        this.add(icon);
        return icon;
    }
}


