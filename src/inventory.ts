import 'phaser';
import Box from './ui/box';

export default class Inventory extends Phaser.Scene{
    parent : any;
    container : any;
    items: any;
    
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
        let itemGrid = new ItemGrid(this, 0, 0, [new Item('test1'),new Item('test12'),new Item('test13'),new Item('test14'),]);
        let uiBox = new Box(this, 0, 0, itemGrid.width, itemGrid.height + 50,{
            radius: 16,
            padding: padding,
        });
        
        let title = this.add.text(padding, padding, 'Inventory', { font: '48px Arial', fill: '#000000' });
        
        itemGrid.setPosition(padding, padding + title.height)
        this.container.add(uiBox);
        this.container.add(title);
        this.container.add(itemGrid);
        this.container.setVisible(false);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.parent.width, this.parent.height);

        this.parent.scene.events.on('toggleInventory', () => {
            this.container.setVisible(!this.container.visible);
        }, this);
    }
    refresh ()
    {
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
    item: Item;

    constructor(scene: Phaser.Scene, x: number, y: number, item: Item){
        super(scene, x, y);

        let cx = 0;
        let cy = 0;

        const addRow = () => {
            let mid = scene.add.image(0, cy, 'dropdownmid').setOrigin(0);
            this.add(mid);
            cy += mid.height; 
        }

        let top = scene.add.image(cx, cy, 'dropdowntop').setOrigin(0);
        this.add(top);
        cy += top.height;

        addRow();
        addRow();
        addRow();

        let padding = top.height;
        let panel = scene.add.image(padding, padding, 'panel-blue').setOrigin(0).setScale(0.5);
        this.add(panel);
        
        let title = scene.add.text(padding + 100, padding, item.name, { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);
        this.add(title)
        
        let tagCount = 2;
        item.tags.forEach((tag)=>{
            addRow();
            let title = scene.add.text(padding + 100, padding * tagCount, tag, { font: '12px Arial', fill: '#000000' }).setOrigin(0.5);
            tagCount+=1;
            this.add(title);
        });

        for (let stat in item.stats){
            if (item.stats[stat]){
                addRow();
                let title = scene.add.text(padding, padding * tagCount, stat + ': ' + item.stats[stat], { font: '12px Arial', fill: '#000000' }).setOrigin(0);
                tagCount+=1;
                this.add(title);
            }
        }

        let bottom = scene.add.image(0, cy,'dropdownbottom').setOrigin(0);
        this.add(bottom);
    }
}


class ItemCell extends Phaser.GameObjects.Container{
    
    width: number;
    height: number;
    
    item: Item = null;
    icon: Phaser.GameObjects.Image = null;
    background: Box;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, item?: Item){
        super(scene, x, y)
        this.width = width;
        this.height = height;

        // Set the background
        this.background = new Box(scene, x, y, width, height);
        this.add(this.background);

        // Add the item icon
        this.setItem(item);
    }
    
    swapItem(target: ItemCell){
        let temp: Item = target.item;
        target.item = this.item;
        this.setItem(temp);
    }

    setItem(item?: Item){
        if (item) {
            this.item = item;
            this.icon = this.scene.add.image(this.x + this.width/2, this.y + this.height/2, this.item.texture);
            this.icon.setScale((this.icon.height < this.icon.width) ? (this.width / this.icon.width * 0.7) : (this.height / this.icon.height) * 0.7);
            this.add(this.icon);
        } else {
            this.item = null;
        }
    }
}

class ItemGrid extends Phaser.GameObjects.Container{
    width: number;
    height: number;
    rowCount: number = 5;
    colCount: number = 4;
    padding: number = 5;
    tooltip: Tooltip;
    items: Array<Item> = [];
    cells: Array<ItemCell> = [];

    constructor(scene: Phaser.Scene, x: number, y: number, items: Array<Item> = []){
        super(scene, x, y);
        
        const cellWidth = 50;
        this.width = (cellWidth + this.padding) * this.colCount - this.padding;
        this.height = (cellWidth + this.padding) * this.rowCount - this.padding;
        this.items = items;

        /*
        this.tooltip = new Tooltip(scene, x + this.width + 100 ,y, new Item());
        this.tooltip.setVisible(false);
        scene.add.existing(this.tooltip);
*/

        let count = 0;
        let cx = 0;
        let cy = 0;
        for (let rc = 0; rc < this.rowCount; rc++){
            for (let cc = 0; cc < this.colCount; cc++){
                let cell = new ItemCell(scene, cx, cy,  cellWidth, cellWidth)
                
                console.log(cx + ' ' + cy)
                /*
                cell.on('pointerover', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                    this.tooltip.setVisible(true);
                }, this);
                cell.on('pointerout', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                    this.tooltip.setVisible(false);
                }, this);
*/
                this.cells.push(cell);
                this.add(cell);

                cx += cellWidth ;
            }
            cx = 0;
            cy += cellWidth;
        }
    }
}