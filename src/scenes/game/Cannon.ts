import Enemy from "./Enemy";
import Game from "../Game";

export default class Cannon extends Phaser.Physics.Arcade.Sprite {
  parent: Game;
  cannonCooldownMax: number = 0.2;
  cannonCooldown: number = 1;
  enemies: Phaser.GameObjects.Group;
  ammo: Phaser.GameObjects.Group;
  head: Phaser.GameObjects.Sprite;
  sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager;
  puffEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager;
  maxRange: number = 200;

  constructor(
    scene: Game,
    x: number,
    y: number,
    enemies: Phaser.GameObjects.Group,
    ammo: Phaser.GameObjects.Group,
    sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager,
    puffEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager
  ) {
    super(scene, x, y, "cannontower");
    this.parent = scene;
    this.enemies = enemies;
    this.depth = 10;
    console.log("Created cannon");
    this.ammo = ammo;

    this.head = scene.add.sprite(x + 8, y + 4, "cannonhead");
    this.head.setDepth(11);
    this.head.setOrigin(0.5, 0.5);
    this.head.rotation = -3;
    this.setOrigin(0);
    this.setDepth(10);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.sparkEmitter = sparkEmitter;
    this.puffEmitter = puffEmitter;
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.head.x = this.x + 8;
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

      if (closestDistance < this.maxRange && closestEnemyPosition!) {
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
        this.puffEmitter.emitParticle(1, this.head.x, this.head.y);
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
        this.parent.playSound("blorp");
      }
    }
  }

  destroy() {
    this.sparkEmitter.emitParticle(100, this.x + 8, this.y + 8);
    this.head.destroy();
    super.destroy();
  }
}
