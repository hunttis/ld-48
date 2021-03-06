import Phaser from "phaser";
import Enemy from "./game/Enemy";
import Cannon from "./game/Cannon";
import Shot from "./game/Shot";
import {
  createDrill,
  createWheels,
  createDustEmitter,
  createCrumbleEmitter,
  createAnimations,
  createSparkEmitter,
  createBloodEmitter,
  createPuffEmitter,
} from "./game/Decoration";
import Lifebar from "./game/Lifebar";
import Player from "./game/Player";

export default class Game extends Phaser.Scene {
  player!: Player;
  computer!: Phaser.GameObjects.Sprite;

  crunchSound!: Phaser.Sound.BaseSound;
  longCrunchSound!: Phaser.Sound.BaseSound;
  crunch2Sound!: Phaser.Sound.BaseSound;
  clackSound!: Phaser.Sound.BaseSound;
  clack2Sound!: Phaser.Sound.BaseSound;
  fixSound!: Phaser.Sound.BaseSound;
  placeSound!: Phaser.Sound.BaseSound;
  rocksSound!: Phaser.Sound.BaseSound;

  thunkSound!: Phaser.Sound.BaseSound;
  thunk2Sound!: Phaser.Sound.BaseSound;
  thunk3Sound!: Phaser.Sound.BaseSound;
  thunk4Sound!: Phaser.Sound.BaseSound;

  zapSound!: Phaser.Sound.BaseSound;
  zap2Sound!: Phaser.Sound.BaseSound;
  zap3Sound!: Phaser.Sound.BaseSound;
  zap4Sound!: Phaser.Sound.BaseSound;
  zap5Sound!: Phaser.Sound.BaseSound;

  blorpSound!: Phaser.Sound.BaseSound;
  blorp2Sound!: Phaser.Sound.BaseSound;
  blorp3Sound!: Phaser.Sound.BaseSound;
  blorp4Sound!: Phaser.Sound.BaseSound;
  blorp5Sound!: Phaser.Sound.BaseSound;

  clunkSound!: Phaser.Sound.BaseSound;
  processSound!: Phaser.Sound.BaseSound;
  splosionSound!: Phaser.Sound.BaseSound;
  explosionSound!: Phaser.Sound.BaseSound;
  bigexplosionSound!: Phaser.Sound.BaseSound;

  dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  puffEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  crumbleEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  bloodEmitter!: Phaser.GameObjects.Particles.ParticleEmitterManager;

  map!: Phaser.Tilemaps.Tilemap;
  wallsLayer!: Phaser.Tilemaps.TilemapLayer;
  groundLayer!: Phaser.Tilemaps.TilemapLayer;
  objectLayer!: Phaser.Tilemaps.ObjectLayer;

  initialCameraFocus!: Phaser.Math.Vector2;
  tileCursor!: Phaser.GameObjects.Sprite;
  arrowSprite!: Phaser.GameObjects.Sprite;

  drills!: Phaser.GameObjects.Group;
  wheels!: Phaser.Physics.Arcade.StaticGroup;
  enemies!: Phaser.GameObjects.Group;
  cannons!: Phaser.GameObjects.Group;
  workers!: Phaser.GameObjects.Group;
  ammo!: Phaser.GameObjects.Group;
  boulders!: Phaser.GameObjects.Group;

  cavebg!: Phaser.GameObjects.TileSprite;
  caveground!: Phaser.GameObjects.TileSprite;
  caveceiling!: Phaser.GameObjects.TileSprite;

  damagedTiles!: Map<string, number>;
  destroyedTiles: Phaser.Math.Vector2[] = [];

  enemySpawnRate: number = 10;
  enemyCooldown: number = 3;
  cannonCooldown: number = 0;
  boulderSpawnRate: number = 0.2;
  boulderCooldown: number = 0;

  fixCursor!: Phaser.GameObjects.Sprite;

  crawlerLifebar!: Lifebar;
  moving: boolean = true;
  processableRock: number = 10;
  processedRock: number = 0;

  instructionsArrows!: Phaser.GameObjects.Text;
  instructionsFixUse!: Phaser.GameObjects.Text;
  processableRockText!: Phaser.GameObjects.Text;
  processedRockText!: Phaser.GameObjects.Text;
  finalScoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.damagedTiles = new Map<string, number>();

    this.sound.volume = 0.5;

    this.load.audio("bigexplosion", "assets/bigexplosion.wav");
    this.load.audio("explosion", "assets/explosion.wav");
    this.load.audio("splosion", "assets/splosion.wav");
    this.load.audio("process", "assets/process.wav");
    this.load.audio("clunk", "assets/clunk.wav");
    this.load.audio("thunk", "assets/thunk.wav");
    this.load.audio("thunk2", "assets/thunk2.wav");
    this.load.audio("thunk3", "assets/thunk3.wav");
    this.load.audio("thunk4", "assets/thunk4.wav");

    this.load.audio("zap", "assets/zap.wav");
    this.load.audio("zap2", "assets/zap2.wav");
    this.load.audio("zap3", "assets/zap3.wav");
    this.load.audio("zap4", "assets/zap4.wav");
    this.load.audio("zap5", "assets/zap5.wav");

    this.load.audio("blorp", "assets/blorp.wav");
    this.load.audio("blorp2", "assets/blorp2.wav");
    this.load.audio("blorp3", "assets/blorp3.wav");
    this.load.audio("blorp4", "assets/blorp4.wav");
    this.load.audio("blorp5", "assets/blorp5.wav");

    this.load.audio("fix", "assets/fix.wav");
    this.load.audio("place", "assets/place.wav");
    this.load.audio("rocks", "assets/rocks.wav");

    this.load.audio("crunch", [
      "assets/crunch.mp3",
      "assets/crunch.ogg",
      "assets/crunch.wav",
    ]);

    this.load.audio("longcrunch", [
      "assets/longcrunch.mp3",
      "assets/longcrunch.ogg",
      "assets/longcrunch.wav",
    ]);

    this.load.audio("crunch2", [
      "assets/crunch2.mp3",
      "assets/crunch2.ogg",
      "assets/crunch2.wav",
    ]);

    this.load.audio("clack", [
      "assets/clack.mp3",
      "assets/clack.ogg",
      "assets/clack.wav",
    ]);

    this.load.audio("clack2", [
      "assets/clack2.mp3",
      "assets/clack2.ogg",
      "assets/clack2.wav",
    ]);

    this.load.image("tiles", "assets/tiles.png");
    this.load.image("bgtiles", "assets/bgtiles.png");

    const drillConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 34,
      frameHeight: 64,
    };

    this.load.spritesheet("drill", "assets/drill.png", drillConfig);

    const smallSpriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 16,
      frameHeight: 16,
    };
    const bigSpriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig = {
      frameWidth: 32,
      frameHeight: 32,
    };

    this.load.spritesheet("enemy", "assets/enemy.png", smallSpriteConfig);

    this.load.image("computer", "assets/computer.png");
    this.load.image("arrow", "assets/arrow.png");
    this.load.image("ammo", "assets/ammo.png");
    this.load.image("cannontower", "assets/cannontower.png");
    this.load.image("cannonhead", "assets/cannonhead.png");
    this.load.spritesheet("worker", "assets/worker.png", smallSpriteConfig);
    this.load.image("boulder", "assets/boulder.png");
    this.load.spritesheet("dust", "assets/dust.png", smallSpriteConfig);
    this.load.image("cavebg", "assets/cavebg.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("ceiling", "assets/ceiling.png");
    this.load.image("bggradient", "assets/bggradient.png");
    this.load.spritesheet("spark", "assets/spark.png", smallSpriteConfig);
    this.load.spritesheet("wheels", "assets/wheel.png", bigSpriteConfig);
    this.load.spritesheet("cursor", "assets/cursor.png", smallSpriteConfig);
    this.load.tilemapTiledJSON("tilemap", "assets/tilemap.json");
  }

  create() {
    this.crunchSound = this.sound.add("crunch");
    this.longCrunchSound = this.sound.add("longcrunch");
    this.crunch2Sound = this.sound.add("crunch2");

    this.clackSound = this.sound.add("clack");
    this.clack2Sound = this.sound.add("clack2");

    this.fixSound = this.sound.add("fix");
    this.placeSound = this.sound.add("place");
    this.rocksSound = this.sound.add("rocks");

    this.thunkSound = this.sound.add("thunk");
    this.thunk2Sound = this.sound.add("thunk2");
    this.thunk3Sound = this.sound.add("thunk4");
    this.thunk4Sound = this.sound.add("thunk4");

    this.zapSound = this.sound.add("zap");
    this.zap2Sound = this.sound.add("zap2");
    this.zap3Sound = this.sound.add("zap4");
    this.zap4Sound = this.sound.add("zap4");
    this.zap5Sound = this.sound.add("zap5");

    this.blorpSound = this.sound.add("blorp");
    this.blorp2Sound = this.sound.add("blorp2");
    this.blorp3Sound = this.sound.add("blorp4");
    this.blorp4Sound = this.sound.add("blorp4");
    this.blorp5Sound = this.sound.add("blorp5");

    this.clunkSound = this.sound.add("clunk");
    this.processSound = this.sound.add("process");
    this.explosionSound = this.sound.add("explosion");
    this.splosionSound = this.sound.add("splosion");
    this.bigexplosionSound = this.sound.add("bigexplosion");

    createAnimations(this);
    this.enemies = this.add.group();
    this.wheels = this.physics.add.staticGroup();
    this.drills = this.add.group();
    this.cannons = this.add.group();
    this.ammo = this.add.group();
    this.boulders = this.add.group();

    this.cannons.runChildUpdate = true;
    this.enemies.runChildUpdate = true;
    this.ammo.runChildUpdate = true;

    this.dustEmitter = createDustEmitter(this);
    this.puffEmitter = createPuffEmitter(this);
    this.crumbleEmitter = createCrumbleEmitter(this);
    this.sparkEmitter = createSparkEmitter(this);
    this.bloodEmitter = createBloodEmitter(this);

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

    this.physics.add.collider(this.player, this.wallsLayer);
    this.physics.add.collider(
      this.player,
      this.groundLayer,
      this.destroySprite
    );
    this.physics.add.collider(this.cannons, this.wallsLayer);

    this.physics.add.collider(this.enemies, this.groundLayer);
    this.physics.add.collider(
      this.enemies,
      this.wallsLayer,
      this.objectHitsWall
    );

    this.physics.add.collider(this.cannons, this.cannons, this.destroyBoth);
    this.physics.add.overlap(this.ammo, this.enemies, this.ammoHitsEnemy);
    this.physics.add.overlap(this.wheels, this.enemies, this.enemyEndsInWheels);

    this.fixCursor = this.add.sprite(200, 200, "cursor");

    this.instructionsArrows = this.add
      .text(
        1,
        this.map.heightInPixels - 24,
        "Use arrows to move, and jump. Space to shoot."
      )
      .setFontSize(14);
    this.instructionsArrows.setDepth(100);
    this.instructionsArrows.setScrollFactor(0, 0);
    this.instructionsArrows = this.add
      .text(
        1,
        this.map.heightInPixels - 6,
        "Hold X to work: Fix enemy broken walls and use computer to process rock."
      )
      .setFontSize(14);

    this.instructionsArrows.setDepth(100);
    this.instructionsArrows.setScrollFactor(0, 0);

    const healthText = this.add
      .text(1, 1, "Minecrawler health:")
      .setFontSize(16)
      .setScrollFactor(0, 0);
    this.crawlerLifebar = new Lifebar(this, 100, 1);

    this.processableRockText = this.add
      .text(1, 16, "Processable rock: 0")
      .setScrollFactor(0, 0)
      .setFontSize(14);

    this.processedRockText = this.add
      .text(
        this.processableRockText.width + 200,
        16,
        "Processed rock (score): 0"
      )
      .setScrollFactor(0, 0)
      .setFontSize(14);

    this.finalScoreText = this.add
      .text(
        this.map.widthInPixels / 2,
        this.map.heightInPixels / 2,
        "FINAL SCORE: ",
        { fontFamily: "Arial Black", color: "#000000" }
      )
      .setStroke("#ffffff", 10)
      .setFontSize(24)
      .setDepth(100);

    this.finalScoreText.visible = false;
  }

  destroySprite(
    firstObject: Phaser.GameObjects.GameObject,
    secondObject: Phaser.GameObjects.GameObject
  ) {
    if (firstObject instanceof Phaser.Physics.Arcade.Sprite) {
      firstObject.destroy();
    } else if (secondObject instanceof Phaser.Physics.Arcade.Sprite) {
      secondObject.destroy();
    }
  }

  enemyEndsInWheels(
    enemy: Phaser.GameObjects.GameObject,
    wheel: Phaser.GameObjects.GameObject
  ) {
    if (enemy instanceof Enemy) {
      enemy.destroyInWheels();
    }
  }

  destroyBoth(
    firstObject: Phaser.GameObjects.GameObject,
    secondObject: Phaser.GameObjects.GameObject
  ) {
    firstObject.destroy();
    secondObject.destroy();
  }

  objectHitsWall(
    objectHitting: Phaser.GameObjects.GameObject,
    tile: Phaser.GameObjects.GameObject
  ) {
    if (
      objectHitting instanceof Enemy &&
      objectHitting.isAttacking() &&
      tile instanceof Phaser.Tilemaps.Tile
    ) {
      objectHitting.grab(tile);
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
    this.cameras.main.centerOn(this.player.x, this.player.y);

    if (time / 1000 < 10) {
      this.enemySpawnRate = 10;
    } else if (time / 1000 < 30) {
      this.enemySpawnRate = 8;
    } else if (time / 1000 < 50) {
      this.enemySpawnRate = 6;
    } else if (time / 1000 < 70) {
      this.enemySpawnRate = 4;
    } else if (time / 1000 < 90) {
      this.enemySpawnRate = 2;
    } else {
      this.enemySpawnRate = 0.5;
    }

    this.enemies.children.each((enemy) => {
      if (enemy instanceof Enemy) {
        const grabbedTile = enemy.getGrabbedTile();
        if (grabbedTile) {
          this.damageTile(grabbedTile);
          enemy.clearGrabbedTile();
        }
      }
    });

    this.damagedTiles.forEach((tileValue: number, tileLocation: string) => {
      if (tileValue >= 3) {
        const coords = tileLocation.split("x");
        this.wallsLayer.removeTileAt(parseInt(coords[0]), parseInt(coords[1]));
        this.destroyedTiles.push(
          new Phaser.Math.Vector2(parseInt(coords[0]), parseInt(coords[1]))
        );
        this.crawlerLifebar.reduceLife(10);
        this.damagedTiles.delete(tileLocation);
        this.playSound("explosion");
      }
    });

    this.ammo.children.each((ammo) => {
      if (
        Math.round(ammo.body.velocity.x) === 0 &&
        Math.round(ammo.body.velocity.y) === 0
      ) {
        ammo.destroy();
      }
    });

    if (this.moving) {
      if (this.player) {
        this.player.update(time, delta);
      }
      this.wheels.rotate(0.01);

      if (this.enemyCooldown < 0) {
        this.enemyCooldown = this.enemySpawnRate;
        this.objectLayer.objects
          .filter((obj) => obj.name === "spawnpoint")
          .filter((obj) => Math.random() < 0.75)
          .forEach((obj) => {
            const enemy = new Enemy(
              this,
              obj.x! + Math.random() * 100,
              obj.y!,
              this.bloodEmitter,
              this.sparkEmitter
            );
            this.enemies.add(enemy);
            this.add.existing(enemy);
          });
      } else {
        this.enemyCooldown -= delta / 1000;
      }

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

      this.boulders.getChildren().forEach((boulder) => {
        if (boulder && boulder instanceof Phaser.GameObjects.Sprite) {
          boulder.x -= (10 * delta) / 1000;
          if (boulder.x < this.map.widthInPixels - 80) {
            this.crumbleEmitter.emitParticle(100, boulder.x - 48, boulder.y);
            this.processableRock += 0.2;
            this.playSound("rocks");
            boulder.destroy();
          }
        }
      });

      const newProcessedRockText =
        "Processed rock (score): " + this.processedRock.toFixed(0);
      if (this.processedRockText.text != newProcessedRockText) {
        this.processedRockText.text = newProcessedRockText;
      }

      const newProcessableRockText =
        "Processable rock: " + this.processableRock.toFixed(0);
      if (this.processableRockText.text != newProcessableRockText) {
        this.processableRockText.text = newProcessableRockText;
      }

      this.cavebg.tilePositionX += 0.1;
      this.caveground.tilePositionX += 0.15;
      this.caveceiling.tilePositionX += 0.15;
    }

    if (
      (this.moving && this.crawlerLifebar.getLife() <= 0) ||
      !this.player ||
      !this.player.body
    ) {
      this.moving = false;
      if (this.player && this.player.body) {
        this.player.body.velocity.x = 0;
      }
      this.dustEmitter.destroy();
      this.drills.children.each((drill) => drill.destroy());
      this.tweens.killAll();
      this.enemies.children.each((enemy) => {
        if (enemy instanceof Enemy) {
          enemy.startPartying();
        }
      });
      this.cannons.children.each((cannon) => cannon.destroy());
      this.playSound("bigexplosion");
      this.finalScoreText.visible = true;
      this.finalScoreText.text =
        "FINAL SCORE: " + this.processedRock.toFixed(0);
    }

    this.arrowSprite.visible = this.processableRock > 1;
  }

  createTilemap() {
    const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
      key: "tilemap",
    };

    console.log("creating tile map");
    this.map = this.make.tilemap(tilemapConfig);

    console.log("Creating bg tiles");
    const bgtiles = this.map.addTilesetImage("bgtiles", "tiles", 16, 16);

    console.log("Creating bg layer");
    const bglayer = this.map.createLayer("background", "tiles", 0, 0);
    // bglayer.visible = false;

    const tiles = this.map.addTilesetImage("tiles", "tiles", 16, 16);
    const layer = this.map.createLayer("walls", "tiles", 0, 0);
    this.wallsLayer = layer;
    layer.setCollisionBetween(1, 64);

    this.groundLayer = this.map.createLayer("ground", "tiles", 0, 0);
    this.groundLayer.setCollisionBetween(1, 64);

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

    let playerLocation = this.findFromObjectLayer("player");
    this.player = new Player(this, playerLocation.x!, playerLocation.y!);

    let computerLocation = this.findFromObjectLayer("computer");
    this.computer = this.add.sprite(
      Math.floor(computerLocation.x! / 16) * 16,
      Math.floor(computerLocation.y! / 16) * 16,
      "computer"
    );
    this.computer.setOrigin(0, 0);

    this.arrowSprite = this.add.sprite(
      Math.floor(computerLocation.x! / 16) * 16 + 8,
      Math.floor(computerLocation.y! / 16) * 16 - 10,
      "arrow"
    );

    this.tweens.add({
      targets: this.arrowSprite,
      y: this.arrowSprite.y - 10,
      repeat: -1,
      yoyo: true,
      ease: "Quad.easeInOut",
    });

    this.objectLayer.objects
      .filter((obj) => obj.name === "turret")
      .forEach((turret) => {
        const turretX = turret.x!;
        const turretY = turret.y!;

        const cannon = new Cannon(
          this,
          Math.floor(turretX / 16) * 16,
          Math.floor(turretY / 16) * 16,
          this.enemies,
          this.ammo,
          this.sparkEmitter,
          this.puffEmitter
        );
        this.cannons.add(cannon);
      });
  }

  findFromObjectLayer(name: string): Phaser.Types.Tilemaps.TiledObject {
    return this.objectLayer.objects.find((object) => object.name === name)!;
  }

  createTileCursor() {
    this.tileCursor = this.add.sprite(0, 0, "cursor");
    this.tileCursor.setOrigin(0, 0);
  }

  damageTile(tile: Phaser.Tilemaps.Tile) {
    const tileLocation = `${tile.x}x${tile.y}`;
    const tileValue = this.damagedTiles.get(tileLocation) || 0;
    this.damagedTiles.set(tileLocation, tileValue + 1);
  }

  playSound(sound: string) {
    if (sound === "crunch") {
      const randomSound = Math.random();
      if (randomSound < 0.2) {
        this.crunchSound.play();
      } else if (randomSound < 0.5) {
        this.longCrunchSound.play();
      } else {
        this.crunch2Sound.play();
      }
    }

    if (sound === "clack") {
      const randomSound = Math.random();
      if (randomSound < 0.5) {
        this.clackSound.play();
      } else {
        this.clack2Sound.play();
      }
    }

    if (sound === "process") {
      if (!this.processSound.isPlaying) {
        this.processSound.play();
      }
    }

    if (sound === "place") {
      this.placeSound.play();
    }

    if (sound === "fix") {
      if (!this.fixSound.isPlaying) {
        this.fixSound.play();
      }
    }

    if (sound === "rocks") {
      if (!this.rocksSound.isPlaying) {
        this.rocksSound.play();
      }
    }

    if (sound === "bigexplosion") {
      this.bigexplosionSound.play();
    }

    if (sound === "explosion") {
      const randomSound = Math.random();
      if (randomSound < 0.5) {
        this.explosionSound.play();
      } else {
        this.splosionSound.play();
      }
    }

    if (sound === "thunk") {
      const randomSound = Math.random();
      if (randomSound < 0.25) {
        this.thunkSound.play();
      } else if (randomSound < 0.5) {
        this.thunk2Sound.play();
      } else if (randomSound < 0.75) {
        this.thunk3Sound.play();
      } else {
        this.thunk4Sound.play();
      }
    }

    if (sound === "zap") {
      const randomSound = Math.random();
      if (randomSound < 0.2) {
        this.zapSound.play();
      } else if (randomSound < 0.4) {
        this.zap2Sound.play();
      } else if (randomSound < 0.6) {
        this.zap3Sound.play();
      } else if (randomSound < 0.8) {
        this.zap4Sound.play();
      } else {
        this.zap5Sound.play();
      }
    }

    if (sound === "blorp") {
      const randomSound = Math.random();
      if (randomSound < 0.2) {
        this.blorpSound.play();
      } else if (randomSound < 0.4) {
        this.blorp2Sound.play();
      } else if (randomSound < 0.6) {
        this.blorp3Sound.play();
      } else if (randomSound < 0.8) {
        this.blorp4Sound.play();
      } else {
        this.blorp5Sound.play();
      }
    }
  }
}
