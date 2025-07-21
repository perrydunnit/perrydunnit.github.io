// UI control panel creation and event handling
import { segments, setSegments, restartSpirograph } from './spirograph.js';

function createSegmentControl(segment, index, onChange, onRemove) {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column'; // Stack vertically
  wrapper.style.alignItems = 'flex-start';
  wrapper.style.gap = '0.5em';
  wrapper.style.marginBottom = '0.5em';

  // Length
  const lengthInput = document.createElement('input');
  lengthInput.type = 'number';
  lengthInput.min = 1;
  lengthInput.max = 500;
  lengthInput.step = 1;
  lengthInput.value = segment.length;
  lengthInput.style.width = '4em';
  lengthInput.title = 'Length';
  lengthInput.addEventListener('input', () => {
    onChange(index, { ...segment, length: parseFloat(lengthInput.value) });
  });

  // Angular speed
  const speedInput = document.createElement('input');
  speedInput.type = 'number';
  speedInput.step = '0.01';
  speedInput.value = segment.angularSpeed;
  speedInput.style.width = '4em';
  speedInput.title = 'Angular Speed';
  speedInput.addEventListener('input', () => {
    onChange(index, { ...segment, angularSpeed: parseFloat(speedInput.value) });
  });

  // Color
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  // Convert color name or rgb to hex if needed
  try {
    colorInput.value = segment.color.startsWith('#') ? segment.color : '#ff0000';
  } catch {
    colorInput.value = '#ff0000';
  }
  colorInput.title = 'Color';
  colorInput.addEventListener('input', () => {
    onChange(index, { ...segment, color: colorInput.value });
  });

  // Alpha (opacity)
  const alphaInput = document.createElement('input');
  alphaInput.type = 'number';
  alphaInput.min = 0;
  alphaInput.max = 100;
  alphaInput.step = 1;
  alphaInput.value = segment.alpha !== undefined ? segment.alpha : 100;
  alphaInput.style.width = '4em';
  alphaInput.title = 'Alpha (opacity %)';
  alphaInput.addEventListener('input', () => {
    let val = parseInt(alphaInput.value);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 100) val = 100;
    onChange(index, { ...segment, alpha: val });
  });

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = '✕';
  removeBtn.title = 'Remove segment';
  removeBtn.style.marginLeft = '0.5em';
  removeBtn.style.background = '#222';
  removeBtn.style.color = '#fff';
  removeBtn.style.border = 'none';
  removeBtn.style.borderRadius = '4px';
  removeBtn.style.cursor = 'pointer';
  removeBtn.addEventListener('click', () => onRemove(index));

  wrapper.append(
    document.createTextNode(`Length:`), lengthInput,
    document.createTextNode(`Speed:`), speedInput,
    document.createTextNode(`Color:`), colorInput,
    document.createTextNode(`Alpha:`), alphaInput,
    removeBtn
  );
  return wrapper;
}

export function createControlPanel() {
  const oldPanel = document.getElementById('spiro-controls');
  if (oldPanel) oldPanel.remove();
  const panel = document.createElement('div');
  panel.id = 'spiro-controls';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.gap = '1em';
  panel.style.margin = '1em auto';

  // Segment controls
  let currentSegments = segments.map(s => ({ ...s }));
  function updateSegment(idx, newSeg) {
    currentSegments[idx] = newSeg;
    setSegments(currentSegments.map(s => ({ ...s })));
    restartSpirograph();
    renderSegments();
  }
  function removeSegment(idx) {
    currentSegments.splice(idx, 1);
    setSegments(currentSegments.map(s => ({ ...s })));
    restartSpirograph();
    renderSegments();
  }
  function addSegment() {
    currentSegments.push({ length: 50, angle: 0, angularSpeed: 0.05, color: '#00ffff' });
    setSegments(currentSegments.map(s => ({ ...s })));
    restartSpirograph();
    renderSegments();
  }
  const segmentsDiv = document.createElement('div');
  function renderSegments() {
    segmentsDiv.innerHTML = '';
    currentSegments.forEach((seg, idx) => {
      segmentsDiv.appendChild(createSegmentControl(seg, idx, updateSegment, removeSegment));
    });
  }
  renderSegments();
  panel.appendChild(segmentsDiv);

  // Add segment button
  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Add Segment';
  addBtn.style.background = '#26a69a';
  addBtn.style.color = '#fff';
  addBtn.style.border = 'none';
  addBtn.style.borderRadius = '4px';
  addBtn.style.padding = '0.5em 1em';
  addBtn.style.cursor = 'pointer';
  addBtn.addEventListener('click', addSegment);
  panel.appendChild(addBtn);

  // Mount in side menu or body
  const sideMenu = document.getElementById('side-menu-content');
  if (sideMenu) {
    sideMenu.innerHTML = '';
    sideMenu.appendChild(panel);
  } else {
    document.body.appendChild(panel);
  }
}
