import Inventory from "../player/inventory";
import Player from "../player/player";
import ItemCell from "./item-cell";

export default class InventoryWindow extends Phaser.GameObjects.Container{
    player: Player;
    slots: number;
    rows: number= 4;
    cols: number= 5;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y);
        this.setVisible(true);
        this.setActive(true);
        this.player = player;

        const config = {
            width: 150,
            height: 150,
        }

        let count = 0;
        console.log(this.player.inventory[count].item)
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++){
                this.add(new ItemCell(this.scene, c * config.height, r * config.width, this.player.inventory[count].item, config))
                count++;
            }
        }

        this.scene.add.existing(this);
    }

    toggle(){
        this.setVisible(!this.visible);
        this.setActive(!this.setActive);
        return this;
    }
}
