import Item from './item';

class Kunai extends Item {
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number) {
        super(world, x, y, 'item-kunai');
    }
}

const preloadKunai = (scene: Phaser.Scene) => {
    scene.load.image('item-kunai', '../assets/kunai.png');
};

export { preloadKunai, Kunai };
