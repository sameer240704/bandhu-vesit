import { Balloon } from './Balloon';
import { BALLOON_PATHS, BALLOON_COLORS } from './BalloonPaths';

export class BalloonManager {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.balloons = [];
    this.lastSpawnTime = 0;
    this.spawnInterval = 5000; // Spawn every second
    this.lastUpdateTime = null;
  }

  update(currentTime) {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = currentTime;
    }
    const dt = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;
    
    // Spawn new balloons every second
    if (currentTime - this.lastSpawnTime > this.spawnInterval) {
      // Spawn 3 balloons
      for (let i = 0; i < 1; i++) {
        this.spawnBalloon();
      }
      this.lastSpawnTime = currentTime;
    }
    
    // Update balloons
    this.balloons = this.balloons.filter(balloon => {
      balloon.update(dt);
      return !balloon.isPopped && balloon.progress < 1;
    });
  }

  spawnBalloon() {
    // Pick random path and color
    const path = BALLOON_PATHS[Math.floor(Math.random() * BALLOON_PATHS.length)];
    const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
    
    const balloon = new Balloon(path, color);
    this.balloons.push(balloon);
  }

  checkCollisions(fingerTips) {
    let score = 0;
    fingerTips.forEach(tip => {
      this.balloons.forEach(balloon => {
        if (!balloon.isPopped && balloon.checkCollision(tip.x, tip.y)) {
          balloon.isPopped = true;
          score += balloon.points;
        }
      });
    });
    return score;
  }

  draw(ctx) {
    this.balloons.forEach(balloon => balloon.draw(ctx));
  }
}