export class Balloon {
  constructor(x, y, radius, speed, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed; // pixels per second (as decided by manager)
    this.color = color;
    this.isPopped = false;
    // Points calculated once from passed parameters
    this.points = Math.max(1, Math.ceil(((144 - this.speed) + (45 - this.radius)) / 10));
  }

  // dt is in seconds
  update(dt) {
    if (!this.isPopped) {
      this.y -= this.speed * dt;
    }
  }

  draw(ctx) {
    if (this.isPopped) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      this.radius * 0.1,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.2, this.color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.radius);
    ctx.quadraticCurveTo(
      this.x + 10,
      this.y + this.radius + 15,
      this.x,
      this.y + this.radius + 30
    );
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  checkCollision(fingerX, fingerY) {
    if (this.isPopped) return false;
    const dx = this.x - fingerX;
    const dy = this.y - fingerY;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }
}