// Grab elements
const leftContainer = document.getElementById('leftContainer');
const leftValueEl = document.getElementById('leftValue');
const rightValueEl = document.getElementById('rightValue');

// We'll store the current Fahrenheit value and use that internally
let currentFahrenheit = parseFloat(leftValueEl.textContent);

// Pointers for tracking
let startY = 0;
let startFahrenheit = 0;

// Ratio of pixels dragged to degrees Fahrenheit
// Adjust this so it feels natural
const PIXELS_PER_DEGREE = 10;

leftContainer.addEventListener('pointerdown', (event) => {
  event.preventDefault(); // Prevent default to stop browser scrolling
  startY = event.clientY;
  startFahrenheit = currentFahrenheit;

  // Capture pointer so we continue to get events
  leftContainer.setPointerCapture(event.pointerId);
});

leftContainer.addEventListener('pointermove', (event) => {
  if (event.pressure === 0) {
    // Means pointer isn’t pressed down
    return;
  }
  
  const deltaY = event.clientY - startY;

  // Move in the opposite direction: drag up -> decrease Fahrenheit
  currentFahrenheit = startFahrenheit - (deltaY / PIXELS_PER_DEGREE);
  currentFahrenheit = Math.round(currentFahrenheit * 2) / 2;

  // Update left UI
  leftValueEl.textContent = currentFahrenheit.toFixed(1);

  // Convert to Celsius and update right UI
  const celsiusValue = fahrenheitToCelsius(currentFahrenheit);
  rightValueEl.textContent = celsiusValue.toFixed(1);
});

leftContainer.addEventListener('pointerup', (event) => {
  // Possibly snap to nearest .5 or whole number if you like:
  // currentFahrenheit = Math.round(currentFahrenheit * 2) / 2;

  leftContainer.releasePointerCapture(event.pointerId);
});

// Conversion function
function fahrenheitToCelsius(f) {
  return (f - 32) * 5 / 9;
}