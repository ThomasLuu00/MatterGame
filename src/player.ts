import "phaser";
import MultiKey from "./multi-key.js";
import { isOpened } from './ui';
import MyGame from "./game.js";

export default class Player {
    scene : MyGame;
    sprite : Phaser.Physics.Matter.Sprite;
    canJump : Boolean;
    jumpCooldownTimer: Phaser.Time.TimerEvent;
    leftInput: MultiKey;
    rightInput: MultiKey;
    jumpInput: MultiKey;
    attackInput: MultiKey;
    throwInput:  MultiKey;
    inventoryInput: MultiKey;
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
    const { LEFT, RIGHT, UP, A, D, W, F, G, I } = Phaser.Input.Keyboard.KeyCodes;
    this.leftInput = new MultiKey(scene, [LEFT, A]);
    this.rightInput = new MultiKey(scene, [RIGHT, D]);
    this.jumpInput = new MultiKey(scene, [UP, W]);
    this.attackInput = new MultiKey(scene, [F]);
    this.throwInput = new MultiKey(scene, [G]);
    this.inventoryInput = new MultiKey(scene, [I]);

    this.body.mass = 1;
    this.scene.events.on("update", this.update, this);
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if (this.destroyed) return;
  
    if(!this.scene.isTyping){
      const sprite : any = this.sprite;
      const velocity = sprite.body.velocity;
      const isRightKeyDown = this.rightInput.isDown();
      const isLeftKeyDown = this.leftInput.isDown();
      const isJumpKeyDown = this.jumpInput.isDown();
      const isAttackKeyDown = this.attackInput.isDown();
      const isThrowKeyDown = this.throwInput.isDown();
      const isOnGround = sprite.isTouching.ground;
      const isInAir = !isOnGround;

      // --- Move the player horizontally ---

      // Adjust the movement so that the player is slower in the air
      const moveForce = isOnGround ? 0.e01 : 0.005;

      if (isInAir) {
        
      }
      else if (isAttackKeyDown){
        sprite.animate(sprite.name + '-jump');
      }
      else if (isThrowKeyDown){
        sprite.animate(sprite.name + '-throw');
      }
      else if (isLeftKeyDown === isRightKeyDown) {
        sprite.setVelocityX(0);
        sprite.animate(sprite.name +'-idle');
      }
      else if (isLeftKeyDown) {
        sprite.animate(sprite.name + '-run');
        sprite.setFlipX(true);
        sprite.setVelocityX(-7)

      } else if (isRightKeyDown) {
        sprite.animate(sprite.name + '-run');
        sprite.setFlipX(false);
        sprite.setVelocityX(7)
      }

      if (velocity.x > 7) sprite.setVelocityX(7);
      else if (velocity.x < -7) sprite.setVelocityX(-7);

      
      if (isJumpKeyDown && sprite.canJump && isOnGround) {
        sprite.isOnGround = false;
        sprite.setVelocityY(-11);
        sprite.animate(sprite.name + '-jump');
      }
    }
  }

  destroy() {}
}
