import Phaser from "phaser";

const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
      gravity: { y: 100 },
    },
  },
  pixelArt: true,
  scale: {
    width: 640,
    height: 400,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  audio: {
    // noAudio: true,
    disableWebAudio: true,
  },
};

export default PhaserConfig;
