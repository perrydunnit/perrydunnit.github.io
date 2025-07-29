// Entry point: imports and initializes everything
import { createCanvases } from './canvas-setup.js';
import { startSpirograph, restartSpirograph } from './spirograph.js';
import { createControlPanel } from './controls.js';

// Initial setup
createCanvases();
createControlPanel();
startSpirograph();

window.addEventListener('resize', () => {
  createCanvases();
  restartSpirograph();
});

// Remove custom hamburger/side menu logic since Materialize handles it
