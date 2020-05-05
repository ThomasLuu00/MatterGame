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

        for (let x = 0; x < gw; x++){
            title.add(this.add.image(x * 28 + 14 , 21, 'sectiontab-grey'));
        }
        itemBox.destroy();
        let item = new Item();

        this.tooltip = new ItemToolTip(this, 0,0)
        
        for (let y = 0; y < gh; y++){
            for (let x = 0; x < gw; x++){
                let cx = x * w + padding * x + w/2;
                let cy = y * h + padding * y + w/2;
        
                let square = this.add.image(cx, cy, 'panel-blue').setOrigin(0.5);
                
                let text = this.add.image(cx,cy,item.texture);
                if (text.height < text.width){
                    text.setScale((w / text.width) * 0.7);
                } else {
                    text.setScale((h / text.height) * 0.7);
                }
                count += 1;

                square.on('pointerover', (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                    this.tooltip.tooltip.setPosition(square.x, square.y);
                    this.tooltip.tooltip.setDepth(1000);
                }, this);

                square.setInteractive();
                box.add(square);
                box.add(text);
            }
        }

        box.setScale(scale);
        this.container = this.add.container(0,0);
        this.container.add(title);
        this.container.add(box);

        this.container.setVisible(false);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 300, 300);

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
}

class ItemToolTip {
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