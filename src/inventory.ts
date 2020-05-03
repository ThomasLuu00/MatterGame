import 'phaser';

export default class Inventory extends Phaser.Scene{
    parent : any;
    container : any;

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;
    }

    preload(){
        this.load.image('blue_boxCheckmark', '../assets/menu/blue_boxCheckmark.png');
        this.load.image('panel-blue', '../assets/menu/blue_panel.png');
        this.load.image('sectiontab-grey', '../assets/menu/grey_sliderDown.png')
    }

    create ()
    {
        let itemBox = this.add.image(0, 0, 'panel-blue');
        let w = itemBox.width;
        let h = itemBox.height;
        
        let scale = 0.5
        let gw = 5
        let gh = 2

        let offsetx = 0
        let offsety = 0
        let title = this.add.container(0,0);
        let box = this.add.container(0,42);
        for (let x = 0; x < gw; x++){
            title.add(this.add.image(x * 28 + 14, 21, 'sectiontab-grey'));
        }
        itemBox.destroy();

        for (let x = 0; x < gw; x++){
            for (let y = 0; y < gw; y++){
                box.add(this.add.image(x * w, y * h, 'panel-blue').setOrigin(0));
            }
        }
        box.setScale(scale);
        this.container = this.add.container(0,0);
        this.container.add(title);
        this.container.add(box);

        this.container.setVisible(false);
        this.cameras.main.setViewport(this.parent.x, this.parent.y,300, 300);

        this.parent.scene.events.on('toggleInventory', () => {
            console.log('2')
            this.container.setVisible(!this.container.visible);
        }, this);
    }
    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }
}