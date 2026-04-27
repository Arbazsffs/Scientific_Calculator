let currentInput = "0";
let isScientific = false;

const mainDisplay = document.getElementById('main-display');
const historyDisplay = document.getElementById('history');
const modeLabel = document.getElementById('mode-label');
const keypad = document.getElementById('keypad');
const container = document.querySelector('.calc-container');

function toggleMode() {
    isScientific = !isScientific;
    if (isScientific) {
        keypad.classList.add('scientific');
        container.classList.add('scientific');
        modeLabel.innerText = "Scientific Mode";
    } else {
        keypad.classList.remove('scientific');
        container.classList.remove('scientific');
        modeLabel.innerText = "Standard Mode";
    }
}

function append(value) {
    if (currentInput === "0" && value !== ".") currentInput = value;
    else currentInput += value;
    updateDisplay();
}

function clearAll() {
    currentInput = "0";
    historyDisplay.innerText = "";
    updateDisplay();
}

function backspace() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    updateDisplay();
}

function updateDisplay() {
    let displayFormat = currentInput
        .replace(/\*/g, ' × ')
        .replace(/\//g, ' ÷ ')
        .replace(/Math\.PI/g, 'π')
        .replace(/Math\.E/g, 'e');
    mainDisplay.innerText = displayFormat;

    // ADD THIS LINE: Automatically scroll to the far right
    mainDisplay.scrollLeft = mainDisplay.scrollWidth;
}

function calculate() {
    try {
        const result = new Function('return ' + currentInput)();
        currentInput = Number.isInteger(result) ? result.toString() : result.toFixed(4);
        updateDisplay();
    } catch (e) {
        mainDisplay.innerText = "Error";
        currentInput = "0";
    }
}

function sciOp(op) {
    let val = parseFloat(currentInput);
    let res = 0;
    switch(op) {
        case 'sin': res = Math.sin(val * Math.PI / 180); break;
        case 'cos': res = Math.cos(val * Math.PI / 180); break;
        case 'tan': res = Math.tan(val * Math.PI / 180); break;
        case 'log': res = Math.log10(val); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'pow': res = Math.pow(val, 2); break;
        case 'exp': res = Math.exp(val); break;
    }
    currentInput = res.toString();
    updateDisplay();
}

document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key)) append(e.key);
    else if (e.key === ".") append(".");
    else if (e.key === "+") append("+");
    else if (e.key === "-") append("-");
    else if (e.key === "*") append("*");
    else if (e.key === "/") { e.preventDefault(); append("/"); }
    else if (e.key === "Enter") { e.preventDefault(); calculate(); }
    else if (e.key === "Backspace") backspace();
});