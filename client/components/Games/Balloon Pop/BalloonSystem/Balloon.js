export class Balloon {
  constructor(path, color, radius = 30) {
    this.path = path;
    this.color = color;
    this.radius = radius;
    this.isPopped = false;
    this.progress = 0; // 0 to 1
    this.x = path.startX;
    this.y = 720; // Canvas height
    this.points = Math.ceil(path.speed / 5); // Faster balloons worth more
  }

  update(dt) {
    if (!this.isPopped) {
      // Update progress
      this.progress += (this.path.speed * dt) / 720; // Normalize to screen height
      this.progress = Math.min(this.progress, 1);

      // Update position
      if (this.path.curve) {
        // S-curve movement
        this.x = this.path.startX + (this.path.endX - this.path.startX) * this.progress;
        const wave = Math.sin(this.progress * Math.PI * 2) * 100;
        this.x += wave;
      } else {
        // Linear movement
        this.x = this.path.startX + (this.path.endX - this.path.startX) * this.progress;
      }
      this.y = 720 - (this.progress * 720);
    }
  }

  draw(ctx) {
    if (this.isPopped) return;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
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