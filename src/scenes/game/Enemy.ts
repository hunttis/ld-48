enum EnemyState {
  Falling,
  Landed,
  Running,
  Jumping,
  Attacking,
  Grabbing,
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  hitPoints: number = 4;

  enemyState: EnemyState;
  stateCooldown: number;
  attackCooldown: number = 5;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "enemy");

    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.enemyState = EnemyState.Falling;
    this.stateCooldown = 1;
  }

  create() {
    console.log("Create enemy!");
  }

  update(time: number, delta: number) {
    switch (this.enemyState) {
      case EnemyState.Falling: {
        // console.log("Enemy falling!");
        this.body.velocity.x = -1 * delta;
        if (this.body.blocked.down) {
          // if (Math.round(this.body.velocity.y) == 0) {
          this.enemyState = EnemyState.Landed;
          console.log("Enemy fell to the ground!");
        }
        break;
      }
      case EnemyState.Landed: {
        this.enemyState = EnemyState.Running;
        this.body.velocity.x = 0.5 * delta;
        console.log("Enemy starting to run!");
        break;
      }
      case EnemyState.Running: {
        // console.log("Running!");
        if (this.attackCooldown > 0) {
          this.attackCooldown -= delta / 1000;
        } else {
          console.log("Enemy attacking!");
          this.enemyState = EnemyState.Jumping;
        }
        break;
      }
      case EnemyState.Jumping: {
        this.scene.physics.moveTo(this, this.x + 100, this.y - 100, 300);
        this.enemyState = EnemyState.Attacking;
        break;
      }
      case EnemyState.Attacking: {
        break;
      }
      case EnemyState.Grabbing: {
        this.body.stop();
      }
    }

    if (this.hitPoints <= 0) {
      this.destroy();
    }
  }

  grab() {
    // console.log("grab!");
    this.enemyState = EnemyState.Grabbing;
  }

  getHitpoints() {
    return this.hitPoints;
  }

  getHit(damage: number) {
    this.hitPoints -= damage;
  }
}
