export default class Shot extends Phaser.Physics.Arcade.Sprite {
  targetPoint: Phaser.Math.Vector2;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    targetPoint: Phaser.Math.Vector2
  ) {
    super(scene, x, y, "ammo");

    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.targetPoint = targetPoint;
    scene.physics.moveToObject(this, targetPoint, 200);
  }

  create() {
    console.log("Create ammo!");
  }

  update() {
    super.update();
  }
}
