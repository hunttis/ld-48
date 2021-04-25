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
    speedX: { min: -100, max: -100 },
    gravityY: -100,
    alpha: { start: 0.5, end: 0 },
    lifespan: 1000,
    scale: { start: 1, end: 0, ease: "Bounce.easeInOut" },
    quantity: 10,
    blendMode: "ADD",
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

    drills.add(drill);
    scene.add.existing(drill);
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

    const wheel = scene.make.sprite(spriteConfig, false);
    wheel.name = "Wheel";
    wheel.x -= i * 32;
    wheel.rotation = Math.random();

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
