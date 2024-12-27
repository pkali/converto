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

/**
 * Creates a converter DOM block and attaches drag logic.
 * @param {Object} opts 
 *   parentId       : string  (ID of a parent container in the HTML to append to)
 *   converterId    : string  (unique ID for the .converter element)
 *   leftLabel      : string  (e.g., "football fields")
 *   rightLabel     : string  (e.g., "acres")
 *   initialLeftValue : number
 *   pxPerUnit      : number
 *   convertFn      : function (maps leftValue -> rightValue)
 *   minValue       : number
 *   maxValue       : number
 */
function addConverter(opts) {
    const parentEl = document.getElementById(opts.parentId);
    if (!parentEl) {
        console.error(`Parent element #${opts.parentId} not found.`);
        return;
    }

    // 1. Create the outer converter container <div class="converter" id="...">
    const converterDiv = document.createElement('div');
    converterDiv.classList.add('converter');
    converterDiv.id = opts.converterId;
    //converterDiv.id = opts.leftLabel

    // 2. Create the LEFT .unit
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('unit', 'left');

    const leftValueSpan = document.createElement('span');
    const leftValueId = opts.converterId + '_leftValue';
    leftValueSpan.classList.add('value');
    leftValueSpan.id = leftValueId;        // e.g. "fieldConverter_leftValue"
    leftValueSpan.textContent = opts.initialLeftValue;

    const leftLabelSpan = document.createElement('span');
    leftLabelSpan.classList.add('label');
    leftLabelSpan.textContent = opts.leftLabel; // e.g. "football fields"

    leftDiv.appendChild(leftValueSpan);
    leftDiv.appendChild(leftLabelSpan);

    // 3. Create the SWITCH arrow
    const switchDiv = document.createElement('div');
    switchDiv.classList.add('switch');
    const switchSpan = document.createElement('span');
    switchSpan.textContent = '↔';
    switchDiv.appendChild(switchSpan);

    // 4. Create the RIGHT .unit
    const rightDiv = document.createElement('div');
    rightDiv.classList.add('unit', 'right');

    const rightValueSpan = document.createElement('span');
    const rightValueId = opts.converterId + '_rightValue';
    rightValueSpan.classList.add('value');
    rightValueSpan.id = rightValueId;     // e.g. "fieldConverter_rightValue"
    rightValueSpan.textContent = '0';     // placeholder, will get updated by setupConverter

    const rightLabelSpan = document.createElement('span');
    rightLabelSpan.classList.add('label');
    rightLabelSpan.textContent = opts.rightLabel; // e.g. "acres"

    rightDiv.appendChild(rightValueSpan);
    rightDiv.appendChild(rightLabelSpan);

    // 5. Assemble converter DIV
    converterDiv.appendChild(leftDiv);
    converterDiv.appendChild(switchDiv);
    converterDiv.appendChild(rightDiv);

    // 6. Append to parent
    parentEl.appendChild(converterDiv);

    // 7. Finally, call your existing pointer-drag setup
    setupConverter({
        containerId: opts.converterId,
        leftValueId: leftValueId,
        rightValueId: rightValueId,
        initialLeftValue: opts.initialLeftValue,
        pxPerUnit: opts.pxPerUnit,
        convertFn: opts.convertFn,
        minValue: opts.minValue,
        maxValue: opts.maxValue
    });
}

const conversions = [
    {
        converterId: 'tempConverter',
        leftLabel: '°F',
        rightLabel: '°C',
        initialLeftValue: 72,
        pxPerUnit: 10,
        convertFn: (x) => (x - 32) * 5 / 9,
        minValue: -459.67,
        maxValue: 2000
    },
    {
        converterId: 'distConverter',
        leftLabel: 'miles (mi)',
        rightLabel: 'km',
        initialLeftValue: 10,
        pxPerUnit: 5,
        convertFn: (x) => x * 1.60934,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'weightConverter',
        leftLabel: 'pounds (lb)',
        rightLabel: 'kg',
        initialLeftValue: 3,
        pxPerUnit: 10,
        convertFn: (x) => x * 0.453592,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'galConverter',
        leftLabel: 'gallon',
        rightLabel: 'l',
        initialLeftValue: 1,
        pxPerUnit: 10,
        convertFn: (x) => x * 3.78541178,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'ozConverter',
        leftLabel: 'ounce (oz)',
        rightLabel: 'g',
        initialLeftValue: 6,
        pxPerUnit: 10,
        convertFn: (x) => x * 28.3495,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'flozConverter',
        leftLabel: 'fluid oz (fl oz)',
        rightLabel: 'ml',
        initialLeftValue: 6,
        pxPerUnit: 10,
        convertFn: (x) => x * 29.5735,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'inchConverter',
        leftLabel: 'inches (in)',
        rightLabel: 'cm',
        initialLeftValue: 4,
        pxPerUnit: 5,
        convertFn: (x) => x * 2.54,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'sqftConverter',
        leftLabel: 'square ft',
        rightLabel: 'm²',
        initialLeftValue: 1000,
        pxPerUnit: 1,
        convertFn: (x) => x * 0.092903,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'yardConverter',
        leftLabel: 'yards',
        rightLabel: 'm',
        initialLeftValue: 100,
        pxPerUnit: 5,
        convertFn: (x) => x * 0.9144,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'mpgConverter',
        leftLabel: 'Miles per gallon',
        rightLabel: 'l/100km',
        initialLeftValue: 30,
        pxPerUnit: 5,
        convertFn: (x) => 235.215 / x,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'psiConverter',
        leftLabel: 'psi',
        rightLabel: 'bar',
        initialLeftValue: 35,
        pxPerUnit: 5,
        convertFn: (x) => x * 0.0689476,
        minValue: 0,
        maxValue: 100000
    },
    {
        converterId: 'acreConverter',
        leftLabel: 'acres',
        rightLabel: 'hectares',
        initialLeftValue: 400,
        pxPerUnit: 10,
        convertFn: (x) => x * 0.40468564224,
        minValue: 0,
        maxValue: 10000
    },
    {
        converterId: 'footballConverter',
        leftLabel: 'football fields',
        rightLabel: 'hectares',
        initialLeftValue: 1,
        pxPerUnit: 10,
        convertFn: (x) => x * 0.53,
        minValue: 0,
        maxValue: 10000
    },
];


// Once DOM is loaded...
document.addEventListener('DOMContentLoaded', () => {
    conversions.forEach((c) => {
        addConverter({
            parentId: 'convertersParent',
            ...c
        });
    });
});
