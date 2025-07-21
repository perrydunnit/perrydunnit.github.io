// Chain of connected segments animation logic
import { baseCanvas } from './canvas-setup.js';
import { dpr } from './canvas-setup.js';

export let segments = [
  { length: 1000, angle: 0, angularSpeed: 1, alpha: 0, colorSpeed: 0 },
  { length: 1000, angle: 0, angularSpeed: -2.00001, alpha: 5, colorSpeed: -10 },
  { length: 1000, angle: 0, angularSpeed: 0.4999, alpha: 8, colorSpeed: 11 },
];
export let speed = 800;
export let animationId = null;
export let stepsPerFrame = 1;
export let colorAlpha = 1.0;
let baseCtx, baseAngle=0;

export function setRatios(r, d) {
  RADIUS_RATIO = r;
  PEND_RATIO = d;
}
export function setSpeed(s) {
  speed = s;
  stepsPerFrame = Math.max(1, Math.round(speed / 0.01));
}
setSpeed(speed);
export function setColorSpeed(cs, seg) {
  seg.colorSpeed = cs;
}
export function setColorAlpha(a, seg) {
  seg.colorAlpha = a;
}

export function setSegments(newSegments) {
  segments = newSegments;
}

export function startSpirograph() {
  baseCtx = baseCanvas.getContext('2d');
  baseCtx.fillStyle = '#000';
  baseCtx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
  if (animationId) cancelAnimationFrame(animationId);
  drawSegmentChain();
}

export function drawSegmentChain() {
  // Dynamically set stepsPerFrame based on speed
  stepsPerFrame = Math.max(1, Math.round(speed * 20));
  const width = baseCanvas.width / dpr;
  const height = baseCanvas.height / dpr;
  // Compute the total length of the chain
  const totalLength = segments.reduce((sum, seg) => sum + Math.abs(seg.length), 0);
  // Leave a small margin (5%)
  const margin = 0.05;
  const maxRadius = Math.min(width, height) * (0.5 - margin);
  const scale = totalLength > 0 ? maxRadius / totalLength : 1;
  for (let step = 0; step < stepsPerFrame; step++) {
    let x = width / 2;
    let y = height / 2;
    let angleSum = 0;
    // Store the first segment's angle before updating
    baseAngle += speed / stepsPerFrame;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      seg.angle = seg.angularSpeed * baseAngle;
      angleSum += seg.angle;
      x += seg.length * scale * Math.cos(angleSum);
      y += seg.length * scale * Math.sin(angleSum);
      // Hue cycles once per full rotation of the first segment if colorSpeed=1
      const hue = ((seg.colorSpeed || 0.5) * baseAngle * 180 / Math.PI) % 360;
      const alpha = (seg.alpha !== undefined ? seg.alpha : 100) / 100;
      baseCtx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
      baseCtx.beginPath();
      baseCtx.arc(x, y, 0.5, 0, 2 * Math.PI);
      baseCtx.fill();
    }
  }
  animationId = requestAnimationFrame(drawSegmentChain);
}

export function restartSpirograph() {
  if (animationId) cancelAnimationFrame(animationId);
  startSpirograph();
}
