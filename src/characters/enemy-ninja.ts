import NinjaGirl from './ninja-girl';

export default class EnemyNinja extends NinjaGirl {
    delay = 2000;
    movementFlag = true;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        setInterval(() => {
            this.movementFlag = !this.movementFlag;
        }, this.delay);
    }

    onUpdate() {
        super.onUpdate();
        if (this.movementFlag) {
            this.move(true);
        } else {
            this.move(false);
        }
    }
}
