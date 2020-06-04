import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, playerKey) {
    super(scene, x, y, playerKey);

    // What scene the player is in
    this.scene = scene;

    // The key tag for this object
    this.playerKey = playerKey;

    // Player input controls
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Load assets
    this.loadAssets();
  }

  loadAssets() {
    this.scene.load.spritesheet(this.playerKey, "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    this.scene.load.once("complete", this.create.bind(this));
    this.scene.load.start();
  }

  create() {
    // Add character sprite to scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Characteristics
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);

    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers(this.playerKey, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: this.playerKey, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers(this.playerKey, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  getInput() {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-160);
      this.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(160);
      this.anims.play("right", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("turn");
    }
    if (this.cursors.up.isDown && this.body.touching.down) {
      this.setVelocityY(-330);
    }
  }
}
