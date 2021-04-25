export default class Shot extends Phaser.Physics.Arcade.Sprite {
  targetPoint: Phaser.Math.Vector2;
  lifeTime: number;
  lifeTimeMax: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    targetPoint: Phaser.Math.Vector2,
    lifeTime: number = 0.5
  ) {
    super(scene, x, y, "ammo");
    scene.physics.add.existing(this);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setAllowGravity(false);
    }
    this.setCollideWorldBounds(true);
    this.targetPoint = targetPoint;
    scene.physics.moveToObject(this, targetPoint, 400);
    this.lifeTime = lifeTime;
    this.lifeTimeMax = lifeTime;
  }

  create() {
    console.log("Create ammo!");
  }

  update(time: number, delta: number) {
    // console.log("Life", this.lifeTime);
    this.lifeTime -= delta / 1000;
    if (this.lifeTime <= 0) {
      this.destroy();
    }

    this.scaleX = this.lifeTime / this.lifeTimeMax;
    this.scaleY = this.lifeTime / this.lifeTimeMax;
  }
}
