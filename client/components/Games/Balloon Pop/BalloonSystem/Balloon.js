export class Balloon {
  constructor(path, color, radius = 30) {
    this.path = path;
    this.color = color;
    this.radius = radius;
    this.isPopped = false;
    this.progress = 0; // 0 to 1
    this.x = path.startX;
    this.y = 720; // Canvas height
    this.points = Math.ceil((path.speed * 10) + (50 - radius)); // Better points calculation
    this.baseSpeed = path.speed; // Store original speed
    this.speed = this.baseSpeed; // Current speed remains independent
    this.popEffect = false;
    this.drift = 0;
    this.canvasWidth = 720; // Assuming a default canvas width
  }

  update(dt) {
    if (!this.isPopped) {
      // Maintain constant vertical speed
      this.y -= this.speed * dt;
      
      // Horizontal movement with bounce physics
      this.x += this.drift * dt * 60;
      
      // Bounce off walls with energy preservation
      if (this.x < this.radius) {
        this.drift = Math.abs(this.drift) * 0.9;
        this.x = this.radius;
      } else if (this.x > this.canvasWidth - this.radius) {
        this.drift = -Math.abs(this.drift) * 0.9;
        this.x = this.canvasWidth - this.radius;
      }
      
      // Only remove when fully off screen at top
      return this.y > -this.radius * 2;
    }
    return false;
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