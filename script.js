/**
 * Creates a horizontal drag-based converter.
 * @param {Object} opts
 *   containerId  : string (the ID of the .converter div)
 *   leftValueId  : string (the ID of the left <span>)
 *   rightValueId : string (the ID of the right <span>)
 *   initialLeftValue : number (the initial numeric value)
 *   pxPerUnit : number (how many pixels per 1 unit of leftValue)
 *   convertFn : function (converts leftValue to rightValue)
 *   minValue : minimum displayed left value
 *   maxValue : maximum displayed left value
 */
function setupConverter(opts) {
    const container = document.getElementById(opts.containerId);
    const leftEl = document.getElementById(opts.leftValueId);
    const rightEl = document.getElementById(opts.rightValueId);
  
    // If a min or max is not provided, fall back to something sensible
    const minValue = (typeof opts.minValue === 'number') ? opts.minValue : -Infinity;
    const maxValue = (typeof opts.maxValue === 'number') ? opts.maxValue : +Infinity;
  
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
      let newLeftValue = startLeftValue + (deltaX / opts.pxPerUnit);
  
      // **Clamp** newLeftValue:
      newLeftValue = Math.max(minValue, Math.min(maxValue, newLeftValue));
      currentLeftValue = newLeftValue;
  
      // Update display
      leftEl.textContent = currentLeftValue.toFixed(1);
      rightEl.textContent = opts.convertFn(currentLeftValue).toFixed(1);
    });
  
    container.addEventListener('pointerup', (event) => {
      container.releasePointerCapture(event.pointerId);
  
      // If you also do snapping, apply it after the clamp:
      // currentLeftValue = Math.round(currentLeftValue); // for example
      // currentLeftValue = Math.max(minValue, Math.min(maxValue, currentLeftValue));
  
      leftEl.textContent = currentLeftValue.toFixed(1);
      rightEl.textContent = opts.convertFn(currentLeftValue).toFixed(1);
    });
  }

// Fahrenheit → Celsius
setupConverter({
    containerId: 'tempConverter',
    leftValueId: 'tempLeftValue',
    rightValueId: 'tempRightValue',
    initialLeftValue: 72,
    pxPerUnit: 4,
    convertFn: (f) => (f - 32) * 5 / 9,
    minValue: -459.67
});

// Miles → Km
setupConverter({
    containerId: 'distConverter',
    leftValueId: 'distLeftValue',
    rightValueId: 'distRightValue',
    initialLeftValue: 10,
    pxPerUnit: 2,
    convertFn: (mi) => mi * 1.60934,
    minValue: 0
});

// Galons → liters
setupConverter({
    containerId: 'volConverter',
    leftValueId: 'volLeftValue',
    rightValueId: 'volRightValue',
    initialLeftValue: 1,
    pxPerUnit: 10,
    convertFn: (ga) => ga * 3.78541,
    minValue: 0
});

setupConverter({
    containerId: 'areaConverter',
    leftValueId: 'areaLeftValue',    // e.g. "acres"
    rightValueId: 'areaRightValue',  // e.g. "hectares"
    initialLeftValue: 1,
    pxPerUnit: 2,                     // adjust as needed for the “feel” of dragging
    convertFn: (acres) => acres * 0.40468564224,
    minValue: 0,                      // land area can't be negative
    maxValue: 10000                   // or whatever upper bound you want
  });

  setupConverter({
    containerId: 'fieldConverter',
    leftValueId: 'fieldLeftValue',     // e.g. "football fields"
    rightValueId: 'fieldRightValue',   // e.g. "acres" or "ha"
    initialLeftValue: 1,
    pxPerUnit: 2, 
    convertFn: (fields) => fields * 1.32, // if you want to display acres
    minValue: 0,
    maxValue: 10000
  });