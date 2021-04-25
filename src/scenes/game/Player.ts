import Game from "../Game";
import Shot from "./Shot";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  parent: Game;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  fireKey: Phaser.Input.Keyboard.Key;
  fixKey: Phaser.Input.Keyboard.Key;

  fixDuration: number = 1.5;
  fixTimeRequired: number = 1.5;
  currentlyFixing: Phaser.Math.Vector2 | undefined;

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
    this.setDepth(12);
    this.fireKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.fixKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
  }

  update(time: number, delta: number) {
    if (!this.body) {
      return;
    }
    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.body.velocity.y = -180;
    } else if (this.cursors.down.isDown) {
    }

    if (this.fixKey.isDown && this.body.blocked.down) {
      this.body.velocity.x = 0;
      this.fixNearby(delta);
      this.anims.play("playerWork", true);
    } else if (this.cursors.left.isDown) {
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
        this.anims.play("playerIdle");
      }
    }

    if (!this.fixKey.isDown) {
      this.currentlyFixing = undefined;
      this.parent.fixCursor.visible = false;
    }
    if (!this.currentlyFixing) {
      this.fixDuration = this.fixTimeRequired;
    }

    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      console.log("FIRE");
      this.parent.puffEmitter.emitParticle(
        1,
        this.x + (this.flipX ? -8 : 8),
        this.y
      );
      this.anims.play("playerWalk", true);
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

      shot.body.setCircle(2);
      this.parent.ammo.add(shot, true);
      this.parent.playSound("zap");
    }
  }

  destroy() {
    this.parent.bloodEmitter.emitParticle(10, this.x, this.y);
    super.destroy();
  }

  fixNearby(delta: number) {
    const playerLocation = new Phaser.Math.Vector2(
      Math.floor(this.x / 16),
      Math.floor(this.y / 16)
    );

    const distanceBetweenPlayerAndComputer = Phaser.Math.Distance.Between(
      Math.floor(this.parent.computer.x / 16),
      Math.floor(this.parent.computer.y / 16),
      playerLocation.x,
      playerLocation.y
    );

    if (distanceBetweenPlayerAndComputer < 2) {
      this.parent.fixCursor.visible = true;
      this.parent.fixCursor.setX(this.parent.computer.x * 16 + 8);
      this.parent.fixCursor.setY(this.parent.computer.y * 16 + 8);

      if (this.parent.processableRock > 0) {
        if (this.parent.processableRock < 0.05) {
          this.parent.processedRock += this.parent.processableRock;
          this.parent.processableRock = 0;
        } else {
          this.parent.processableRock -= 0.05;
          this.parent.processedRock += 0.05;
        }
        this.parent.playSound("process");
      }
    } else if (this.currentlyFixing) {
      this.fixDuration -= delta / 1000;
      // console.log("fixing...", this.fixDuration);
      this.parent.fixCursor.visible = true;
      this.parent.fixCursor.setX(this.currentlyFixing.x * 16 + 8);
      this.parent.fixCursor.setY(this.currentlyFixing.y * 16 + 8);
      this.parent.puffEmitter.emitParticle(
        1,
        this.currentlyFixing.x * 16 + 8 + (Math.random() * 8 - 4),
        this.currentlyFixing.y * 16 + 8 + (Math.random() * 8 - 4)
      );

      if (this.fixDuration <= 0) {
        this.parent.wallsLayer.putTileAt(
          34,
          this.currentlyFixing.x,
          this.currentlyFixing.y
        );
        this.parent.destroyedTiles = this.parent.destroyedTiles.filter(
          (tile) => !tile.equals(this.currentlyFixing!)
        );
        this.parent.crawlerLifebar.addLife(10);
        this.currentlyFixing = undefined;
        this.parent.playSound("place");
      } else {
        this.parent.playSound("fix");
      }
    } else {
      const fixableTile = this.parent.destroyedTiles.find((tile) => {
        // console.log(
        //   "distance is:",
        //   Phaser.Math.Distance.BetweenPoints(playerLocation, tile),
        //   playerLocation,
        //   tile
        // );
        if (Phaser.Math.Distance.BetweenPoints(playerLocation, tile) <= 2.2) {
          return tile;
        }
      });
      if (fixableTile) {
        this.fixDuration = this.fixTimeRequired;
        this.currentlyFixing = fixableTile;
      }
    }
  }
}
