import Phaser from "phaser";
import ScoreText from "../ui/ScoreText";
import BombSpawner from "../entities/BombSpawner";
import Player from "../entities/Player";

const GROUND_KEY = "ground";
const PLAYER_KEY = "dude";
const STAR_KEY = "star";
const BOMB_KEY = "bomb";

export default class YeetScene extends Phaser.Scene {
  constructor() {
    super("yeet-scene");

    this.player = undefined;
    this.cursors = undefined;
    this.scoreText = undefined;
    this.stars = undefined;
    this.bombSpawner = undefined;

    this.gameOver = false;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image(GROUND_KEY, "assets/platform.png");
    this.load.image(STAR_KEY, "assets/star.png");
    this.load.image(BOMB_KEY, "assets/bomb.png");

    // Load player
    this.load.spritesheet(PLAYER_KEY, "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.add.image(400, 300, "sky");

    this.player = new Player(this, 150, 450, PLAYER_KEY);

    const platforms = this.createPlatforms();

    this.stars = this.createStars();

    this.scoreText = this.createScoreText(16, 16, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    this.player.getInput();
  }

  hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play("turn");

    this.gameOver = true;
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);

    return platforms;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    return stars;
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.scoreText.addToScore(10);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }

    this.bombSpawner.spawn(player.x);
  }

  createScoreText(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };
    const labelText = new ScoreText(this, x, y, score, style);

    this.add.existing(labelText);

    return labelText;
  }
}
