import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";
import YeetScene from "./scenes/YeetScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [YeetScene, HelloWorldScene],
};

export default new Phaser.Game(config);
