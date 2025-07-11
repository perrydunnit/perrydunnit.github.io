// UI control panel creation and event handling
import { setRatios, setSpeed, setColorSpeed, setInnerEllipse, setColorAlpha, restartSpirograph, RADIUS_RATIO, PEND_RATIO, speed, colorSpeed } from './spirograph.js';

function getCurrentRadiusRatio() { return RADIUS_RATIO; }
function getCurrentPendRatio() { return PEND_RATIO; }

// Helper: labeled slider + number input (synced)
function createSliderWithInput({
  label, min, max, step, value, onChange
}) {
  const labelElem = document.createElement('label');
  labelElem.textContent = label;
  labelElem.style.display = 'block';
  labelElem.style.marginBottom = '0';
  labelElem.style.lineHeight = '1.1';
  labelElem.appendChild(document.createElement('br'));

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = value;
  slider.style.width = sliderWidth;
  slider.style.marginRight = '0.5em';

  const input = document.createElement('input');
  input.type = 'number';
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  input.style.width = '4em';
  input.style.textAlign = 'right';

  slider.addEventListener('input', () => {
    input.value = slider.value;
    onChange(parseFloat(slider.value));
  });
  input.addEventListener('input', () => {
    slider.value = input.value;
    onChange(parseFloat(input.value));
  });

  const flex = document.createElement('div');
  flex.style.display = 'flex';
  flex.style.alignItems = 'center';
  flex.style.gap = '0.3em';
  flex.style.justifyContent = 'space-between';
  flex.append(slider, input);
  labelElem.appendChild(flex);
  return { labelElem, slider, input };
}

const sliderWidth = '180px';
// Helper: labeled slider + value display (synced)
function createSliderWithValue({
  label, min, max, step, value, onChange
}) {
  const labelElem = document.createElement('label');
  labelElem.textContent = label;
  labelElem.style.display = 'block';
  labelElem.style.marginBottom = '0';
  labelElem.style.lineHeight = '1.1';
  labelElem.appendChild(document.createElement('br'));

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = value;
  slider.style.width = sliderWidth;

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = value;
  valueDisplay.style.width = '4em';
  valueDisplay.style.textAlign = 'right';
  valueDisplay.style.display = 'inline-block';

  slider.addEventListener('input', () => {
    valueDisplay.textContent = slider.value;
    onChange(parseFloat(slider.value));
  });

  const flex = document.createElement('div');
  flex.style.display = 'flex';
  flex.style.alignItems = 'center';
  flex.style.gap = '0.3em';
  flex.style.justifyContent = 'space-between';
  flex.append(slider, valueDisplay);
  labelElem.appendChild(flex);
  return { labelElem, slider, valueDisplay };
}

// Helper: labeled number input
function createNumberInput({ label, min, max, step, value, onChange }) {
  const labelElem = document.createElement('label');
  labelElem.textContent = label;
  labelElem.style.display = 'block';
  labelElem.style.marginBottom = '0';
  labelElem.style.lineHeight = '1.1';
  labelElem.appendChild(document.createElement('br'));

  const input = document.createElement('input');
  input.type = 'number';
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = value;
  input.style.width = '4em';
  input.style.textAlign = 'right';
  input.addEventListener('input', () => onChange(parseFloat(input.value)));

  labelElem.appendChild(input);
  return { labelElem, input };
}

export function createControlPanel() {
  const oldPanel = document.getElementById('spiro-controls');
  if (oldPanel) oldPanel.remove();
  const panel = document.createElement('div');
  panel.id = 'spiro-controls';
  panel.style.display = 'flex';
  panel.style.gap = '2em';
  panel.style.justifyContent = 'center';
  panel.style.alignItems = 'center';
  panel.style.margin = '1em auto';

  // RADIUS_RATIO controls (fraction only, no value display)
  const rLabel = document.createElement('label');
  rLabel.textContent = 'Inner/Outer-Circle Ratio:';
  rLabel.style.display = 'block';
  rLabel.style.marginBottom = '0';
  rLabel.style.lineHeight = '1.1';
  const rNum = document.createElement('input');
  rNum.type = 'number';
  rNum.value = RADIUS_RATIO * 100;
  rNum.style.width = '5em';
  const rDen = document.createElement('input');
  rDen.type = 'number';
  rDen.value = 100;
  rDen.style.width = '5em';
  const rFrac = document.createElement('span');
  rFrac.textContent = '/';
  const rInputsDiv = document.createElement('div');
  rInputsDiv.append(rNum, rFrac, rDen);
  rInputsDiv.style.margin = '0';
  rInputsDiv.style.padding = '0';
  rInputsDiv.style.lineHeight = '1.1';
  rInputsDiv.style.display = 'flex';
  rInputsDiv.style.gap = '0.3em';
  rLabel.appendChild(rInputsDiv);
  function updateFromRFrac() {
    const ratio = rNum.value / rDen.value;
    setRatios(ratio, PEND_RATIO);
    restartSpirograph();
  }
  rNum.addEventListener('input', updateFromRFrac);
  rDen.addEventListener('input', updateFromRFrac);

  // Pen distance (PEND_RATIO) slider + number input
  const d = createSliderWithInput({
    label: 'Pen distance from circle center:',
    min: 0.01, max: 2, step: 0.01, value: PEND_RATIO,
    onChange: v => { setRatios(RADIUS_RATIO, v); restartSpirograph(); }
  });

  // Drawing speed slider + value display
  const speedCtrl = createSliderWithValue({
    label: 'Drawing Speed:',
    min: 0, max: 1000, step: 1, value: speed,
    onChange: v => setSpeed(v)
  });

  // Color speed slider + number input
  const colorSpeedCtrl = createSliderWithInput({
    label: 'Color Speed:',
    min: 0, max: 5, step: 0.01, value: colorSpeed,
    onChange: v => { setColorSpeed(v); restartSpirograph(); }
  });

  // Color alpha slider + number input
  const colorAlphaCtrl = createSliderWithInput({
    label: 'Color Alpha:',
    min: 0, max: 100, step: 0.5, value: 100,
    onChange: v => { setColorAlpha(v / 100); restartSpirograph(); }
  });

  // Inner ellipse controls (now on one line, right-aligned)
  const ellipseFlex = document.createElement('div');
  ellipseFlex.style.display = 'flex';
  ellipseFlex.style.alignItems = 'center';
  ellipseFlex.style.justifyContent = 'space-between';
  ellipseFlex.style.gap = '0.3em';
  ellipseFlex.style.minWidth = sliderWidth;
  const ellipseLabel = document.createElement('span');
  ellipseLabel.textContent = 'Inner X/Y radius:';
  ellipseLabel.style.whiteSpace = 'nowrap';
  const rxInput = document.createElement('input');
  rxInput.type = 'number';
  rxInput.min = 0.1;
  rxInput.max = 2;
  rxInput.step = 0.01;
  rxInput.value = 1;
  rxInput.style.width = '4em';
  rxInput.style.textAlign = 'right';
  const ryInput = document.createElement('input');
  ryInput.type = 'number';
  ryInput.min = 0.1;
  ryInput.max = 2;
  ryInput.step = 0.01;
  ryInput.value = 1;
  ryInput.style.width = '4em';
  ryInput.style.textAlign = 'right';
  rxInput.addEventListener('input', () => {
    setInnerEllipse(parseFloat(rxInput.value), parseFloat(ryInput.value));
    restartSpirograph();
  });
  ryInput.addEventListener('input', () => {
    setInnerEllipse(parseFloat(rxInput.value), parseFloat(ryInput.value));
    restartSpirograph();
  });
  ellipseFlex.append(ellipseLabel, rxInput, ryInput);

  // Screenshot button
  const screenshotBtn = document.createElement('button');
  screenshotBtn.textContent = 'Save PNG';
  screenshotBtn.style.marginLeft = '2em';
  screenshotBtn.addEventListener('click', () => {
    const overlay = document.querySelector('.spiro-canvas:not(#spiroCanvas)');
    if (overlay) overlay.style.display = 'none';
    setTimeout(() => {
      const base = document.getElementById('spiroCanvas');
      const url = base.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'spirograph.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (overlay) overlay.style.display = '';
    }, 50);
  });

  // Show/hide circles checkbox
  // Only set default if not already set
  if (typeof window.showSpirographCircles === 'undefined') {
    window.showSpirographCircles = true;
  }
  // Use a single <label> to wrap both the text and the checkbox for maximum clickability and accessibility
  const showCirclesFlex = document.createElement('div');
  showCirclesFlex.style.display = 'flex';
  showCirclesFlex.style.alignItems = 'center';
  showCirclesFlex.style.justifyContent = 'space-between';
  showCirclesFlex.style.gap = '0.3em';
  showCirclesFlex.style.minWidth = sliderWidth;
  const showCirclesLabel = document.createElement('label');
  showCirclesLabel.style.display = 'flex';
  showCirclesLabel.style.alignItems = 'center';
  showCirclesLabel.style.justifyContent = 'space-between';
  showCirclesLabel.style.gap = '0.3em';
  showCirclesLabel.style.width = '100%';
  showCirclesLabel.style.cursor = 'pointer';
  const showCirclesText = document.createElement('span');
  showCirclesText.textContent = 'Show inner/outer circles:';
  showCirclesText.style.whiteSpace = 'nowrap';
  const showCirclesCheckbox = document.createElement('input');
  showCirclesCheckbox.type = 'checkbox';
  showCirclesCheckbox.checked = window.showSpirographCircles;
  showCirclesCheckbox.style.marginLeft = '0.5em';
  showCirclesCheckbox.style.width = '1.2em';
  showCirclesCheckbox.style.height = '1.2em';
  showCirclesCheckbox.style.cursor = 'pointer';
  showCirclesCheckbox.addEventListener('change', () => {
    window.showSpirographCircles = showCirclesCheckbox.checked;
    restartSpirograph();
  });
  showCirclesLabel.append(showCirclesText, showCirclesCheckbox);
  showCirclesFlex.appendChild(showCirclesLabel);

  // --- URL PARAM SYNC HELPERS ---
  function updateUrlParams(params) {
    const url = new URL(window.location);
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.set(key, params[key]);
      }
    }
    window.history.replaceState({}, '', url);
  }
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      r: params.get('r'),
      d: params.get('d'),
      rx: params.get('rx'),
      ry: params.get('ry'),
      speed: params.get('speed'),
      colorSpeed: params.get('colorSpeed'),
      colorAlpha: params.get('colorAlpha'),
      showCircles: params.get('showCircles'),
    };
  }
  // --- END URL PARAM SYNC HELPERS ---

  // Read initial values from URL if present
  const urlParams = getUrlParams();
  if (urlParams.r) {
    const [num, den] = urlParams.r.split('/');
    if (!isNaN(num) && !isNaN(den)) {
      rNum.value = num;
      rDen.value = den;
      setRatios(num / den, d.input.value);
    }
  }
  if (urlParams.d) {
    d.slider.value = d.input.value = urlParams.d;
    setRatios(rNum.value / rDen.value, urlParams.d);
  }
  if (urlParams.rx) {
    rxInput.value = urlParams.rx;
  }
  if (urlParams.ry) {
    ryInput.value = urlParams.ry;
  }
  if (urlParams.rx || urlParams.ry) {
    setInnerEllipse(parseFloat(rxInput.value), parseFloat(ryInput.value));
  }
  if (urlParams.speed) {
    speedCtrl.slider.value = urlParams.speed;
    speedCtrl.valueDisplay.textContent = urlParams.speed;
    setSpeed(parseFloat(urlParams.speed));
  }
  if (urlParams.colorSpeed) {
    colorSpeedCtrl.slider.value = colorSpeedCtrl.input.value = urlParams.colorSpeed;
    setColorSpeed(parseFloat(urlParams.colorSpeed));
  }
  if (urlParams.colorAlpha) {
    colorAlphaCtrl.slider.value = colorAlphaCtrl.input.value = urlParams.colorAlpha;
    setColorAlpha(parseFloat(urlParams.colorAlpha) / 100);
  }
  if (urlParams.showCircles) {
    showCirclesCheckbox.checked = urlParams.showCircles === '1';
    window.showSpirographCircles = showCirclesCheckbox.checked;
  }
  // Ensure the drawing is updated after loading params
  restartSpirograph();

  // Update URL on any change
  function syncUrl() {
    updateUrlParams({
      r: rNum.value + '/' + rDen.value,
      d: d.input.value,
      rx: rxInput.value,
      ry: ryInput.value,
      speed: speedCtrl.slider.value,
      colorSpeed: colorSpeedCtrl.input.value,
      colorAlpha: colorAlphaCtrl.input.value,
      showCircles: showCirclesCheckbox.checked ? '1' : '0',
    });
  }

  // Attach syncUrl to all relevant controls
  rNum.addEventListener('input', syncUrl);
  rDen.addEventListener('input', syncUrl);
  d.input.addEventListener('input', syncUrl);
  d.slider.addEventListener('input', syncUrl);
  rxInput.addEventListener('input', syncUrl);
  ryInput.addEventListener('input', syncUrl);
  speedCtrl.slider.addEventListener('input', syncUrl);
  colorSpeedCtrl.input.addEventListener('input', syncUrl);
  colorSpeedCtrl.slider.addEventListener('input', syncUrl);
  colorAlphaCtrl.input.addEventListener('input', syncUrl);
  colorAlphaCtrl.slider.addEventListener('input', syncUrl);
  showCirclesCheckbox.addEventListener('change', syncUrl);

  // Layout
  panel.append(rLabel, d.labelElem, ellipseFlex, speedCtrl.labelElem, colorSpeedCtrl.labelElem, colorAlphaCtrl.labelElem, showCirclesFlex, screenshotBtn);
  const sideMenuContent = document.getElementById('side-menu-content');
  if (sideMenuContent) {
    const closeBtn = sideMenuContent.querySelector('.sidenav-close');
    sideMenuContent.innerHTML = '';
    if (closeBtn) sideMenuContent.appendChild(closeBtn);
    panel.style.position = 'relative';
    panel.style.top = '0';
    sideMenuContent.appendChild(panel);
  } else {
    document.body.insertBefore(panel, document.body.firstChild);
  }
}
