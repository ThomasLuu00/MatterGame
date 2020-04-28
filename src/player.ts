import "phaser";
import MultiKey from "./multi-key.js";
import { FlatBoy } from "./flatboy.js";

export default class Player {
    scene : Phaser.Scene;
    sprite : Phaser.Physics.Matter.Sprite;
    canJump : Boolean;
    jumpCooldownTimer: Phaser.Time.TimerEvent;
    leftInput: MultiKey;
    rightInput: MultiKey;
    jumpInput: MultiKey;
    destroyed: Boolean;
    body: any;

  constructor(scene, sprite) {
    this.scene = scene;

    // Create the physics-based sprite that we will move around and animate
    this.sprite = sprite;
    this.body = this.sprite.body;

    // Jumping is going to have a cooldown
    this.canJump = true;
    this.jumpCooldownTimer = null;
    
    // Track the keys
    const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);


    this.body.mass = 1;
    this.scene.events.on("update", this.update, this);
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if (this.destroyed) return;

    const sprite : any = this.sprite;
    const velocity = sprite.body.velocity;
    const isRightKeyDown = this.rightInput.isDown();
    const isLeftKeyDown = this.leftInput.isDown();
    const isJumpKeyDown = this.jumpInput.isDown();
    const isOnGround = sprite.isTouching.ground;
    const isInAir = !isOnGround;

    // --- Move the player horizontally ---

    // Adjust the movement so that the player is slower in the air
    const moveForce = isOnGround ? 0.01 : 0.005;

    if (isLeftKeyDown === isRightKeyDown) {
      sprite.setVelocityX(0);
      //sprite.animate('idle');
    }
    else if (isLeftKeyDown) {
      //sprite.animate('dead');
      sprite.setFlipX(true);
      // Don't let the player push things left if they in the air
      if (!(isInAir && sprite.isTouching.left)) {
        sprite.setVelocityX(-7)
        //sprite.applyForce(new Phaser.Math.Vector2(-moveForce, 0))
      }
    } else if (isRightKeyDown) {
      //sprite.animate('dead');
      sprite.setFlipX(false);
      // Don't let the player push things right if they in the air
      if (!(isInAir && sprite.isTouching.right)) {
        sprite.setVelocityX(7)
        //sprite.applyForce(new Phaser.Math.Vector2(moveForce, 0))
      }
    }

    // Limit horizontal speed, without this the player's velocity would just keep increasing to
    // absurd speeds. We don't want to touch the vertical velocity though, so that we don't
    // interfere with gravity.
    if (velocity.x > 7) sprite.setVelocityX(7);
    else if (velocity.x < -7) sprite.setVelocityX(-7);

    // --- Move the player vertically ---
    //console.log(isOnGround)
    if (isJumpKeyDown && sprite.canJump && isOnGround) {
      console.log('in')
      //sprite.applyForce(new Phaser.Math.Vector2(moveForce * 1000, 0))
      sprite.setVelocityY(-11);

      // Add a slight delay between jumps since the bottom sensor will still collide for a few
      // frames after a jump is initiated
      this.canJump = false;
      this.jumpCooldownTimer = this.scene.time.addEvent({
        delay: 250,
        callback: () => (this.canJump = true)
      });
    }


    /*
    // Update the animation/texture based on the state of the player's state
    if (isOnGround) {
      if (this.body.force.x !== 0) sprite.anims.play("player-run", true);
      else sprite.anims.play("player-idle", true);
    } else {
      sprite.anims.stop();
      sprite.setTexture("player", 10);
    }
    */
  }

  destroy() {}
}
