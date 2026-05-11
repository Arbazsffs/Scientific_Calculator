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
    if (currentInput === "0" && value !== "." && value !== "±" && value !== "^") {
        currentInput = value;
    } else {
        currentInput += value;
    }
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
    mainDisplay.innerText = currentInput;
    mainDisplay.scrollLeft = mainDisplay.scrollWidth; // Keeps text scrolled to the right
}

function calculate() {
    try {
        historyDisplay.innerText = currentInput + " =";
        
        // 1. Convert display symbols to JavaScript math operators
        let expr = currentInput
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^/g, '**')      // Converts ^ to power operator
            .replace(/√/g, 'sqrt');    // Maps to our custom sqrt function below

        // 2. Define custom math environment (Allows degrees instead of radians)
        const mathFuncs = `
            const sin = (x) => Math.sin(x * Math.PI / 180);
            const cos = (x) => Math.cos(x * Math.PI / 180);
            const tan = (x) => Math.tan(x * Math.PI / 180);
            const log = (x) => Math.log10(x);
            const sqrt = (x) => Math.sqrt(x);
        `;

        // Inner evaluation function
        function evaluateExpression(expression) {
            const result = new Function(mathFuncs + ' return ' + expression)();
            if (isNaN(result) || !isFinite(result)) throw new Error("Invalid");
            // Fix long decimal strings
            return Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(6)).toString();
        }

        // 3. Handle quadratic/dual equations if the ± symbol is present
        if (expr.includes('±')) {
            let exprPlus = expr.replace(/±/g, '+');
            let exprMinus = expr.replace(/±/g, '-');
            let resPlus = evaluateExpression(exprPlus);
            let resMinus = evaluateExpression(exprMinus);
            currentInput = `${resPlus}, ${resMinus}`;
        } else {
            // Standard single evaluation
            currentInput = evaluateExpression(expr);
        }

        updateDisplay();
    } catch (e) {
        mainDisplay.innerText = "Error";
        currentInput = "0";
    }
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (/[0-9]/.test(e.key)) append(e.key);
    else if (e.key === ".") append(".");
    else if (e.key === "+") append("+");
    else if (e.key === "-") append("-");
    else if (e.key === "*") append("×");
    else if (e.key === "/") { e.preventDefault(); append("÷"); }
    else if (e.key === "^") append("^");
    else if (e.key === "(") append("(");
    else if (e.key === ")") append(")");
    else if (e.key === "Enter") { e.preventDefault(); calculate(); }
    else if (e.key === "Backspace") backspace();
});