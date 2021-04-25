import Enemy from "./Enemy";

export default class Cannon extends Phaser.Physics.Arcade.Sprite {
  cannonCooldownMax: number = 0.2;
  cannonCooldown: number = 1;
  enemies: Phaser.GameObjects.Group;
  ammo: Phaser.GameObjects.Group;
  head: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemies: Phaser.GameObjects.Group,
    ammo: Phaser.GameObjects.Group
  ) {
    super(scene, x, y, "cannontower");
    this.enemies = enemies;
    this.depth = 10;
    console.log("Created cannon");
    this.ammo = ammo;

    this.head = scene.add.sprite(x + 4, y + 4, "cannonhead");
    this.head.setDepth(11);
    this.head.setOrigin(0.2, 0.5);
    this.head.rotation = -3;
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.head.x = this.x + 4;
    this.head.y = this.y + 4;

    this.cannonCooldown -= delta / 1000;

    if (this.cannonCooldown < 0) {
      let closestEnemyPosition: Phaser.Math.Vector2;
      let closestDistance = 100000;
      let lowerHitpointsEnemyPosition: Phaser.Math.Vector2;
      let lowestHitpoints = 10000;
      this.enemies.children.entries.forEach((enemy) => {
        if (enemy instanceof Enemy) {
          const distance = Phaser.Math.Distance.BetweenPoints(
            enemy.body.position,
            this.body.position
          );

          if (lowestHitpoints > enemy.getHitpoints()) {
            lowerHitpointsEnemyPosition = new Phaser.Math.Vector2(
              enemy.body.position.x,
              enemy.body.position.y
            );
            lowestHitpoints = enemy.getHitpoints();
          }
          if (
            closestDistance > distance &&
            enemy.getHitpoints() <= lowestHitpoints
          ) {
            closestDistance = distance;
            closestEnemyPosition = new Phaser.Math.Vector2(
              enemy.body.position.x,
              enemy.body.position.y
            );
          }
        }
      });

      if (closestEnemyPosition!) {
        this.head.rotation = Phaser.Math.Angle.BetweenPoints(
          this.head,
          closestEnemyPosition
        );
        this.cannonCooldown = this.cannonCooldownMax;
        const shot = this.scene.physics.add.sprite(
          this.head.x,
          this.head.y,
          "ammo"
        );
        shot.body.setAllowGravity(false);
        this.scene.physics.moveTo(
          shot,
          closestEnemyPosition.x + 8,
          closestEnemyPosition.y + 8,
          400
        );
        shot.setCollideWorldBounds(false);
        shot.body.setCircle(2);
        this.ammo.add(shot);
      }
    }
  }
}
