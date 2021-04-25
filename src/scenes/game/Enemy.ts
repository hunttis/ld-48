import Game from "../Game";

enum EnemyState {
  Falling,
  Landed,
  Running,
  Jumping,
  Attacking,
  Grabbing,
  Partying,
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  parent: Game;
  hitPoints: number = 4;

  enemyState: EnemyState;
  stateCooldown: number;
  attackCooldown: number = 0;
  attackCooldownMax: number = 1;

  sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  bloodEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;

  grabbedTile: Phaser.Tilemaps.Tile | undefined;

  constructor(
    scene: Game,
    x: number,
    y: number,
    bloodEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager,
    sparkEmitter: Phaser.GameObjects.Particles.ParticleEmitterManager
  ) {
    super(scene, x, y, "enemy");
    this.parent = scene;
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.body.setSize(10, 16);
    this.enemyState = EnemyState.Falling;
    this.stateCooldown = 1;
    this.bloodEmitter = bloodEmitter;
    this.sparkEmitter = sparkEmitter;
  }

  create() {
    console.log("Create enemy!");
  }

  update(time: number, delta: number) {
    switch (this.enemyState) {
      case EnemyState.Falling: {
        // console.log("Enemy falling!");
        this.anims.play("enemyFalling", true);
        this.body.velocity.x = -1 * delta;
        if (this.body.blocked.down) {
          // if (Math.round(this.body.velocity.y) == 0) {
          this.enemyState = EnemyState.Landed;
          // console.log("Enemy fell to the ground!");
        }
        break;
      }
      case EnemyState.Landed: {
        this.anims.play("enemyLanded", true);
        this.enemyState = EnemyState.Running;
        this.body.velocity.x = 0.5 * delta;
        // console.log("Enemy starting to run!");
        break;
      }
      case EnemyState.Running: {
        // console.log("Running!");
        this.anims.play("enemyRunning", true);
        if (this.attackCooldown > 0) {
          this.attackCooldown -= delta / 1000;
        } else {
          this.anims.play("enemyAttacking", true);

          // console.log("Enemy attacking!");
          this.enemyState = EnemyState.Jumping;
        }
        break;
      }
      case EnemyState.Jumping: {
        this.scene.physics.moveTo(
          this,
          this.x + 100,
          this.y - (Math.random() * 100 + 50),
          200
        );
        this.enemyState = EnemyState.Attacking;
        this.attackCooldown = this.attackCooldownMax;
        break;
      }
      case EnemyState.Attacking: {
        break;
      }
      case EnemyState.Grabbing: {
        this.body.stop();
        this.sparkEmitter.emitParticle(10, this.x + 8, this.y);
        this.enemyState = EnemyState.Falling;
      }
      case EnemyState.Partying: {
        this.body.velocity.x = this.body.velocity.x / 1.2;
        if (this.body.blocked.down) {
          this.body.velocity.y = Math.random() * -50;
        }
      }
    }

    if (this.hitPoints <= 0) {
      this.destroy();
    }
  }

  grab(tile: Phaser.Tilemaps.Tile) {
    // console.log("grab!");
    this.enemyState = EnemyState.Grabbing;
    if (tile instanceof Phaser.Tilemaps.Tile) {
      this.grabbedTile = tile;
    }
  }

  getHitpoints() {
    return this.hitPoints;
  }

  getHit(damage: number) {
    this.hitPoints -= damage;
    this.bloodEmitter.emitParticle(10, this.x, this.y);
  }

  destroy() {
    this.bloodEmitter.emitParticle(10, this.x, this.y);
    super.destroy();
  }

  destroyInWheels() {
    this.bloodEmitter.emitParticle(100, this.x, this.y);
    this.parent.playSound("crunch");
    super.destroy();
  }

  isAttacking() {
    return this.enemyState === EnemyState.Attacking;
  }

  getGrabbedTile() {
    return this.grabbedTile;
  }

  clearGrabbedTile() {
    this.grabbedTile = undefined;
  }

  startPartying() {
    const randomFramerate = 1 + Math.round(Math.random() * 10);
    this.anims.play(
      { key: "enemyPartying", frameRate: randomFramerate, repeat: -1 },
      true
    );

    this.enemyState = EnemyState.Partying;
  }
}
