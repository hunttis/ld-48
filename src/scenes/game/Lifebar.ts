export default class Lifebar extends Phaser.GameObjects.Graphics {
  value: number = 100;
  p: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);
    this.x = x;
    this.y = y;

    this.setScrollFactor(0, 0);
    this.p = 76 / 100;

    this.depth = 100;
    scene.add.existing(this);
    this.draw();
  }

  draw() {
    this.clear();

    //  BG
    this.fillStyle(0x000000);
    this.fillRect(this.x, this.y, 80, 16);

    //  Health

    this.fillStyle(0x000000);
    this.fillRect(this.x + 2, this.y + 2, 76, 12);

    if (this.value < 30) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.fillRect(this.x + 2, this.y + 2, d, 12);
  }

  reduceLife(value: number) {
    this.value -= value;
    if (this.value < 0) {
      this.value = 0;
    }
    this.draw();
  }

  addLife(value: number) {
    this.value += value;
    if (this.value < 0) {
      this.value = 0;
    }
    this.draw();
  }

  getLife() {
    return this.value;
  }
}
