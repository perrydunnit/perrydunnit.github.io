import init, { Spirograph } from './pkg/spirograph_wasm.js';

let spiro, ctx, width, height, scale, stepsPerFrame, imageData;
let animationId = null;

export async function startSpirographWasm(segments, speed, dpr = 1) {
  await init(); // Loads the wasm module

  // Setup canvas
  let canvas = document.getElementById('spiroCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'spiroCanvas';
    document.body.appendChild(canvas);
  }
  width = Math.min(window.innerWidth, window.innerHeight) * 0.95;
  height = width;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Fill background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // Spirograph setup (new API: pass width/height to constructor)
  spiro = new Spirograph(arrayToJs(segments), speed, Math.floor(width * dpr), Math.floor(height * dpr));
  stepsPerFrame = Math.max(1, Math.round(speed * 20));
  scale = computeScale(segments, width, height);
  imageData = ctx.createImageData(Math.floor(width * dpr), Math.floor(height * dpr));

  // Start animation
  if (animationId) cancelAnimationFrame(animationId);
  draw();
}

function draw() {
  spiro.draw_points(stepsPerFrame, scale);
  // Get buffer from wasm and copy to ImageData
  const buffer = spiro.getPixelBuffer();
  imageData.data.set(buffer);
  ctx.putImageData(imageData, 0, 0);
  animationId = requestAnimationFrame(draw);
}

// Helper: Convert JS array of segments to js_sys::Array for Rust
function arrayToJs(segments) {
  return Object.assign(
    [],
    segments.map(s => ({
      length: s.length,
      angle: s.angle,
      angularSpeed: s.angularSpeed,
      alpha: s.alpha,
      colorSpeed: s.colorSpeed,
    }))
  );
}

// Helper: Compute scale so the chain fits the canvas
function computeScale(segments, width, height) {
  const totalLength = segments.reduce((sum, seg) => sum + Math.abs(seg.length), 0);
  const margin = 0.05;
  const maxRadius = Math.min(width, height) * (0.5 - margin);
  return totalLength > 0 ? maxRadius / totalLength : 1;
}