import 'phaser';

export default class Inventory extends Phaser.Scene{
    parent : any;
    container : any;
    items: any;
    tooltip: ItemToolTip;
    
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
        let itemBox = this.add.image(0, 0, 'panel-blue');
        let w = itemBox.width;
        let h = itemBox.height;
        
        let scale = 0.5
        let gw = 4
        let gh = 5

        let offsetx = 0
        let offsety = 0
        let padding = 5
        let title = this.add.container(0,0);
        let box = this.add.container(0,42);
        let count = 0;
        let items = [0,1,2,3]

        this.container = this.add.container(0,0);

        for (let x = 0; x < gw; x++){
            title.add(this.add.image(x * 28 + 14 , 21, 'sectiontab-grey'));
        }
        itemBox.destroy();
        
        let item = new Item();

        //this.tooltip = new ItemToolTip(this, 0,0);
        //this.tooltip.tooltip.setVisible(false);

        let itemGrid = new ItemGrid(this,0,0);
        let uiBox = new UIBox(this, 0, 0, itemGrid.width, itemGrid.height);
        itemGrid.setPosition(uiBox.padding)
        this.container.add(uiBox);
        this.container.add(itemGrid);
        this.container.setVisible(false);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 500, 1000);

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

class ItemToolTip{
    item: Item;
    tooltip: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number, item: Item = new Item()) {
        this.item = item;

        this.tooltip = scene.add.container(x,y);
        let count = 10;
        let topCount = 0;
        let top = scene.add.image(0, topCount, 'dropdowntop').setOrigin(0);
        this.tooltip.add(top);
        topCount += top.height;
        const addRow = () => {
            let mid = scene.add.image(0, topCount, 'dropdownmid').setOrigin(0);
            this.tooltip.add(mid);
            topCount += mid.height; 
        }

  
        addRow();
        addRow();
        addRow();
        let padding = top.height;
        let panel = scene.add.image(padding, padding, 'panel-blue').setOrigin(0).setScale(0.5);
        this.tooltip.add(panel);
        
        let title = scene.add.text(padding + 100, padding, item.name, { font: '24px Arial', fill: '#000000' }).setOrigin(0.5);
        this.tooltip.add(title)
        
        let tagCount = 2;
        item.tags.forEach((tag)=>{
            addRow();
            let title = scene.add.text(padding + 100, padding * tagCount, tag, { font: '12px Arial', fill: '#000000' }).setOrigin(0.5);
            tagCount+=1;
            this.tooltip.add(title);
        });

        for (let stat in item.stats){
            if (item.stats[stat]){
                addRow();
                let title = scene.add.text(padding, padding * tagCount, stat + ': ' + item.stats[stat], { font: '12px Arial', fill: '#000000' }).setOrigin(0);
                tagCount+=1;
                this.tooltip.add(title);
            }
        }

        let bottom = scene.add.image(0, topCount,'dropdownbottom').setOrigin(0);
        this.tooltip.add(bottom);
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


class UIBox extends Phaser.GameObjects.Container{
    
    width: number;
    height: number;
    padding: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, padding: number = 10, color: number = 0x222222){
        super(scene,x,y);

        this.width = width;
        this.height = height;
        this.padding = padding; 
    
        var bubble = scene.add.graphics({ x: 0, y: 0 });

        //  Bubble shadow
        bubble.fillStyle(color, 0.5);
        bubble.fillRoundedRect(6, 6, this.width  + this.padding * 2, this.height + this.padding * 2, 16);

        //  Bubble color
        bubble.fillStyle(0xffffff, 1);

        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, this.width  + this.padding * 2, this.height + this.padding * 2, 16);
        bubble.fillRoundedRect(0, 0, this.width  + this.padding * 2, this.height + this.padding * 2, 16);
        this.add(bubble);
    }
}

class ItemGrid extends Phaser.GameObjects.Container{
    width: number;
    height: number;
    rowCount: number = 5;
    colCount: number = 4;
    padding: number = 5;
    tooltip: Tooltip;

    constructor(scene: Phaser.Scene, x: number, y: number, items?: Array<Item>){
        super(scene, x, y)
        
        let cellWidth = 100 // have to know this from the image used
        let item = new Item();
        this.tooltip = new Tooltip(scene, 0,0, new Item());
        this.width = (cellWidth + this.padding) * this.colCount;
        this.height = (cellWidth + this.padding) * this.rowCount;

        scene.add.existing(this.tooltip);

        for (let rc = 0; rc < this.rowCount; rc++){
            let cx = cellWidth/2;
            let cy = (cellWidth + this.padding) * rc + cellWidth/2;
            for (let cc = 0; cc < this.colCount; cc++){
                let cell = scene.add.image(cx, cy, 'panel-blue').setOrigin(0.5);
                
                let icon = scene.add.image(cx, cy, item.texture);
                if (icon.height < icon.width){
                    icon.setScale((cellWidth / icon.width) * 0.7);
                } else {
                    icon.setScale((cellWidth / icon.height) * 0.7);
                }

                cell.setInteractive();
                cell.on('pointerover', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                    console.log('hovering')
                    this.tooltip.setPosition(icon.x, icon.y);
                    this.tooltip.setDepth(1000);
                }, this);

                this.add(cell);
                this.add(icon);

                cx += cellWidth + this.padding;
            }
        }
    }
}