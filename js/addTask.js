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
let subtaskArray = [];


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

    // Setzt die Icons bei SubTask
    subTaskIcon.innerHTML = "<img src=\"icons/close.svg\" alt=\"Close\" class=\"add-subtask-button filter-gray\">|<img src=\"icons/check.svg\" alt=\"Check\" class=\"add-subtask-button filter-gray\">";
    subTaskIcon.classList.remove("input-Button");
    subTaskIcon.classList.add("input-Button-Dou");
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
 * Enferne alle Focus Rahmen
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

    // Das heutige Datum erhalten
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

    subTaskIcon.classList.remove("input-Button-Dou");
    subTaskIcon.classList.add("input-Button");

    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
    subTaskIcon.innerHTML = "<img src=\"icons/add.svg\" alt=\"Add\" class=\"add-subtask-button filter-gray\">";
}

function subtaskCross() {
    subTaskIcon.innerHTML = `
       <img onclick="chanceSub();" src="icons/close.svg" alt="Close" class="add-subtask-button filter-gray"> |
       <img onclick="checkSub();" src="icons/check.svg" alt="Check" class="add-subtask-button filter-gray">
    `;

    subTaskIcon.className = "input-Button-Dou"; // Direkte Zuweisung statt remove/add


    inputSub.style.border = "solid 1px var(--border-input-focus)";
    inputSub.focus();
}

function chanceSub() {
    console.log("chanceSub() wurde aufgerufen");



    setTimeout(() => {
        subTaskIcon.classList.remove("input-Button-Dou");
        subTaskIcon.classList.add("input-Button");

        subTaskIcon.innerHTML = `
            <img src="icons/add.svg" alt="Add" class="add-subtask-button filter-gray">
        `;
    }, 0); // 0ms Delay, um das DOM zu aktualisieren


    inputSub.style.border = "solid 1px var(--border-inputfeld-login)";
    inputSub.value = "";
}

function checkSub() {
    const sub = inputSub.value.trim(); // Entferne Leerzeichen am Anfang/Ende

    if (sub) { // Nur speichern, wenn das Feld nicht leer ist
        subtaskArray.push(sub); // Subtask zum Array hinzufügen
        updateSubtaskDisplay(); // Subtask-Liste aktualisieren
        inputSub.value = ""; // Eingabefeld leeren
        inputSub.style.border = "solid 1px var(--border-inputfeld-login)"; // Rahmen zurücksetzen
    } else {
        alert("Bitte geben Sie einen gültigen Subtask ein."); // Optional: Feedback für leere Eingabe
    }
}

function updateSubtaskDisplay() {
    const subtasksDiv = document.getElementById("subtasks");
    subtasksDiv.innerHTML = ""; // Vorherige Inhalte löschen

    subtaskArray.forEach((task, index) => {
        // Subtask-Element erstellen
        const taskDiv = document.createElement("div");
        taskDiv.className = "subtask-item";

        // Subtask-Text und Buttons hinzufügen
        taskDiv.innerHTML = `
            <span>${task}</span>
            <div>
              <!--  <button onclick="updateSubtask(${index})" class="edit-subtask-button">Edit</button>
                <button onclick="removeSubtask(${index})" class="remove-subtask-button">X</button>-->
                <img class="edit-subtask-icon filter-gray" onclick="updateSubtask(${index})"  src="icons/edit.svg" alt="Edit">
                <img class="remove-subtask-icon filter-gray" onclick="removeSubtask(${index})" src="icons/delete.svg" alt="Delete">
            </div>
        `;

        subtasksDiv.appendChild(taskDiv); // Zum Container hinzufügen
    });
}

function removeSubtask(index) {
    subtaskArray.splice(index, 1); // Subtask aus dem Array entfernen
    updateSubtaskDisplay(); // Anzeige aktualisieren
}

function updateSubtask(index) {
    // Lade den Subtask ins Eingabefeld
    inputSub.value = subtaskArray[index];
    inputSub.focus();

    // Rahmen hervorheben, um den Bearbeitungsmodus zu kennzeichnen
    inputSub.style.border = "solid 1px var(--border-input-focus)";

    // Ändere die Check- und Close-Icons zu "Save" und "Cancel"
    subTaskIcon.innerHTML = `
        <img onclick="cancelEdit();" src="icons/close.svg" alt="Cancel" class="add-subtask-button filter-gray">
        |
        <img onclick="saveSubtask(${index});" src="icons/check.svg" alt="Check" class="add-subtask-button filter-gray">

    `;
}

function saveSubtask(index) {
    const updatedValue = inputSub.value.trim(); // Hole den neuen Wert

    if (updatedValue) {
        subtaskArray[index] = updatedValue; // Aktualisiere den Subtask im Array
        updateSubtaskDisplay(); // Aktualisiere die Anzeige
        resetSubtaskInput(); // Eingabefeld zurücksetzen
    } else {
        alert("Bitte geben Sie einen gültigen Subtask ein."); // Optional: Feedback
    }
}

function cancelEdit() {
    resetSubtaskInput(); // Eingabefeld zurücksetzen
}

function resetSubtaskInput() {
    inputSub.value = ""; // Eingabefeld leeren
    inputSub.style.border = "solid 1px var(--border-inputfeld-login)"; // Rahmen zurücksetzen
    subTaskIcon.innerHTML = `
        <img onclick="subtaskCross();" src="icons/add.svg" alt="Add" class="add-subtask-button filter-gray">
    `;
}

function createTask() {
    console.log("create task");

    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value.trim();
    const category = document.getElementById("optionsList").value;

    console.log(title);

    // Validierung der Eingaben
    if (!title) {
        showToast("Sie müssen das Title Feld ausfüllen.");
    }else if (!date) {
        showToast("Sie müssen das Date Feld ausfüllen.");
    }else if (!category) {
        showToast("Sie müssen eine Title Feld ausfüllen.");
    }
    else if (!title || !date || !category) {
        showToast("Sie müssen alle Felder mit * ausfüllen.");
    }
}


/**
 * Show Toast
 * @param text
 */
function showToast(text){
    const x=document.getElementById("toast");
    x.classList.add("show");
    x.innerHTML=text;
    setTimeout(function(){
        x.classList.remove("show");
    },4000);
}