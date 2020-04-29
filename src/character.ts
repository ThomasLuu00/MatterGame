export default abstract class Character extends Phaser.Physics.Matter.Sprite{
    sensors:{
        top: MatterJS.BodyType, 
        bottom: MatterJS.BodyType,
        left: MatterJS.BodyType,
        right: MatterJS.BodyType,
    };
    isTouching: { 
        top: boolean,
        left: boolean,
        right: boolean,
        ground: boolean,
    };
    canJump: boolean;
    jumpCooldownTimer: Phaser.Time.TimerEvent;
    canAttack: boolean;
    attackCooldownTimer: Phaser.Time.TimerEvent;
    currentAnimation: string;
    animations: Array<string>;
    name: string;

    constructor(world: Phaser.Physics.Matter.World, x: number, y: number, texture: string, frame?: string | number,  options?: Phaser.Types.Physics.Matter.MatterBodyConfig){
        super(world, x, y, texture, frame, options);
        
        // Track which sensors are touching something
        this.isTouching = { top: false, left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;
        this.canAttack = true;
        this.attackCooldownTimer = null;

        // Before matter's update, reset the player's count of what surfaces it is touching.
        this.on("beforeupdate", () => {
            this.isTouching.top = false;
            this.isTouching.left = false;
            this.isTouching.right = false;
            this.isTouching.ground = false;
        }, this);

        this.scene.events.on("update", this.update, this);
        this.world.on('collisionstart',this.onSensorCollide,this);
        this.world.on('collisionend',this.onSensorCollideEnd,this);
    }

    animate(texture: string){
        if (texture != this.currentAnimation){
            this.anims.play(texture);
            this.currentAnimation = texture;
        }
    };

    abstract addAnimation(): void;
    abstract update(): void;
    abstract onSensorCollide(event: any): void;
    abstract onSensorCollideEnd(event: any): void;
    
}