export const drawScene = (ctx, video, results, balloons) => {
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw the video feed (mirrored)
  ctx.save();
  ctx.scale(-1, 1);
  ctx.drawImage(
    video,
    -ctx.canvas.width,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
  ctx.restore();

  // Draw balloons
  if (balloons && balloons.length > 0) {
    console.log('Drawing balloons:', balloons.length); // Debug log
    balloons.forEach((balloon) => {
      if (!balloon.isPopped) {
        ctx.beginPath();
        
        // Create gradient for balloon
        const gradient = ctx.createRadialGradient(
          balloon.x, balloon.y, 0,
          balloon.x, balloon.y, balloon.radius
        );
        gradient.addColorStop(0, 'rgba(255, 100, 100, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0.7)');
        
        ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add balloon string
        ctx.beginPath();
        ctx.moveTo(balloon.x, balloon.y + balloon.radius);
        ctx.lineTo(balloon.x, balloon.y + balloon.radius + 20);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  // Draw hand landmarks if available
  if (results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach((landmarks) => {
      // Draw hand connections
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 3;

      landmarks.forEach((landmark, index) => {
        const x = (1 - landmark.x) * ctx.canvas.width;
        const y = landmark.y * ctx.canvas.height;

        // Draw each landmark point
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.stroke();

        // Highlight index fingertip
        if (index === 8) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
          ctx.fill();
          ctx.strokeStyle = 'white';
          ctx.stroke();
        }
      });
    });
  }
}; 