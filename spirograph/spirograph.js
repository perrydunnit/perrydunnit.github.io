// Spirograph math, drawing, and animation logic
import { baseCanvas, overlayCanvas, getSpirographParams } from './canvas-setup.js';

export let RADIUS_RATIO = .47;
export let PEND_RATIO = 0.9;
export let t = 0;
export let speed = 0.5;
export let animationId = null;
export let stepsPerFrame = 1;
export let colorSpeed = 0.5;
export let innerEllipseX = 1;
export let innerEllipseY = 1;
export let colorAlpha = 1.0;

export function setRatios(r, d) {
  RADIUS_RATIO = r;
  PEND_RATIO = d;
}
export function setSpeed(s) {
  speed = s;
  stepsPerFrame = Math.max(1, Math.round(speed / 0.01));
}
export function setColorSpeed(cs) {
  colorSpeed = cs;
}
export function setInnerEllipse(x, y) {
  innerEllipseX = x;
  innerEllipseY = y;
}
export function setColorAlpha(a) {
  colorAlpha = a;
}

export function getGradientColor(t) {
  const hue = ((colorSpeed * t * 180 / Math.PI) % 360 + 360) % 360;
  return `hsla(${hue}, 100%, 50%, ${colorAlpha})`;
}

function getParamsAndContexts() {
  const base = baseCanvas;
  const overlay = overlayCanvas;
  const baseCtx = base.getContext('2d');
  const overlayCtx = overlay.getContext('2d');
  const { R, r, d } = getSpirographParams(base.width, RADIUS_RATIO, PEND_RATIO);
  return { base, overlay, baseCtx, overlayCtx, R, r, d };
}

function drawOuterCircle(overlayCtx, base, R) {
  overlayCtx.beginPath();
  overlayCtx.arc(base.width / 2, base.height / 2, R, 0, 2 * Math.PI);
  overlayCtx.strokeStyle = '#888';
  overlayCtx.lineWidth = 2;
  overlayCtx.stroke();
}
function drawInnerEllipse(overlayCtx, base, R, r, d, innerEllipseX, innerEllipseY, t) {
  if (window.showSpirographCircles) {
    const rx = r * innerEllipseX;
    const ry = r * innerEllipseY;
    const r_ellipse = (rx * ry) / Math.sqrt((ry * Math.cos(t)) ** 2 + (rx * Math.sin(t)) ** 2);
    const centerDist = R - r_ellipse;
    const cx = base.width / 2 + centerDist * Math.cos(t);
    const cy = base.height / 2 + centerDist * Math.sin(t);
    const arcLen = centerDist * t;
    const phi = -arcLen / (ellipsePerimeter(rx, ry) / (2 * Math.PI));
    overlayCtx.save();
    overlayCtx.translate(cx, cy);
    overlayCtx.rotate(phi);
    overlayCtx.beginPath();
    overlayCtx.ellipse(0, 0, rx, ry, 0, 0, 2 * Math.PI);
    overlayCtx.strokeStyle = '#aaa';
    overlayCtx.lineWidth = 1;
    overlayCtx.stroke();
    overlayCtx.restore();
  }
}

export function startSpirograph() {
  const { base, baseCtx, overlay, overlayCtx, R } = getParamsAndContexts();
  baseCtx.fillStyle = '#000';
  baseCtx.fillRect(0, 0, base.width, base.height);
  baseCtx.save();
  overlay.style.display = window.showSpirographCircles ? '' : 'none';
  overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
  if (window.showSpirographCircles) {
    drawOuterCircle(overlayCtx, base, R);
  }
  t = 0;
  stepsPerFrame = Math.max(1, Math.round(speed / 0.01));
  if (animationId) cancelAnimationFrame(animationId);
  drawSpirograph();
}

// Helper: Ramanujan's approximation for ellipse perimeter
function ellipsePerimeter(a, b) {
  return Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
}

export function drawSpirograph() {
  const { base, overlay, baseCtx, overlayCtx, R, r, d } = getParamsAndContexts();
  let x, y;
  // Ellipse axes
  const rx = r * innerEllipseX;
  const ry = r * innerEllipseY;
  // Perimeter for rolling
  const ellipseP = ellipsePerimeter(rx, ry);
  const outerRadius = R - r;
  for (let i = 0; i < stepsPerFrame; i++) {
    const theta = t;
    // Distance from ellipse center to tangent point in direction theta
    const r_ellipse = (rx * ry) / Math.sqrt((ry * Math.cos(theta)) ** 2 + (rx * Math.sin(theta)) ** 2);
    // Center of ellipse on outer circle
    const centerDist = R - r_ellipse;
    const cx = centerDist * Math.cos(theta);
    const cy = centerDist * Math.sin(theta);
    // Arc length traveled along outer circle
    const arcLen = centerDist * theta;
    // Rotation of ellipse: roll without slip
    const phi = -arcLen / (ellipseP / (2 * Math.PI));
    // Pen position in ellipse's local frame
    const penX = d * Math.cos(phi);
    const penY = d * Math.sin(phi);
    // Rotate pen point by ellipse orientation
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    // Scale for ellipse axes
    const px = rx * (penX / r);
    const py = ry * (penY / r);
    // Rotate and translate to world
    x = cx + cosPhi * px - sinPhi * py;
    y = cy + sinPhi * px + cosPhi * py;
    baseCtx.beginPath();
    baseCtx.arc(base.width / 2 + x, base.height / 2 + y, 1, 0, 2 * Math.PI);
    baseCtx.fillStyle = getGradientColor(t);
    baseCtx.globalAlpha = 1.0;
    baseCtx.fill();
    t += 0.001;
  }
  // Hide or show overlay based on checkbox
  overlay.style.display = window.showSpirographCircles ? '' : 'none';
  if (window.showSpirographCircles) {
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    drawOuterCircle(overlayCtx, base, R);
    drawInnerEllipse(overlayCtx, base, R, r, d, innerEllipseX, innerEllipseY, t);
    // Draw the moving inner ellipse, rotated
    const theta = t;
    const rx = r * innerEllipseX;
    const ry = r * innerEllipseY;
    const r_ellipse = (rx * ry) / Math.sqrt((ry * Math.cos(theta)) ** 2 + (rx * Math.sin(theta)) ** 2);
    const centerDist = R - r_ellipse;
    const cx = base.width / 2 + centerDist * Math.cos(theta);
    const cy = base.height / 2 + centerDist * Math.sin(theta);
    const arcLen = centerDist * theta;
    const phi = -arcLen / (ellipsePerimeter(rx, ry) / (2 * Math.PI));
    // Draw pen point
    const penX = d * Math.cos(phi);
    const penY = d * Math.sin(phi);
    const px = rx * (penX / r);
    const py = ry * (penY / r);
    const penWorldX = cx + Math.cos(phi) * px - Math.sin(phi) * py;
    const penWorldY = cy + Math.sin(phi) * px + Math.cos(phi) * py;
    overlayCtx.save();
    overlayCtx.globalAlpha = 1.0;
    overlayCtx.beginPath();
    overlayCtx.arc(penWorldX, penWorldY, 2, 0, 2 * Math.PI);
    overlayCtx.fillStyle = 'red';
    overlayCtx.fill();
    overlayCtx.restore();
  }
  animationId = requestAnimationFrame(drawSpirograph);
}

export function restartSpirograph() {
  t = 0;
  if (animationId) cancelAnimationFrame(animationId);
  startSpirograph();
}
