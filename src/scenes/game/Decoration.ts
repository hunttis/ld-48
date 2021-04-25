export const createAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: "playerIdle",
    frames: scene.anims.generateFrameNumbers("worker", { frames: [0] }),
  });

  scene.anims.create({
    key: "playerWalk",
    frames: scene.anims.generateFrameNumbers("worker", { frames: [1, 2, 3] }),
  });

  scene.anims.create({
    key: "playerWork",
    frames: scene.anims.generateFrameNumbers("worker", { frames: [4, 5] }),
  });

  scene.anims.create({
    key: "drilling",
    frames: scene.anims.generateFrameNumbers("drill", { frames: [0, 1, 2] }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "enemyFalling",
    frames: scene.anims.generateFrameNumbers("enemy", { frames: [0] }),
  });

  scene.anims.create({
    key: "enemyLanded",
    frames: scene.anims.generateFrameNumbers("enemy", { frames: [1] }),
  });

  scene.anims.create({
    key: "enemyRunning",
    frames: scene.anims.generateFrameNumbers("enemy", {
      frames: [2, 3, 4, 5],
    }),
    frameRate: 10,
  });

  scene.anims.create({
    key: "enemyAttacking",
    frames: scene.anims.generateFrameNumbers("enemy", { frames: [6] }),
  });

  scene.anims.create({
    key: "enemyPartying",
    frames: scene.anims.generateFrameNumbers("enemy", { frames: [0, 1] }),
    frameRate: 2,
  });
};

export const createBloodEmitter = (scene: Phaser.Scene) => {
  const bloodEmitter = scene.add.particles("ammo");

  const bloodConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    speedX: { min: -100, max: 100 },
    speedY: { min: -100, max: 100 },
    gravityY: 0,
    alpha: { start: 0.8, end: 0 },
    lifespan: 500,
    scale: { start: 2, end: 0 },
    rotate: { max: 0, min: 360 },
    quantity: 1,
    // tint: 0xcccccc,
    on: false,
  };

  bloodEmitter.createEmitter(bloodConfig);
  bloodEmitter.setDepth(3);
  return bloodEmitter;
};

export const createSparkEmitter = (scene: Phaser.Scene) => {
  const sparkEmitter = scene.add.particles("spark");

  const sparkConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    speedX: { min: -30, max: 30 },
    speedY: { min: -30, max: 30 },
    gravityY: 0,
    alpha: { start: 0.8, end: 0 },
    lifespan: 500,
    scale: { start: 0.5, end: 1 },
    quantity: 1,
    rotate: { max: 0, min: 360 },
    frame: { frames: [0, 1, 2], cycle: false },
    // tint: 0xcccccc,
    on: false,
  };

  sparkEmitter.createEmitter(sparkConfig);

  sparkEmitter.setDepth(3);
  return sparkEmitter;
};

export const createCrumbleEmitter = (scene: Phaser.Scene) => {
  const crumbleShape = new Phaser.Geom.Rectangle(0, -64, 48, 240);
  const crumbleEmitter = scene.add.particles("boulder");

  const crumbleConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    x: 700,
    y: 100,
    speedX: { min: 10, max: 100 },
    gravityY: 1000,
    alpha: { start: 0.8, end: 0 },
    lifespan: 1000,
    scale: { start: 0.12, end: 0 },
    quantity: 5,
    tint: 0xcccccc,
    rotate: { max: 0, min: 360 },
    emitZone: {
      type: "random",
      source: crumbleShape,
      quantity: 10,
    },
    on: false,
  };

  crumbleEmitter.createEmitter(crumbleConfig);
  crumbleEmitter.setDepth(-1);
  return crumbleEmitter;
};

export const createDustEmitter = (scene: Phaser.Scene) => {
  const dustShape = new Phaser.Geom.Rectangle(0, 0, 380, 8);
  const dustEmitter = scene.add.particles("dust");

  const dustConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    x: 290,
    y: 350,
    speedX: { min: -100, max: -10 },
    gravityY: -100,
    alpha: { start: 0.5, end: 0 },
    lifespan: 1000,
    scale: { start: 1, end: 0, ease: "Quad.easeInOut" },
    quantity: 8,
    blendMode: "ADD",
    frame: { frames: [0, 1, 2, 3], cycle: false },
    emitZone: {
      type: "random",
      source: dustShape,
      quantity: 1,
    },
  };

  dustEmitter.createEmitter(dustConfig);
  dustEmitter.setDepth(0);
  return dustEmitter;
};

export const createPuffEmitter = (scene: Phaser.Scene) => {
  const puffEmitter = scene.add.particles("dust");

  const puffConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
    x: 0,
    y: 0,
    gravityY: -100,
    alpha: { start: 1, end: 0 },
    lifespan: 1000,
    scale: { start: 0.5, end: 0, ease: "Quad.easeInOut" },
    quantity: 1,
    blendMode: "ADD",
    frame: { cycle: false },
  };

  puffEmitter.createEmitter(puffConfig);
  puffEmitter.setDepth(3);
  return puffEmitter;
};

export const createDrill = (
  scene: Phaser.Scene,
  objectLayer: Phaser.Tilemaps.ObjectLayer,
  drills: Phaser.GameObjects.Group
) => {
  const drillLocation = findFromObjectLayer(objectLayer, "lowestdrill");
  for (let i = 0; i < 4; i++) {
    const spriteConfig: Phaser.Types.GameObjects.Sprite.SpriteConfig = {
      key: "drill",
      x: drillLocation.x! - 4,
      y: drillLocation.y!,
      depth: -2,
      origin: 0,
    };
    const drill = scene.make.sprite(spriteConfig, false);
    drill.y -= drill.height * (i + 1) - drill.height / 2;
    drill.tint = 0x888888;
    drill.name = "Drill";
    addAnimationToDrill(scene, drill);

    drill.anims.play("drilling");
    drills.add(drill);
    scene.add.existing(drill);
  }
  for (let i = 0; i < 5; i++) {
    const spriteConfig: Phaser.Types.GameObjects.Sprite.SpriteConfig = {
      key: "drill",
      x: drillLocation.x! - 3,
      y: drillLocation.y!,
      depth: -1,
      origin: 0,
    };

    const drill = scene.make.sprite(spriteConfig, false);
    drill.y -= drill.height * i;
    drill.name = "Drill";
    addAnimationToDrill(scene, drill);
    drill.anims.play("drilling");

    scene.add.existing(drill);
    drills.add(drill);
  }
};

export const createWheels = (
  scene: Phaser.Scene,
  objectLayer: Phaser.Tilemaps.ObjectLayer,
  wheels: Phaser.GameObjects.Group
) => {
  const drillLocation = findFromObjectLayer(objectLayer, "lowestdrill");

  for (let i = 0; i < 12; i++) {
    const spriteConfig: Phaser.Types.GameObjects.Sprite.SpriteConfig = {
      key: "wheels",
      x: drillLocation.x! - 16,
      y: drillLocation.y! + 48,
      depth: -3,
    };

    // const wheel = scene.make.sprite(spriteConfig, false);

    const wheel = scene.physics.add.staticSprite(
      drillLocation.x! - 16 - i * 32,
      drillLocation.y! + 48,
      "wheels"
    );
    wheel.name = "Wheel";

    wheel.rotation = Math.random();
    wheel.depth = -3;

    scene.add.existing(wheel);

    wheels.add(wheel);
  }
};

const addAnimationToDrill = (
  scene: Phaser.Scene,
  drill: Phaser.GameObjects.Sprite
) => {
  scene.tweens.add({
    targets: drill,
    x: drill.x + 1,
    duration: 100 + Math.random() * 100,
    ease: "Linear",
    yoyo: true,
    repeat: -1,
  });
};

const findFromObjectLayer = (
  objectLayer: Phaser.Tilemaps.ObjectLayer,
  name: string
): Phaser.Types.Tilemaps.TiledObject => {
  return objectLayer.objects.find((object) => object.name === name)!;
};
