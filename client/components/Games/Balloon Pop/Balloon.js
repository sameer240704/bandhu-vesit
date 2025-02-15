export class Balloon {
  constructor({ x, y, radius, speed }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.isPopped = false;
  }

  update(deltaTime) {
    // Move the balloon upward; scale deltaTime for visibility.
    this.y -= this.speed * (deltaTime * 0.05);
  }

  draw(ctx) {
    if (this.isPopped) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  checkCollision(tipX, tipY) {
    const dx = this.x - tipX;
    const dy = this.y - tipY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius;
  }

  pop() {
    this.isPopped = true;
  }
} 