import { ItemType } from "../item/item";

export default class ItemCell extends Phaser.GameObjects.Container {
    item: ItemType = null;
    icon: Phaser.GameObjects.Image = null;
    background: Phaser.GameObjects.Image = null;

    constructor(scene: Phaser.Scene, x: number, y: number, item: ItemType = null, config?: ItemCellConfig) {
        super(scene, x, y);

        let width = config?.width || 100;
        let height = config?.height || 100;

        this.setSize(width, height)

        this.background = this.scene.add.image(0,0, 'tile');
        this.background.setScale(width/this.background.width, height/this.background.height)
        this.add(this.background);
    
        if (item){
            this.item = item;
            this.icon = this.scene.add.image(0,0, this.item.iconKey);
            this.add(this.icon);
        };
    }

    popItem(): ItemType{
        let temp: ItemType = this.item;
        this.item = null;
        return temp;
    }
}

interface ItemCellConfig{
    width?: number;
    height?: number;
}