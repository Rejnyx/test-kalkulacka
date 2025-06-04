const display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

function appendNumber(number) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    if (display.value === '0' && number !== '.') currentInput = ''; // Prevent multiple leading zeros unless it's a decimal
    if (number === '.' && display.value.includes('.')) return; // Prevent multiple decimal points
    display.value += number;
    currentInput = display.value;
}

function appendOperator(op) {
    if (currentInput === '' && op === '-') { // Allow negative numbers
        display.value = '-';
        currentInput = '-';
        return;
    }
    if (currentInput === '' || currentInput === '-') return; // Don't allow operator if no number or just a minus sign
    if (operator !== '' && !shouldResetDisplay) { // If there's an existing operator and we haven't just calculated
        calculateResult(); // Calculate the previous operation first
    }
    operator = op;
    previousInput = display.value;
    shouldResetDisplay = true;
}

function calculateResult() {
    if (previousInput === '' || operator === '' || currentInput === '' || (previousInput === '-' && operator !== '')) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) {
        display.value = 'Chyba';
        resetCalculatorState();
        return;
    }

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Nelze dělit nulou';
                resetCalculatorState();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = (prev / 100) * current; // Or prev % current depending on desired % behavior
            break;
        default:
            return;
    }
    display.value = parseFloat(result.toFixed(10)); // Limit decimal places and remove trailing zeros
    currentInput = display.value;
    operator = '';
    previousInput = '';
    shouldResetDisplay = true; // Next number input should clear the display
}

function clearDisplay() {
    display.value = '';
    resetCalculatorState();
}

function deleteLast() {
    if (shouldResetDisplay) { // If result is shown, DEL clears it
        clearDisplay();
        return;
    }
    display.value = display.value.slice(0, -1);
    currentInput = display.value;
}

function resetCalculatorState() {
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

// Add event listeners for keyboard input
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === '%') {
        appendOperator('%');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent default form submission if inside one
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
});
