/**
 * Creates a horizontal drag-based converter.
 * @param {Object} opts
 *   containerId  : string (the ID of the .converter div)
 *   leftValueId  : string (the ID of the left <span>)
 *   rightValueId : string (the ID of the right <span>)
 *   initialLeftValue : number (the initial numeric value)
 *   pxPerUnit : number (how many pixels per 1 unit of leftValue)
 *   convertFn : function (converts leftValue to rightValue)
 */
function setupConverter(opts) {
    const container = document.getElementById(opts.containerId);
    const leftEl    = document.getElementById(opts.leftValueId);
    const rightEl   = document.getElementById(opts.rightValueId);
  
    let currentLeftValue = opts.initialLeftValue;
    let startX = 0;
    let startLeftValue = currentLeftValue;
  
    // Initialize display
    leftEl.textContent = currentLeftValue.toFixed(1);
    rightEl.textContent = opts.convertFn(currentLeftValue).toFixed(1);
  
    container.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      startX = event.clientX;
      startLeftValue = currentLeftValue;
      container.setPointerCapture(event.pointerId);
    });
  
    container.addEventListener('pointermove', (event) => {
      if (event.pressure === 0) return;
      event.preventDefault();
      const deltaX = event.clientX - startX;
  
      currentLeftValue = startLeftValue + (deltaX / opts.pxPerUnit);
      leftEl.textContent = currentLeftValue.toFixed(1);
      rightEl.textContent = opts.convertFn(currentLeftValue).toFixed(1);
    });
  
    container.addEventListener('pointerup', (event) => {
      container.releasePointerCapture(event.pointerId);
  
      // Rounding logic: e.g., round to nearest whole number
      currentLeftValue = Math.round(currentLeftValue);
      leftEl.textContent = currentLeftValue.toFixed(1);
  
      // Re-calc right value (km, in this example)
      const rightValue = opts.convertFn(currentLeftValue);
      rightEl.textContent = rightValue.toFixed(1);
    });
  }

  // Fahrenheit → Celsius
setupConverter({
    containerId: 'tempConverter',
    leftValueId: 'tempLeftValue',
    rightValueId: 'tempRightValue',
    initialLeftValue: 72,
    pxPerUnit: 10,
    convertFn: (f) => (f - 32) * 5/9
  });
  
  // Miles → Km
  setupConverter({
    containerId: 'distConverter',
    leftValueId: 'distLeftValue',
    rightValueId: 'distRightValue',
    initialLeftValue: 10,
    pxPerUnit: 5,
    convertFn: (mi) => mi * 1.60934
  });