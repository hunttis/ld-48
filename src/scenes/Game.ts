import Phaser from "phaser";
import Enemy from "./game/Enemy";
import Cannon from "./game/Cannon";
import Shot from "./game/Shot";
import {
  createDrill,
  createWheels,
  createDustEmitter,
  createCrumbleEmitter,
} from "./game/Decoration";

export default class Game extends Phaser.Scene {
  controls!: Phaser.Cameras.Controls.FixedKeyControl;

  dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  crumbleEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;

  map!: Phaser.Tilemaps.Tilemap;
  wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  groundLayer!: Phaser.Tilemaps.TilemapLayer;
  objectLayer!: Phaser.Tilemaps.ObjectLayer;

  initialCameraFocus!: Phaser.Math.Vector2;
  tileCursor!: Phaser.GameObjects.Sprite;

  drills!: Phaser.GameObjects.Group;
  wheels!: Phaser.GameObjects.Group;
  enemies!: Phaser.GameObjects.Group;
  cannons!: Phaser.GameObjects.Group;
  workers!: Phaser.GameObjects.Group;
  ammo!: Phaser.GameObjects.Group;
  boulders!: Phaser.GameObjects.Group;

  cavebg!: Phaser.GameObjects.TileSprite;
  caveground!: Phaser.GameObjects.TileSprite;
  caveceiling!: Phaser.GameObjects.TileSprite;

  enemySpawnRate: number = 2;
  enemyCooldown: number = 1;
  cannonCooldown: number = 0;
  boulderSpawnRate: number = 0.2;
  boulderCooldown: number = 0;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("tiles", "assets/tiles.png");
    this.load.image("bgtiles", "assets/bgtiles.png");
    this.load.image("drill", "assets/drill.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("ammo", "assets/ammo.png");
    this.load.image("cannontower", "assets/cannontower.png");
    this.load.image("cannonhead", "assets/cannonhead.png");
    this.load.image("worker", "assets/worker.png");
    this.load.image("boulder", "assets/boulder.png");
    this.load.image("dust", "assets/dust.png");
    this.load.image("cavebg", "assets/cavebg.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("ceiling", "assets/ceiling.png");
    this.load.image("bggradient", "assets/bggradient.png");

    const wheelConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 32,
      frameHeight: 32,
    };
    this.load.spritesheet("wheels", "assets/wheels.png", wheelConfig);

    const cursorConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 16,
      frameHeight: 16,
    };
    this.load.spritesheet("cursor", "assets/cursor.png", cursorConfig);
    this.load.tilemapTiledJSON("tilemap", "assets/tilemap.json");
  }

  create() {
    this.enemies = this.add.group();
    this.wheels = this.add.group();
    this.drills = this.add.group();
    this.cannons = this.add.group();
    this.ammo = this.add.group();
    this.boulders = this.add.group();

    this.dustEmitter = createDustEmitter(this);
    this.crumbleEmitter = createCrumbleEmitter(this);

    this.createTilemap();
    createDrill(this, this.objectLayer, this.drills);
    createWheels(this, this.objectLayer, this.wheels);
    this.createTileCursor();

    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    this.cavebg = this.add.tileSprite(
      0,
      0,
      this.map.widthInPixels * 2,
      this.map.heightInPixels * 2,
      "cavebg"
    );
    this.cavebg.setDepth(-10);

    this.caveground = this.add.tileSprite(
      0,
      this.map.heightInPixels,
      this.map.widthInPixels * 2,
      64,
      "ground"
    );
    this.caveground.tileScaleY = 1.5;

    this.caveceiling = this.add.tileSprite(
      0,
      0,
      this.map.widthInPixels * 2,
      64,
      "ceiling"
    );
    this.caveceiling.tilePositionY = -11;
    this.caveceiling.tileScaleY = 1.5;

    const cavegradient = this.add.tileSprite(
      0,
      32,
      this.map.widthInPixels * 2,
      this.map.heightInPixels * 2,
      "bggradient"
    );
    cavegradient.tileScaleY = 2.9;
    cavegradient.setDepth(-9);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
    this.cameras.main.centerOn(
      this.initialCameraFocus.x,
      this.initialCameraFocus.y
    );

    this.physics.add.collider(this.cannons, this.wallsLayer);
    this.physics.add.overlap(this.ammo, this.wallsLayer, this.objectHitsWall);
    this.physics.add.collider(this.enemies, this.groundLayer);
    this.physics.add.collider(
      this.enemies,
      this.wallsLayer,
      this.objectHitsWall
    );

    this.physics.add.collider(this.cannons, this.cannons);
    this.physics.add.overlap(this.ammo, this.enemies, this.ammoHitsEnemy);
  }

  objectHitsWall(
    objectHitting: Phaser.GameObjects.GameObject,
    walls: Phaser.GameObjects.GameObject
  ) {
    if (objectHitting instanceof Enemy) {
      objectHitting.grab();
    } else if (objectHitting instanceof Shot) {
      console.log("ding");
      this.ammo.destroy();
    }
  }

  ammoHitsEnemy(
    ammo: Phaser.GameObjects.GameObject,
    enemy: Phaser.GameObjects.GameObject
  ) {
    ammo.destroy();
    if (enemy instanceof Enemy) {
      const currentEnemy = enemy as Enemy;
      currentEnemy.getHit(1);
    }
  }

  update(time: number, delta: number) {
    this.controls.update(delta);

    const pointer = this.input.activePointer;

    this.tileCursor.x = Math.floor(pointer.worldX / 16) * 16;
    this.tileCursor.y = Math.floor(pointer.worldY / 16) * 16;
    this.wheels.rotate(0.01);

    this.enemyCooldown -= delta / 1000;

    if (this.enemyCooldown < 0) {
      this.enemyCooldown = this.enemySpawnRate;
      this.objectLayer.objects
        .filter((obj) => obj.name === "spawnpoint")
        .forEach((obj) => {
          const enemy = new Enemy(this, obj.x! + Math.random() * 100, obj.y!);
          this.enemies.add(enemy);
          this.add.existing(enemy);
        });
    }

    if (this.cannonCooldown >= 0) {
      this.cannonCooldown -= delta / 1000;
    }
    if (this.cannonCooldown < 0 && pointer.isDown) {
      // TODO Make sure cursor is inside vehicle
      const cannon = new Cannon(
        this,
        this.tileCursor.x,
        this.tileCursor.y,
        this.enemies,
        this.ammo
      );
      cannon.setOrigin(0);
      cannon.setDepth(10);

      this.cannons.add(cannon);
      this.add.existing(cannon);
      this.physics.add.existing(cannon);
      this.cannonCooldown = 3;
    }

    this.cannons.runChildUpdate = true;
    this.enemies.runChildUpdate = true;
    this.ammo.runChildUpdate = true;

    this.ammo.children.each((ammo) => {
      // console.log("processing");
      if (
        Math.round(ammo.body.velocity.x) === 0 &&
        Math.round(ammo.body.velocity.y) === 0
      ) {
        console.log("boom");
        ammo.destroy();
      }
    });

    if (this.boulderCooldown < 0) {
      this.boulderCooldown = this.boulderSpawnRate;
      const boulder = this.add.sprite(
        this.map.widthInPixels + 100,
        Math.random() * this.map.heightInPixels,
        "boulder"
      );
      boulder.setDepth(-8);

      boulder.rotation = Math.random() * Math.PI;
      this.boulders.add(boulder);
    } else {
      this.boulderCooldown -= delta / 1000;
    }

    // console.log(this.boulders, this.drills);
    this.boulders.getChildren().forEach((boulder) => {
      if (boulder && boulder instanceof Phaser.GameObjects.Sprite) {
        boulder.x -= (10 * delta) / 1000;
        if (boulder.x < this.map.widthInPixels - 80) {
          this.crumbleEmitter.emitParticle(100, boulder.x - 48, boulder.y);
          boulder.destroy();
        }
      }
    });
    this.cavebg.tilePositionX += 0.1;
    this.caveground.tilePositionX += 0.15;
    this.caveceiling.tilePositionX += 0.15;
  }

  createTilemap() {
    const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
      key: "tilemap",
    };

    this.map = this.make.tilemap(tilemapConfig);

    const bgtiles = this.map.addTilesetImage("bgtiles", "bgtiles", 16, 16);
    const bglayer = this.map.createLayer("background", "bgtiles", 0, 0);

    const tiles = this.map.addTilesetImage("tiles", "tiles", 16, 16);
    const layer = this.map.createLayer("walls", "tiles", 0, 0);
    this.wallsLayer = layer;
    layer.setCollisionBetween(1, 10);

    this.groundLayer = this.map.createLayer("ground", "tiles", 0, 0);
    this.groundLayer.setCollisionBetween(1, 10);

    console.log(this.map);
    console.log("objects", this.map.getObjectLayer("objects").objects);

    this.objectLayer = this.map.getObjectLayer("objects");

    let focus = this.findFromObjectLayer("camerafocus");

    if (!focus) {
      focus = { x: 0, y: 0 } as Phaser.Types.Tilemaps.TiledObject;
    }

    this.initialCameraFocus = new Phaser.Math.Vector2(
      Math.floor(focus.x!),
      Math.floor(focus.y!)
    );
    console.log("Focus", this.initialCameraFocus);
  }

  findFromObjectLayer(name: string): Phaser.Types.Tilemaps.TiledObject {
    return this.objectLayer.objects.find((object) => object.name === name)!;
  }

  createTileCursor() {
    this.tileCursor = this.add.sprite(0, 0, "cursor");
    this.tileCursor.setOrigin(0, 0);
  }
}
