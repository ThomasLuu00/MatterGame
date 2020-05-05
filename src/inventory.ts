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
        this.container = this.add.container(0,0);

        let item = new Item();

        let itemGrid = new ItemGrid(this,0,0);
        let uiBox = new UIBox(this, 0, 0, itemGrid.width, itemGrid.height);

        // Add title
        
        itemGrid.setPosition(uiBox.padding)
        this.container.add(uiBox);
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
    box: Phaser.GameObjects.Graphics;

    color: number = 0xffffff;
    alpha: number = 1;
    radius: number = 16;
    padding: number = 10;
    lineColor: number = 0x565656;
    lineWidth: number = 2;
    lineAlpha: number = 1;
    shadow: number = 0;
    shadowColor: number = 0x222222;
    shadowAlpha: number = 0.5;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, config? : UIBoxConfig){
        super(scene,x,y);

        if (config){
            if (config.color) this.color = config.color;
            if (config.alpha) this.alpha = config.alpha;
            if (config.radius) this.radius = config.radius;
            if (config.padding) this.padding = config.padding;
            if (config.lineColor) this.lineColor = config.lineColor;
            if (config.lineWidth) this.lineWidth = config.lineWidth;
            if (config.lineAlpha) this.lineAlpha = config.lineAlpha;
            if (config.shadow) this.shadow = config.shadow;
            if (config.shadowColor) this.shadowColor = config.shadowColor;
            if (config.shadowAlpha) this.shadowAlpha = config.shadowAlpha;
        }
        
        this.width = width + this.padding  * 2;
        this.height = height + this.padding  * 2;

        let bubble = scene.add.graphics({ x: 0, y: 0 });
        
        //  Bubble shadow
        if (this.shadow){
            bubble.fillStyle(this.shadowColor, this.shadowAlpha);
            bubble.fillRoundedRect(this.shadow, this.shadow, this.width, this.height, this.radius);
        }

        //  Bubble color
        bubble.fillStyle(this.color, this.alpha);

        //  Bubble outline line style
        bubble.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);

        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, this.width, this.height, this.radius);
        bubble.fillRoundedRect(0, 0, this.width, this.height, this.radius);
        this.add(bubble);
        this.box = bubble;
    }

    setOrigin(x: number, y?: number) : UIBox{ 
        if (!y) y = x;
        this.setPosition(this.x - this.width * x, this.y - this.height * y)
        return this;
    }
}

type UIBoxConfig = {
    color?: number,
    alpha?: number,
    radius?: number,
    padding?: number,
    lineColor?: number,
    lineWidth?: number,
    lineAlpha?: number,
    shadow?: number,
    shadowColor?: number,
    shadowAlpha?: number,
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
        
        let cellWidth = 70 // have to know this from the image used
        let item = new Item();
        this.width = (cellWidth + this.padding) * this.colCount;
        this.height = (cellWidth + this.padding) * this.rowCount;


        this.tooltip = new Tooltip(scene, x + this.width + 100 ,y, new Item());
        this.tooltip.setVisible(false);
        scene.add.existing(this.tooltip);

        for (let rc = 0; rc < this.rowCount; rc++){
            let cx = cellWidth/2;
            let cy = (cellWidth + this.padding) * rc + cellWidth/2;
            for (let cc = 0; cc < this.colCount; cc++){
                let cell = new UIBox(scene, cx - cellWidth/2, cy - cellWidth/2,  cellWidth - 20, cellWidth - 20, { padding: 10, shadow: 0} )
                let icon = scene.add.image(cell.width/2, cell.width /2, item.texture);
                if (icon.height < icon.width){
                    icon.setScale((cellWidth / icon.width) * 0.7);
                } else {
                    icon.setScale((cellWidth / icon.height) * 0.7);
                }

                cell.setInteractive();
                cell.on('pointerover', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                    this.tooltip.setVisible(true);
                }, this);
                cell.on('pointeroff', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                    this.tooltip.setVisible(false);
                }, this);

                cell.add(icon);
                this.add(cell);

                cx += cellWidth + this.padding;
            }
        }
    }
}