"use strict";

const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputDate = document.getElementById("date");
const inputCategory = document.getElementById("custom-select-container");
const inputSub = document.getElementById("subtask");
const buttonLow = document.getElementById("prioritize-button-low");
const buttonMedium = document.getElementById("prioritize-button-medium");
const buttonHigh = document.getElementById("prioritize-button-high");

const svgLow = document.getElementById("svg-low");
const svgMedium = document.getElementById("svg-medium");
const svgHigh = document.getElementById("svg-high");

const customSelect = document.getElementById("customSelect");
const optionsList = document.getElementById("optionsList");
const selectedOption = document.querySelector(".selected-option");

const addTaskButton = document.getElementById("create-button");
const clearTaskButton = document.getElementById("clear-task");

const subTaskIcon = document.getElementById("subtask-icon");
const subtasks = document.getElementById("subtasks");
subtasks.value = {};

document.addEventListener("DOMContentLoaded", (event) => {

    setStartColorSVGButton();
    setMinDate();

});


// Beim Klicken auf das Title-Feld den Rahmen setzen
inputTitle.addEventListener("click", (event) => {
    inputTitle.style.border = "solid 1px var(--border-input-focus)";
    inputDescription.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDate.style.border = "solid 1px var(--border-inputfeld-login)";
    inputCategory.style.border = "solid 1px var(--border-inputfeld-login)";
    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
});

// Beim Klicken auf das Description-Feld den Rahmen setzen
inputDescription.addEventListener("click", (event) => {
    inputDescription.style.border = "solid 1px var(--border-input-focus)";
    inputTitle.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDate.style.border = "solid 1px var(--border-inputfeld-login)";
    inputCategory.style.border = "solid 1px var(--border-inputfeld-login)";
    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
});

// Beim Klicken auf das Date-Feld den Rahmen setzen
inputDate.addEventListener("click", (event) => {
    inputDate.style.border = "solid 1px var(--border-input-focus)";
    inputTitle.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDescription.style.border = "solid 1px var(--border-inputfeld-login)";
    inputCategory.style.border = "solid 1px var(--border-inputfeld-login)";
    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
});


// Beim Klicken auf das Subtask-Feld den Rahmen setzen
inputSub.addEventListener("click", (event) => {
    inputSub.style.border = "solid 1px var(--border-input-focus)";
    inputTitle.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDescription.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDate.style.border = "solid 1px var(--border-inputfeld-login)";
    inputCategory.style.border = "solid 1px var(--border-inputfeld-login)";
});


// Add-Task Button Low/Medium/High
buttonLow.addEventListener("mouseover", (event) => {
    buttonLow.classList.add("box-shadow");
    buttonMedium.classList.remove("box-shadow");
    buttonHigh.classList.remove("box-shadow");
});

buttonMedium.addEventListener("mouseover", (event) => {
    buttonMedium.classList.add("box-shadow");
    buttonLow.classList.remove("box-shadow");
    buttonHigh.classList.remove("box-shadow");
});

buttonHigh.addEventListener("mouseover", (event) => {
    buttonHigh.classList.add("box-shadow");
    buttonLow.classList.remove("box-shadow");
    buttonMedium.classList.remove("box-shadow");
});

// Schatten entfernen, wenn Maus den Button verlässt
buttonLow.addEventListener("mouseout", () => {
    buttonLow.classList.remove("box-shadow");
});

buttonMedium.addEventListener("mouseout", () => {
    buttonMedium.classList.remove("box-shadow");
});

buttonHigh.addEventListener("mouseout", () => {
    buttonHigh.classList.remove("box-shadow");
});

// Füge `click`-Event-Listener hinzu, um die Farbe beim Klicken zu ändern
buttonLow.addEventListener("click", () => {

    deleteButtonColor();

    buttonLow.classList.add("bcg", "text-color-reverse", "font-bold");
    svgLow.classList.add("filter-black");
    svgLow.dataset.value = "low"

    svgMedium.classList.remove("filter-standart", "filter-black");
    svgMedium.classList.add("filter-orange")

    svgHigh.classList.remove("filter-standart", "filter-black");
    svgHigh.classList.add("filter-red");
});



buttonMedium.addEventListener("click", () => {

    deleteButtonColor();

    buttonMedium.classList.add("bco", "text-color-reverse", "font-bold");
    svgMedium.classList.add("filter-black");
    svgMedium.dataset.value = "medium";

    svgLow.classList.remove("filter-standart", "filter-black");
    svgLow.classList.add("filter-green");
    svgHigh.classList.remove("filter-standart", "filter-black");
    svgHigh.classList.add("filter-red");

});


buttonHigh.addEventListener("click", () => {

    deleteButtonColor();

    buttonHigh.classList.add("bcr", "text-color-reverse", "font-bold");
    svgLow.classList.add("filter-green");

    svgLow.classList.remove("filter-standart", "filter-black");
    svgMedium.classList.add("filter-orange");
    svgMedium.classList.remove("filter-standart", "filter-black");

    svgHigh.classList.add("filter-black");
    svgHigh.classList.remove("filter-standart");
    svgHigh.dataset.value = "high";


});

/**
 * Enferne alle Focus
 */
function removeFocus() {
    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
    inputTitle.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDescription.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDate.style.border = "solid 1px var(--border-inputfeld-login)";
    inputCategory.style.border = "solid 1px var(--border-inputfeld-login)";

}
/**
 * Setze alles auf Standartwerte beim reload
 */
function setStartColorSVGButton() {
    svgLow.classList.add("filter-green");
    svgMedium.classList.add("filter-black");
    buttonMedium.classList.add("bco", "text-color-reverse", "font-bold");
    svgHigh.classList.add("filter-red");
}


/**
 *  Lösche alle Klassen aus den Ad-Task Buttons
 */
function deleteButtonColor() {
    // Löscht alle Klassen vom Low Button
    buttonLow.classList.remove("bcg", "text-color-reverse", "font-bold");


    // Löscht alle Klassen vom Medium Button

    buttonMedium.classList.remove("bco", "text-color-reverse", "font-bold");
    svgMedium.classList.add("filter-standart");
    svgMedium.dataset.value = "medium";


    // Löscht alle Klassen vom High Button

    buttonHigh.classList.remove("bcr", "text-color-reverse", "font-bold");

}



// Öffnet oder schließt das Dropdown-Menü beim Klicken
customSelect.addEventListener("click", () => {
    const isOpen = optionsList.style.display === "block";
    optionsList.style.display = isOpen ? "none" : "block";
    customSelect.classList.toggle("open", !isOpen); // Toggle für die Pfeildrehung

// Beim Klicken auf das Category-Feld den Rahmen setzen

    inputCategory.style.border = "solid 1px var(--border-input-focus)";
    inputTitle.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDescription.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDate.style.border = "solid 1px var(--border-inputfeld-login)";
    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
});

// Setzt die ausgewählte Option und schließt das Dropdown
optionsList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        selectedOption.textContent = event.target.textContent; // Setzt den Text der ausgewählten Option
        optionsList.style.display = "none";
        customSelect.classList.remove("open"); // Pfeil zurückdrehen
    }
});

// Schließt das Dropdown, wenn außerhalb geklickt wird
document.addEventListener("click", (event) => {
    if (!customSelect.contains(event.target)) {
        optionsList.style.display = "none";
        customSelect.classList.remove("open"); // Pfeil zurückdrehen
    }
});

// Funktion zum Festlegen des Mindestdatums auf das heutige Datum
function setMinDate() {
    const dateInput = document.getElementById("date");

    // Das heutige Datum im Format "YYYY-MM-DD" erhalten
    const today = new Date().toISOString().split("T")[0];

    // Mindestdatum auf heute setzen
    dateInput.min = today;
}

// Aktionen beim Klick auf die Buttons im addTask
addTaskButton.addEventListener("mouseover", (event) => {
    addTaskButton.classList.add("focus-task-button");
    addTaskButton.classList.remove("create-task-button");
});

addTaskButton.addEventListener("mouseout", (event) => {
    addTaskButton.classList.add("create-task-button");
    addTaskButton.classList.remove("focus-task-button");
});

clearTaskButton.addEventListener("mouseover", (event) => {
    clearTaskButton.classList.add("focus-clear");
    clearTaskButton.classList.remove("clear-task-button");
});

clearTaskButton.addEventListener("mouseout", (event) => {
    clearTaskButton.classList.add("clear-task-button");
    clearTaskButton.classList.remove("focus-clear");
});

function clearAllBox() {
    inputTitle.value = "";
    inputDescription.value = "";
    inputDate.value = "";
    deleteButtonColor();
    setStartColorSVGButton();
    selectedOption.innerText = "Select task category"; // Text zurücksetzen
    selectedOption.dataset.value = "0"; // Wert auf "0" setzen
    inputSub.value = "";
    removeFocus();
}

function subtaskCross() {
    console.log("subtaskCross");
    subTaskIcon.innerHTML = "<img src=\"icons/close.svg\" alt=\"Close\" class=\"add-subtask-button filter-gray\">|<img src=\"icons/check.svg\" alt=\"Check\" class=\"add-subtask-button filter-gray\">";
}