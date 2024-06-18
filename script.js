// Basic arithmetic functions
const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => (num2 === 0 ? "Can't divide by 0" : num1 / num2);

// Perform the operation based on the operator
const operation = (num1, num2, operator) => {
  switch (operator) {
    case "+":
      return add(num1, num2);
    case "-":
      return subtract(num1, num2);
    case "x":
      return multiply(num1, num2);
    default:
      return divide(num1, num2);
  }
};

// Get the first eight digits of a number
const getFirstEightDigits = (num) => {
  let str = num.toString();
  let count = 0;
  let index = 0;

  while (count < 8 && index < str.length) {
    if (str[index] !== ".") count++;
    index++;
  }

  return str.slice(0, index);
};

const screen = document.querySelector(".calc-screen");
let operatorButtonPressed = false;
let equalsButtonPressed = false;
let previousNumber = 0;
let currentNumber = 0;
let operator = "";

// Add event listeners to calculator buttons
const calcButtons = document.querySelectorAll(".button");
calcButtons.forEach((item) => {
  item.addEventListener("click", (event) => {
    // Handle number buttons
    if (event.target.classList.contains("number")) {
      // Reset if the equals button was the last to be pressed
      if (equalsButtonPressed && !operatorButtonPressed) {
        previousNumber = 0;
        currentNumber = 0;
        operator = "";
      }

      // Clear the screen if an operator was last pressed
      if (
        (operatorButtonPressed || equalsButtonPressed) &&
        screen.innerHTML !== "0."
      ) {
        screen.innerHTML = "";
        operatorButtonPressed = false;
        equalsButtonPressed = false;
      }

      // Append the clicked number, but limit to 9 digits
      if (screen.innerHTML.length < 9) {
        if (screen.innerHTML === "0") {
          screen.innerHTML = event.target.textContent; // replace "0" with clicked number
        } else {
          screen.innerHTML += event.target.textContent; // append the clicked number
        }
      }
    }

    // Handle operator buttons (+, -, x, /)
    if (event.target.classList.contains("operator")) {
      operatorButtonPressed = true;

      // If there's a previous number and equals was not last pressed, calculate
      if (previousNumber !== 0 && equalsButtonPressed === false) {
        currentNumber = Number(screen.innerHTML);
        const result = operation(previousNumber, currentNumber, operator);

        // Display error for division by zero
        if (result === "Can't divide by 0") {
          screen.innerHTML = `<span style="font-size: 50px;">${result}</span>`;
        } else if (result.toString().length > 9) {
          // Display error if result is too long
          screen.innerHTML = `<span style="font-size: 26px;">Error: Result too large to display.</span>`;
        } else {
          screen.innerHTML = result;
        }
      }

      // Store the current number and set the operator
      previousNumber = Number(screen.innerHTML);
      operator = event.target.textContent;
    }

    // Handle decimal point
    if (event.target.id === "decimal") {
      // Avoid multiple decimal points
      if (screen.innerHTML.includes(".") && !equalsButtonPressed) {
        return;
      } else if (screen.innerHTML === "0" && event.target.textContent === ".") {
        screen.innerHTML += event.target.textContent;
      } else if (equalsButtonPressed) {
        screen.innerHTML = "0.";
      } else {
        screen.innerHTML += event.target.textContent; // append the clicked number
      }
    }

    // Handle changing the sign of the number
    if (event.target.id === "change-sign") {
      if (screen.innerHTML === "0") return;
      else {
        if (screen.innerHTML.includes("-")) {
          screen.innerHTML = screen.innerHTML.replace("-", "");
        } else {
          screen.innerHTML = "-" + screen.innerHTML;
        }
      }
    }

    // Clear the screen and reset stored values
    if (event.target.id === "clear") {
      screen.innerHTML = "0";
      previousNumber = 0;
      currentNumber = 0;
      operator = "";
    }

    // Delete the last digit or reset to '0' if only one digit remains
    if (event.target.id === "delete") {
      if (screen.innerHTML.length > 1) {
        screen.innerHTML = screen.innerHTML.slice(0, -1);
      } else {
        screen.innerHTML = "0";
      }
    }

    // Calculate the result when equals button is pressed
    if (event.target.id === "equals") {
      if (operator === "" || equalsButtonPressed === true) return;

      equalsButtonPressed = true;
      currentNumber = Number(screen.innerHTML);
      const result = operation(previousNumber, currentNumber, operator);

      // Display appropriate result or error messages
      if (result === "Can't divide by 0") {
        screen.innerHTML = `<span style="font-size: 50px;">${result}</span>`;
      } else if (
        result.toString().length > 9 &&
        !result.toString().includes(".")
      ) {
        screen.innerHTML = `<span style="font-size: 26px;">Error: Result too large to display.</span>`;
      } else if (result.toString().includes(".")) {
        screen.innerHTML = Number(getFirstEightDigits(result));
      } else {
        screen.innerHTML = result;
      }
    }
  });
});
