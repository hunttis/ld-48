export default class Worker extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "worker");

    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  create() {
    console.log("Create worker!");
  }

  update() {
    super.update();
  }
}
