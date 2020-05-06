import 'phaser';
import Box from './ui/box';

export default class Inventory extends Phaser.Scene{
    parent : any;
    container : Phaser.GameObjects.Container;
    items: any;
    selected: Item = null;
    hovered: Item = null;

    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }

    preload(){
        //this.load.image('item-kunai', '../assets/kunai.png')
        this.load.image('blue_boxCheckmark', '../assets/menu/blue_boxCheckmark.png');
        this.load.image('panel-blue', '../assets/menu/blue_panel.png');
        this.load.image('sectiontab-grey', '../assets/menu/grey_sliderDown.png')
        this.load.image('dropdownbottom', '../assets/menu/dropdownBottom.png')
        this.load.image('dropdownmid', '../assets/menu/dropdownMid.png')
        this.load.image('dropdowntop', '../assets/menu/dropdownTop.png')
    }

    create ()
    {
        this.container = this.add.container(0,0);

        let padding = 10;

        let title = this.add.text(padding, padding, 'Inventory', { font: '24px Arial', fill: '#000000' });
        let itemGrid = new ItemGrid(this, padding, padding + title.height, [new Item('test1'),new Item('test12'),new Item('test13'),new Item('test14'),]);

        let box = new Box(this, 0, 0, itemGrid.width, itemGrid.height + title.height,{
            radius: 16,
            padding: padding,
        });
        
        this.container.add(box);
        this.container.add(title);
        this.container.add(itemGrid);
        this.container.setVisible(false);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.parent.width, this.parent.height);

        this.parent.scene.events.on('toggleInventory', () => {
            this.container.setVisible(!this.container.visible);
        }, this);


    }

    refresh(){
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }
}

class Item {
    id: string = '0000';
    name: string = 'name';
    tags: Array<string> = ['type1', 'type2'];
    description: string = ' Sample description of the item';
    texture: string = 'item-kunai';
    iconTexture: string = 'item-kunai';
    stats: any ={
        'attack': 0,
        'defence': 10,
        'atkspd': 1,
    };

    constructor(name = 'name'){
        this.name = name;
    }
}

class Tooltip extends Phaser.GameObjects.Container{
    width: number;

    item: Item;
    background: Box;
    nameText: Phaser.GameObjects.Text;
    statText: Array<Phaser.GameObjects.Text>;
    
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y);

        // Set the background
        this.background = new Box(scene, 0, 0, 200, 200,{
            radius: 16,
            lineWidth: 5,

        });
        this.add(this.background);

        this.nameText = scene.add.text(200, 50, 'name', { font: '12px Arial', fill: '#000000' })
        this.add(this.nameText);
    }
    
    setItem(item: Item){
        this.item = item;
        this.nameText.setText(item.name);
    }
    
    destroy(){
        this.item = null;
        this.background.destroy();
        super.destroy();
    }
}


class ItemCell extends Phaser.GameObjects.Container{
    
    width: number;
    height: number;
    
    item: Item = null;
    icon: Phaser.GameObjects.Image = null;
    background: Box;
    tooltip: Tooltip = null;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, item: Item = null){
        super(scene, x, y)
        this.width = width;
        this.height = height;

        // Set the background
        this.background = new Box(scene, 0, 0, width, height,{
            radius: width/10,
            lineWidth: 5
        });
        this.add(this.background);
        // Add the item icon
        this.setItem(item);

        // Set interactions 
        this.setInteractive();
        this.input.hitArea.x += this.width / 2;
        this.input.hitArea.y += this.height / 2;
        this.on('pointerover', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
            if (this.tooltip && this.item){
                this.tooltip.setItem(this.item);
                this.tooltip.setPosition(pointer.x, pointer.y);
                this.tooltip.setVisible(true);
            }
        }, this);

        this.on('pointerout', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
            if (this.tooltip){
                this.tooltip.setVisible(false);
            }
        }, this);
    }
    
    swapItem(target: ItemCell){
        let temp: Item = target.item;
        target.item = this.item;
        this.setItem(temp);
    }

    setItem(item?: Item){
        if (item) {
            this.item = item;
            this.icon = this.scene.add.image(this.width/2, this.height/2, this.item.texture);
            this.icon.setScale((this.icon.height < this.icon.width) ? (this.width / this.icon.width * 0.7) : (this.height / this.icon.height) * 0.7);
            this.add(this.icon);
        } else {
            this.item = null;
        }
    }

    setTooltip(tooltip: Tooltip){
        this.tooltip = tooltip;
        this.tooltip.setVisible(false);
    }
}

class ItemGrid extends Phaser.GameObjects.Container{
    width: number;
    height: number;
    cellWidth: number = 50;
    rowCount: number = 5;
    colCount: number = 4;
    padding: number = 5;
    tooltip: Tooltip;
    items: Array<Item> = [];
    cells: Array<ItemCell> = [];

    constructor(scene: Inventory, x: number, y: number, items: Array<Item> = []){
        super(scene, x, y);
        
        this.width = (this.cellWidth + this.padding) * this.colCount - this.padding;
        this.height = (this.cellWidth + this.padding) * this.rowCount - this.padding;
        this.items = items;

        this.tooltip = new Tooltip(scene, 500, 500);

        let count = 0;
        for (let cy = 0; cy < this.height; cy+= this.cellWidth + this.padding){
            for (let cx = 0; cx < this.width; cx+=this.cellWidth + this.padding){

                let cell : ItemCell = new ItemCell(scene, cx, cy,  this.cellWidth, this.cellWidth, (count < this.items.length) ? this.items[count] : null);
                cell.setTooltip(this.tooltip);
                count += 1;

                //this.cells.push(cell);
                this.add(cell);
            }
        }

        this.add(this.tooltip);

    }
}