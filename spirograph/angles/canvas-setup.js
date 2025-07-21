// Canvas creation, resizing, and layout logic
export const OUTER_MARGIN = 0.95;

export function getMaxSquareSize() {
  const heading = document.querySelector('h1');
  const headingHeight = heading.getBoundingClientRect().bottom;
  // Use OUTER_MARGIN to ensure no scrollbars and consistent sizing
  const availableWidth = window.innerWidth * OUTER_MARGIN;
  // Subtract the space actually used by the heading from the viewport height
  const availableHeight = (window.innerHeight * OUTER_MARGIN) - headingHeight;
  return Math.floor(Math.min(availableWidth, availableHeight));
}

export function getSpirographParams(size, RADIUS_RATIO, PEND_RATIO) {
  const margin = size * (1 - OUTER_MARGIN) / 2;
  const maxRadius = size / 2 - margin;
  let maxR = maxRadius;
  const denom = 1 - RADIUS_RATIO + RADIUS_RATIO * PEND_RATIO;
  if (denom > 0) {
    maxR = Math.min(maxR, maxRadius / denom);
  }
  const rTest = maxR * RADIUS_RATIO;
  const dTest = rTest * PEND_RATIO;
  if (RADIUS_RATIO > 1 && rTest + dTest > maxRadius) {
    maxR = maxRadius / (RADIUS_RATIO + RADIUS_RATIO * PEND_RATIO);
  }
  const R = Math.max(0, maxR);
  const r = R * RADIUS_RATIO;
  const d = r * PEND_RATIO;
  return { R, r, d };
}

export let baseCanvas = null;
export let dpr = 1;

export function createCanvases() {
  document.querySelectorAll('.spiro-canvas').forEach(el => el.remove());
  const size = getMaxSquareSize();
  dpr = window.devicePixelRatio || 1;
  let container = document.getElementById('spiro-canvas-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'spiro-canvas-container';
    container.style.position = 'relative';
    container.style.width = size + 'px';
    container.style.height = size + 'px';
    container.style.margin = '0 auto';
    document.body.appendChild(container);
  } else {
    container.style.width = size + 'px';
    container.style.height = size + 'px';
  }
  container.innerHTML = '';
  baseCanvas = document.createElement('canvas');
  baseCanvas.width = size* dpr;
  baseCanvas.height = size* dpr;
  baseCanvas.id = 'spiroCanvas';
  baseCanvas.className = 'spiro-canvas';
  baseCanvas.style.position = 'absolute';
  baseCanvas.style.left = '0';
  baseCanvas.style.top = '0';
  baseCanvas.style.width = size + 'px';
  baseCanvas.style.height = size + 'px';
  baseCanvas.style.border = '1px solid #333';
  container.appendChild(baseCanvas);
  // Scale contexts for high-DPI
  baseCanvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
}
