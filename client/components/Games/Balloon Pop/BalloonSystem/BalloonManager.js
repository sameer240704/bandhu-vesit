import { Balloon } from './Balloon';
import { BALLOON_PATHS, BALLOON_COLORS } from './BalloonPaths';

export class BalloonManager {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.balloons = [];
    this.lastSpawnTime = 0;
    this.spawnInterval = 1000; // Spawn every 1 second
    this.maxBalloons = 10;
    this.lastUpdateTime = performance.now(); // Initialize with current time
  }

  update(currentTime) {
    const dt = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;

    // Spawn new balloons with controlled frequency
    if (currentTime - this.lastSpawnTime > this.spawnInterval) {
      this.spawnBalloon();
      this.lastSpawnTime = currentTime;
    }

    // Update and filter balloons
    this.balloons = this.balloons.filter(balloon => {
      const shouldKeep = balloon.update(dt);
      return !balloon.isPopped && shouldKeep;
    });
  }

  spawnBalloon() {
    if (this.balloons.length < this.maxBalloons) {
      const path = BALLOON_PATHS[Math.floor(Math.random() * BALLOON_PATHS.length)];
      const balloon = new Balloon(
        path,
        BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        30
      );
      // Adjust start position to bottom of canvas
      balloon.y = this.canvasHeight - balloon.radius;
      this.balloons.push(balloon);
    }
  }

  checkCollisions(fingerTips) {
    let totalScore = 0;
    const poppedIds = new Set();
    
    fingerTips.forEach(tip => {
      this.balloons.forEach((balloon, index) => {
        if (!poppedIds.has(index) && !balloon.isPopped && balloon.checkCollision(tip.x, tip.y)) {
          balloon.isPopped = true;
          totalScore += balloon.points;
          poppedIds.add(index);
          console.log(`Popped balloon worth ${balloon.points} points`); // Debug
        }
      });
    });
    
    return totalScore;
  }

  draw(ctx) {
    this.balloons.forEach(balloon => {
      balloon.draw(ctx);
      // Reset pop effect after drawing
      if (balloon.popEffect) {
        ctx.beginPath();
        ctx.arc(balloon.x, balloon.y, balloon.radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        balloon.popEffect = false;
      }
    });
  }
}