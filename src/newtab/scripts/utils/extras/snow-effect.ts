interface Circle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
}

export const snowStorm = (): void => {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

  if (!ctx) return;

  canvas.style.pointerEvents = "none";
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "9999";

  const circles: Circle[] = [];
  const angle = (Math.random() * (60 - 30) + 30) * (Math.PI / 180); // random angle between 30 and 60 degrees

  // create random circles
  for (let i = 0; i < 150; i++) {
    const speed = Math.random() * 1.5 + 0.75; // Random speed

    circles.push({
      x: Math.random() * (canvas.width * 1.75) - 0.75 * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    });
  }

  const drawCircles = (): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      if (circle.y >= canvas.height || circle.x >= canvas.width) {
        circle.x = Math.random() * (canvas.width * 1.75) - 0.75 * canvas.width;
        circle.y = 0;
      } else {
        circle.x += circle.vx;
        circle.y += circle.vy;
      }
    });

    requestAnimationFrame(drawCircles);
  };

  drawCircles();
};
