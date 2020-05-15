import 'phaser';
import { Particle } from '../projectiles/particles';

const cellOffset = 100;
const cellCount = 6;

class Toolbar extends Phaser.GameObjects.Image {
    cellCount: number;
    selectedCellIndex: number;
    selectedCells: Phaser.GameObjects.Image[];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, null);
        this.setVisible(false);
        this.scene.add.existing(this);
        this.selectedCells = [];
        this.selectedCellIndex = 0;

        for (let i = 0; i < cellCount; i++) {
            this.scene.add.image(x - (cellCount / 2) * cellOffset + i * cellOffset, y, 'tile').setScale(4, 4);
            this.selectedCells[i] = new Phaser.GameObjects.Image(
                scene,
                x - (cellCount / 2) * cellOffset + i * cellOffset,
                y,
                'tile_selected',
            )
                .setVisible(false)
                .setScale(4, 4);
            this.scene.add.existing(this.selectedCells[i]);
        }

        // Setting the first slot as selected
        this.selectedCells[0].setVisible(true);

        // Weapon icons
        this.scene.add.image(x - (cellCount / 2) * cellOffset + 0 * cellOffset, y, 'item-kunai').setScale(0.5, 0.5);
        this.scene.add.image(x - (cellCount / 2) * cellOffset + 1 * cellOffset, y, Particle.Vortex).setScale(0.5, 0.5);

        this.scene.events.on('update', this.update, this);
    }

    selectCell(index: number) {
        this.selectedCells[this.selectedCellIndex].setVisible(false);
        this.selectedCells[index].setVisible(true);
        this.selectedCellIndex = index;
    }
}

const preloadToolbar = (scene: Phaser.Scene) => {
    scene.load.image('tile', '../assets/ui/tile_cell.png');
    scene.load.image('tile_selected', '../assets/ui/tile_select.png');
};

export { Toolbar, preloadToolbar };
