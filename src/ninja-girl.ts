class NinjaGirl extends Character{
    constructor(world: Phaser.Physics.Matter.World, x: number, y: number){
        super(world, x, y, 'ninjagirl', '');
    }

    addAnimation(): void {
        
        // Need to reset the origin whenever the frame changes
        const animationCallBack = (anim : Phaser.Animations.Animation, frame : Phaser.Animations.AnimationFrame, gameObject : Phaser.Physics.Matter.Sprite)  => {
            let cx = gameObject.centerOfMass.x
            let cy = gameObject.centerOfMass.y
            this.setOrigin(cx - 0.05, cy + 0.31);
        };

        this.scene.anims.create({
			key: "dead",
			frames: this.scene.anims.generateFrameNames('dead',{
                start: 1, end: 15, zeroPad: 2, prefix: 'flatboy_dead_'
            }),
			repeat: 0,
			frameRate: 30
        });

        this.on('animationstart-dead', animationCallBack, this);
        this.on('animationupdate-dead', animationCallBack, this);
        this.on('animationcomplete-dead', () => {}, this);
    }
    
    update(): void {
        throw new Error("Method not implemented.");
    }
    onSensorCollide(event: any): void {
        throw new Error("Method not implemented.");
    }

}