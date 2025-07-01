const resetButton = document.getElementById("reset-button");
const customRadio = document.getElementById("tip-custom");
const customInput = document.getElementById("custom-tip");
const customWrapper = document.querySelector(".custom-tip-wrapper");
const tipRadios = document.querySelectorAll('input[name="tip"]');
const billInput = document.getElementById("bill-amount");
const peopleInput = document.getElementById("num-people");

const tipDisplay = document.querySelector(".tip-amount-row .result");
const totalDisplay = document.querySelector(".total-amount-row .result");

function updateResetButtonState() {
  const bill = parseFloat(billInput.value);
  const people = parseInt(peopleInput.value, 10);
  const tip = getSelectedTip();

  const isValid =
    !isNaN(bill) && bill > 0 && !isNaN(people) && people > 0 && tip != null;

  resetButton.disabled = !isValid;
}

customRadio.addEventListener("change", () => {
  if (customRadio.checked) {
    customInput.focus();
  }
});

customInput.addEventListener("blur", () => {
  setTimeout(() => {
    const active = document.activeElement;
    const clickedOutside = !customWrapper.contains(active);
    const inputEmpty = customInput.value.trim() === "";

    if (clickedOutside && inputEmpty) {
      customRadio.checked = false;
      customInput.value = "";
    }
  }, 10);
});

tipRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.id !== "tip-custom") {
      customInput.value = "";
    }
  });
});

// Validation

function preventInvalidInput(e) {
  if (["e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
}

function enforceTwoDecimalPlaces(e) {
  const value = e.target.value;
  if (value.includes(".")) {
    const [intPart, decimalPart] = value.split(".");
    e.target.value = intPart + "." + decimalPart.slice(0, 2);
  }
}

function enforceWholeNumbersOnly(e) {
  const value = parseInt(e.target.value, 10);
  e.target.value = isNaN(value) ? "" : value;
}

[billInput, peopleInput, customInput].forEach((input) => {
  input.addEventListener("keydown", preventInvalidInput);
});

billInput.addEventListener("input", enforceTwoDecimalPlaces);

peopleInput.addEventListener("input", enforceWholeNumbersOnly);

// Error Message

function showError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  inputEl.classList.add("input-error");
}

function clearError(inputEl, errorEl) {
  errorEl.textContent = "";
  inputEl.classList.remove("input-error");
}

const billError = document.getElementById("bill-error");
const peopleError = document.getElementById("people-error");

billInput.addEventListener("input", () => {
  if (parseFloat(billInput.value) <= 0 || billInput.value.trim() === "") {
    showError(billInput, billError, "Can't be zero");
  } else {
    clearError(billInput, billError);
  }
});

peopleInput.addEventListener("input", () => {
  if (parseInt(peopleInput.value, 10) <= 0 || peopleInput.value.trim() === "") {
    showError(peopleInput, peopleError, "Can't be zero");
  } else {
    clearError(peopleInput, peopleError);
  }
});

// Calculation

function getSelectedTip() {
  const selected = document.querySelector('input[name="tip"]:checked');
  if (!selected) return null;
  if (selected.id === "tip-custom") {
    const customValue = parseFloat(customInput.value);
    return isNaN(customValue) ? null : customValue;
  }

  return parseFloat(selected.value);
}

function calculateAndDisplayResults(bill, tipPercentage, people) {
  const tipAmount = (bill * (tipPercentage / 100)) / people;
  const totalAmount = bill / people + tipAmount;

  document.querySelector(".tip-result").textContent = `$${tipAmount.toFixed(
    2
  )}`;
  document.querySelector(".total-result").textContent = `$${totalAmount.toFixed(
    2
  )}`;
}

function clearResults() {
  tipDisplay.textContent = "$0.00";
  totalDisplay.textContent = "$0.00";
}

function logValues() {
  const bill = parseFloat(billInput.value);
  const people = parseInt(peopleInput.value);
  const tip = getSelectedTip();

  updateResetButtonState();

  calculateAndDisplayResults(bill, tip, people);

  if (!bill || !people || tip == null) clearResults();
  return;
}

[billInput, peopleInput, customInput].forEach((input) =>
  input.addEventListener("input", logValues)
);

tipRadios.forEach((radio) => radio.addEventListener("change", logValues));

updateResetButtonState();

resetButton.addEventListener("click", () => {
  document.getElementById("tip-form").reset();

  customInput.value = "";
  clearResults();

  clearError(billInput, billError);
  clearError(peopleInput, peopleError);

  resetButton.disabled = true;

  document.querySelector(".tip-result").textContent = "$0.00";
  document.querySelector(".total-result").textContent = "$0.00";
});
