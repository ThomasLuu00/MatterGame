import 'phaser';
import Box from './ui/box';

class Item {
    id = '0000';
    name = 'name';
    tags: Array<string> = ['melee', 'ranged', 'melee', 'tet sdfsdfsdf'];
    description = ' Sample description of the item';
    texture = 'item-kunai';
    iconTexture = 'item-kunai';
    stats: any = {
        attack: 0,
        defence: 10,
        atkspd: 1,
    };

    constructor(name = 'name') {
        this.name = name;
    }
}

class Tag {
    x: number;
    y: number;
    width: number;
    height: number;
    text: Phaser.GameObjects.Text;
    background: Box;
    scene: Phaser.Scene;
    children: Phaser.GameObjects.GameObject[];
    padding = 2;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, textStyle?: Record<string, any>) {
        this.scene = scene;
        //this.text = scene.add.text(x, y, text, textStyle);
        this.text = new Phaser.GameObjects.Text(scene, x + this.padding, y + this.padding, text, textStyle);
        this.background = new Box(scene, x, y, this.text.width, this.text.height, { padding: 2, radius: 5 });
        this.x = x;
        this.y = y;
        this.width = this.background.width;
        this.height = this.background.height;
        this.children = [this.background, this.text];
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.text.setPosition(x + this.padding, y + this.padding);
        this.background.setPosition(x, y);
    }

    setText(text: string) {
        this.text.setText(text);
        this.background.setSize(this.text.width, this.text.height);
    }

    destroy() {
        this.text.destroy();
        this.background.destroy();
        this.scene = null;
    }
}

class TagBox extends Phaser.GameObjects.Container {
    /**
     * This is a fixed width container that stores tags. The height adjusts according to the number of tags;
     */
    width: number;
    height: number;
    spacing = 5;
    tags: Array<Tag>;
    item: Item;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, item: Item = null) {
        super(scene, x, y);
        this.width = width;
        this.height = 0;
        this.item = item;
        this.tags = [];

        if (this.item != null) {
            this.setItem(this.item);
        }
    }

    setItem(item: Item) {
        let cx = 0;
        let cy = 0;

        if (this.item != null) while (this.tags.length > 0) this.tags.pop().destroy();
        this.item = item;
        for (const i in this.item.tags) {
            const tag = new Tag(this.scene, cx, cy, this.item.tags[i], { fontFamily: '12px Arial', color: '#000000' });
            this.tags.push(tag);
        }
        for (const i in this.tags) {
            if (cx > 0 && this.tags[i].width + cx >= this.width) {
                cy += this.tags[i].height + this.spacing;
                cx = 0;
            }
            this.tags[i].setPosition(cx, cy);
            cx += this.spacing + this.tags[i].width;
            this.add(this.tags[i].children);
        }
        this.height = cy > 0 ? cy + this.tags[0].height : 0;

        // To debug
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0x00ffff, 1);
        graphics.strokeRect(0, 0, this.width, this.height);
        this.add(graphics);
    }
}

class StatBox {
    x: number;
    y: number;
    width: number;
    height: number;
    scene: Phaser.Scene;
    item: Item;
    children: Phaser.GameObjects.GameObject[];

    spacing = 2;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, item: Item = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = 0;
        this.scene = scene;
        this.item = item;
        this.children = [];

        if (this.item) this.setItem(item);
    }

    setItem(item: Item) {
        this.item = item;
        while (this.children.length > 0) this.children.pop().destroy();

        let cy = this.y;
        for (const stat in this.item.stats) {
            const text = new Phaser.GameObjects.Text(this.scene, this.x, cy, stat + ': ' + this.item.stats[stat], {
                fontFamily: '24px Arial',
                color: '#000000',
            });
            this.children.push(text);
            cy += text.height + this.spacing;
        }

        this.height += cy - this.spacing;
    }
}

class Tooltip extends Phaser.GameObjects.Container {
    item: Item;
    background: Box;
    nameText: Phaser.GameObjects.Text;
    tags: Array<Tag>;
    tagBox: TagBox;
    statBox: StatBox;

    constructor(scene: Phaser.Scene, x: number, y: number, item?: Item) {
        super(scene, x, y);
        this.tags = [];
        this.width = 200;
        this.height = 200;

        // Set the background
        this.background = new Box(scene, 0, 0, this.width, this.height, {
            radius: 16,
            lineWidth: 5,
        });
        this.add(this.background);

        this.nameText = this.scene.add.text(this.background.radius, this.background.radius, 'NAME_PLACEHOLDER', {
            fontFamily: '24px Arial',
            color: '#000000',
        });
        this.add(this.nameText);

        this.tagBox = new TagBox(
            this.scene,
            this.width / 2,
            this.background.radius + this.nameText.height,
            this.width / 2 - this.background.radius,
        );
        this.add(this.tagBox);

        this.statBox = new StatBox(this.scene, this.background.radius, 100, this.width);
        this.add(this.statBox.children);

        if (item) this.setItem(item);
    }

    setItem(item: Item) {
        // Update name
        this.item = item;
        this.nameText.setText(item.name);
        this.tagBox.setItem(item);
        this.statBox.setItem(item);
        this.add(this.statBox.children);
    }

    destroy() {
        this.item = null;
        this.background.destroy();
        super.destroy();
    }
}

class ItemCell extends Phaser.GameObjects.Container {
    width: number;
    height: number;

    item: Item = null;
    icon: Phaser.GameObjects.Image = null;
    background: Box;
    tooltip: Tooltip = null;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, item: Item = null) {
        super(scene, x, y);
        this.width = width;
        this.height = height;

        // Set the background
        this.background = new Box(scene, 0, 0, width, height, {
            radius: width / 10,
            lineWidth: 5,
        });
        this.add(this.background);
        // Add the item icon
        this.setItem(item);

        // Set interactions
        this.setInteractive();
        this.input.hitArea.x += this.width / 2;
        this.input.hitArea.y += this.height / 2;
        this.on(
            'pointerover',
            (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                if (this.tooltip && this.item) {
                    this.tooltip.setItem(this.item);
                    this.tooltip.setVisible(true);
                }
            },
            this,
        );

        this.on(
            'pointerout',
            (pointer: Phaser.Input.Pointer, localX, localY, event) => {
                if (this.tooltip) {
                    this.tooltip.setVisible(false);
                }
            },
            this,
        );
    }

    swapItem(target: ItemCell) {
        const temp: Item = target.item;
        target.item = this.item;
        this.setItem(temp);
    }

    setItem(item?: Item) {
        if (item) {
            this.item = item;
            this.icon = this.scene.add.image(this.width / 2, this.height / 2, this.item.texture);
            this.icon.setScale(
                this.icon.height < this.icon.width
                    ? (this.width / this.icon.width) * 0.7
                    : (this.height / this.icon.height) * 0.7,
            );
            this.add(this.icon);
        } else {
            this.item = null;
        }
    }

    setTooltip(tooltip: Tooltip) {
        this.tooltip = tooltip;
        this.tooltip.setVisible(false);
    }
}

class ItemGrid extends Phaser.GameObjects.Container {
    width: number;
    height: number;
    cellWidth = 50;
    rowCount = 5;
    colCount = 4;
    padding = 5;
    tooltip: Tooltip;
    items: Array<Item> = [];
    cells: Array<ItemCell> = [];

    constructor(scene: Inventory, x: number, y: number, items: Array<Item> = []) {
        super(scene, x, y);

        this.width = (this.cellWidth + this.padding) * this.colCount - this.padding;
        this.height = (this.cellWidth + this.padding) * this.rowCount - this.padding;
        this.items = items;

        this.tooltip = new Tooltip(scene, x + this.width, y);

        let count = 0;
        for (let cy = 0; cy < this.height; cy += this.cellWidth + this.padding) {
            for (let cx = 0; cx < this.width; cx += this.cellWidth + this.padding) {
                const cell: ItemCell = new ItemCell(
                    scene,
                    cx,
                    cy,
                    this.cellWidth,
                    this.cellWidth,
                    count < this.items.length ? this.items[count] : null,
                );
                cell.setTooltip(this.tooltip);
                count += 1;

                //this.cells.push(cell);
                this.add(cell);
            }
        }

        this.add(this.tooltip);
    }
}

export default class Inventory extends Phaser.Scene {
    parent: any;
    container: Phaser.GameObjects.Container;
    items: any;
    selected: Item = null;
    hovered: Item = null;

    constructor(handle, parent) {
        super(handle);
        this.parent = parent;
    }

    preload() {
        //this.load.image('item-kunai', '../assets/kunai.png')
        this.load.image('blue_boxCheckmark', '../assets/menu/blue_boxCheckmark.png');
        this.load.image('panel-blue', '../assets/menu/blue_panel.png');
        this.load.image('sectiontab-grey', '../assets/menu/grey_sliderDown.png');
        this.load.image('dropdownbottom', '../assets/menu/dropdownBottom.png');
        this.load.image('dropdownmid', '../assets/menu/dropdownMid.png');
        this.load.image('dropdowntop', '../assets/menu/dropdownTop.png');
    }

    create() {
        this.container = this.add.container(0, 0);
        const padding = 10;

        const title = this.add.text(padding, padding, 'Inventory', { font: '24px Arial', fill: '#000000' });
        const itemGrid = new ItemGrid(this, padding, padding + title.height, [
            new Item('test1'),
            new Item('test12'),
            new Item('test13'),
            new Item('test14'),
        ]);

        const box = new Box(this, 0, 0, itemGrid.width, itemGrid.height + title.height, {
            radius: 16,
            padding: padding,
        });

        this.container.add(box);
        this.container.add(title);
        this.container.add(itemGrid);
        this.container.setVisible(false);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.parent.width, this.parent.height);

        this.parent.scene.events.on(
            'toggleInventory',
            () => {
                this.container.setVisible(!this.container.visible);
            },
            this,
        );
    }

    refresh() {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }
}
