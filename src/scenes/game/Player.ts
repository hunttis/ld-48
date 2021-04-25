import Game from "../Game";
import Shot from "./Shot";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  parent: Game;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  fireKey: Phaser.Input.Keyboard.Key;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "worker");
    this.parent = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.anims.play("playerIdle");
    this.setGravityY(200);
    this.body.setSize(8, 16);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.setOrigin(0.5, 0.5);

    this.fireKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update(time: number, delta: number) {
    if (!this.body) {
      return;
    }
    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.body.velocity.y = -180;
    } else if (this.cursors.down.isDown) {
    }

    if (this.cursors.left.isDown) {
      this.body.velocity.x = -100;
      this.anims.play("playerWalk", true);
      this.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = 100;
      this.anims.play("playerWalk", true);
      this.flipX = false;
    } else {
      this.body.velocity.x = this.body.velocity.x / 1.3;
      if (this.body.velocity.x < 0.5 && this.body.velocity.x > -0.5) {
        this.body.velocity.x = 0;
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      console.log("FIRE");
      this.parent.puffEmitter.emitParticle(
        1,
        this.x + (this.flipX ? -8 : 8),
        this.y
      );
      this.fireSpread();
    }
  }

  fireSpread() {
    for (let i = 0; i < 3; i++) {
      const shot = new Shot(
        this.scene,
        this.x,
        this.y,
        new Phaser.Math.Vector2(
          this.x + (this.flipX ? -8 : 8),
          this.y - 1 + i * 1
        ),
        0.25
      );

      // const shot = this.scene.physics.add.sprite(this.x, this.y, "ammo");
      // shot.body.setAllowGravity(false);
      // this.scene.physics.moveTo(shot, 400);

      // this.parent.tweens.add({
      //   targets: shot,
      //   duration: 200,

      //   onComplete: () => {
      //     console.log(arguments);
      //     this.();
      //   },
      // });
      // shot.setCollideWorldBounds(false);
      shot.body.setCircle(2);
      this.parent.ammo.add(shot, true);
    }
  }

  destroy() {
    this.parent.bloodEmitter.emitParticle(10, this.x, this.y);
    super.destroy();
  }
}
