export default class Player {
    destroyed: boolean;
    scene: Phaser.Scene;
    jumpCooldownTimer: Phaser.Time.TimerEvent;

    create() {
        // ... our existing create code would be here

        this.destroyed = false;
        this.scene.events.on('update', this.update, this);
        this.scene.events.once('shutdown', this.destroy, this);
        this.scene.events.once('destroy', this.destroy, this);
    }

    update() {
        if (this.destroyed) return;

        // ... our existing update code would be here
    }

    destroy() {
        /*
      this.destroyed = true;
  
      // Event listeners
      this.scene.events.off("update", this.update, this);
      this.scene.events.off("shutdown", this.destroy, this);
      this.scene.events.off("destroy", this.destroy, this);
      if (this.scene.matter.world) {
        this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
      }
  
      // Matter collision plugin
      const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
      this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
      this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });
  
      // Don't want any timers triggering post-mortem
      if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();
      this.sprite.destroy();
      */
    }
}
