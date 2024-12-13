"use strict";

(function () {
  const BASE_URL =
    "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
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
  var subtaskArray = [];

  let selectedPrio = "medium"; // Variable für die ausgewählte Priorität

  // Buttons referenzieren
  const highButton = document.getElementById("prioritize-button-high");
  const mediumButton = document.getElementById("prioritize-button-medium");
  const lowButton = document.getElementById("prioritize-button-low");

  document.addEventListener("DOMContentLoaded", (event) => {
    setStartColorSVGButton();
    setMinDate();
    clearAllBox();
    checkUser();
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
    subTaskIcon.innerHTML =
      '<img src="icons/close.svg" alt="Close" class="add-subtask-button filter-gray">|<img src="icons/check.svg" alt="Check" class="add-subtask-button filter-gray">';
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
    svgLow.dataset.value = "low";

    svgMedium.classList.remove("filter-standard", "filter-black");
    svgMedium.classList.add("filter-orange");

    svgHigh.classList.remove("filter-standard", "filter-black");
    svgHigh.classList.add("filter-red");
  });

  buttonMedium.addEventListener("click", () => {
    deleteButtonColor();

    buttonMedium.classList.add("bco", "text-color-reverse", "font-bold");
    svgMedium.classList.add("filter-black");
    svgMedium.dataset.value = "medium";

    svgLow.classList.remove("filter-standard", "filter-black");
    svgLow.classList.add("filter-green");
    svgHigh.classList.remove("filter-standard", "filter-black");
    svgHigh.classList.add("filter-red");
  });

  buttonHigh.addEventListener("click", () => {
    deleteButtonColor();

    buttonHigh.classList.add("bcr", "text-color-reverse", "font-bold");
    svgLow.classList.add("filter-green");

    svgLow.classList.remove("filter-standard", "filter-black");
    svgMedium.classList.add("filter-orange");
    svgMedium.classList.remove("filter-standard", "filter-black");

    svgHigh.classList.add("filter-black");
    svgHigh.classList.remove("filter-standard");
    svgHigh.dataset.value = "high";
  });

  /**
   * Entferne alle Focus Rahmen
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
    svgMedium.classList.add("filter-standard");
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

    if (!dateInput) {
      console.error("Das Date-Eingabefeld konnte nicht gefunden werden.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
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
    subTaskIcon.innerHTML =
      '<img src="icons/add.svg" alt="Add" class="add-subtask-button filter-gray">';
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

  /**
   * Subtask validieren und hinzufügen
   */
  function checkSub() {
    const sub = inputSub.value.trim(); // Leerzeichen entfernen

    if (sub) {
      // Subtask als Objekt hinzufügen
      subtaskArray.push({ done: false, title: sub });
      updateSubtaskDisplay(); // Anzeige aktualisieren
      inputSub.value = ""; // Eingabefeld leeren
      inputSub.style.border = "solid 1px var(--border-inputfeld-login)"; // Rahmen zurücksetzen
    } else {
      alert("Bitte geben Sie einen gültigen Subtask ein."); // Optionales Feedback
    }
  }

  /**
   * Subtask-Liste anzeigen
   */
  function updateSubtaskDisplay() {
    const subtasksDiv = document.getElementById("subtasks");
    subtasksDiv.innerHTML = ""; // Vorherige Inhalte löschen

    subtaskArray.forEach((task, index) => {
      // Subtask-Element erstellen
      const taskDiv = document.createElement("div");
      taskDiv.className = "subtask-item";

      // Subtask-Checkbox, Titel und Buttons hinzufügen
      taskDiv.innerHTML = `
            <span>${task.title}</span>
            <div>
                <img class="edit-subtask-icon filter-gray" onclick="updateSubtask(${index})" src="icons/edit.svg" alt="Edit">
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
    inputSub.value = subtaskArray[index].title;
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
    const updatedValue = inputSub.value.trim();

    if (updatedValue) {
      subtaskArray[index].title = updatedValue; // Nur den Titel aktualisieren
      updateSubtaskDisplay();
      resetSubtaskInput();
    } else {
      alert("Bitte geben Sie einen gültigen Subtask ein.");
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
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value.trim();
    const category = document
      .querySelector(".selected-option")
      .textContent.trim();
    const desc = document.getElementById("description").value.trim();

    // Validierung der Eingaben
    if (!title) {
      showToast("Sie müssen das Titel-Feld ausfüllen.");
    } else if (!date) {
      showToast("Sie müssen das Datum-Feld ausfüllen.");
    } else if (category === "Select task category") {
      showToast("Sie müssen eine Kategorie auswählen.");
    } else if (!selectedPrio) {
      showToast("Sie müssen eine Priorität auswählen.");
    } else {
      // Alle Felder sind ausgefüllt
      const taskData = {
        category: category,
        date: date,
        description: desc,
        prio: selectedPrio,
        progress: "to-do",
        subtask: subtaskArray,
        title: title,
      };

      // Sende die Daten an Firebase
      postData("/tasks", taskData)
        .then((responseData) => {
          const databaseKey = responseData.name; // Firebase generierter Key
          console.log("Task erfolgreich erstellt mit Key:", databaseKey);

          // Aktualisiere den Task mit dem databaseKey
          return fetch(`${BASE_URL}/tasks/${databaseKey}.json`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ databaseKey }),
          });
        })
        .then(() => {
          // Erfolgsnachricht mit grünem Toast
          showToast("Task wurde erfolgreich erstellt!", "#4CAF50");

          if (window.location.pathname === "/add-task.html") {
            // Nach 3 Sekunden weiterleiten
            setTimeout(() => {
              window.location.href = "board.html";
            }, 3000);
          } else if (window.location.pathname === "/board.html") {
            setTimeout(() => {
              const overlayContainer =
                document.getElementById("overlayContainer");

              // Entferne das addTask.js-Skript
              const script = document.querySelector(
                'script[src="./js/addTask.js"]',
              );
              if (script) {
                script.remove();
                console.log("addTask.js wurde entfernt.");
              }

              if (overlayContainer) {
                overlayContainer.classList.remove("at-overlay");
                overlayContainer.style.display = "none";
                overlayContainer.innerHTML = ""; // Entfernt den HTML-Inhalt

                document.body.style.overflowY = "scroll"; // Scrollen wieder erlauben
              }

              // Markiere Skript als nicht geladen
              window.addTaskLoaded = false;
            }, 500);
          }
        })
        .catch((error) => {
          console.error("Fehler beim Erstellen des Tasks:", error);
          showToast(
            "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
            "#F44336",
          );
        });
    }
  }

  /**
   * Zeigt eine Toast-Benachrichtigung an.
   * @param {string} text - Nachricht für die Toast-Benachrichtigung.
   * @param {string} color - Hintergrundfarbe des Toasts (optional, Standard: rot).
   */
  function showToast(text, color = "#950B02") {
    const toast = document.getElementById("toast");

    // Nachricht und Hintergrundfarbe setzen
    toast.textContent = text;
    toast.style.backgroundColor = color;

    // Toast anzeigen
    toast.classList.add("show");

    // Toast nach 4 Sekunden ausblenden
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000); // 4 Sekunden
  }

  /**
   * Führt eine POST-Anfrage an Firebase aus und gibt die Antwort zurück.
   * @param {string} endpoint - Der Firebase-Endpunkt (z. B. "/tasks").
   * @param {Object} data - Die zu speichernden Daten.
   * @returns {Promise<Object>} Die Antwort von Firebase.
   */
  async function postData(endpoint = "", data = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Hinzufügen der Daten.");
    }

    return response.json(); // Gibt die Firebase-Antwort (inkl. generiertem Key) zurück
  }

  // Event-Listener hinzufügen
  highButton.addEventListener("click", () => setPriority("high", highButton));
  mediumButton.addEventListener("click", () =>
    setPriority("medium", mediumButton),
  );
  lowButton.addEventListener("click", () => setPriority("low", lowButton));

  /**
   * Setzt die Priorität und hebt den Button hervor
   * @param {string} prio - Die Priorität (z. B. "high", "medium", "low")
   * @param {HTMLElement} button - Der Button, der geklickt wurde
   */
  function setPriority(prio, button) {
    selectedPrio = prio; // Speichere die ausgewählte Priorität

    // Visuelles Feedback: Entferne aktive Klasse von allen Buttons
    highButton.classList.remove("active");
    mediumButton.classList.remove("active");
    lowButton.classList.remove("active");

    // Füge aktive Klasse zum aktuellen Button hinzu
    button.classList.add("active");
    console.log("Ausgewählte Priorität:", selectedPrio); // Debugging
  }

  function checkUser() {
    const userName = localStorage.getItem("currentUser");
    const main = document.getElementById("mainContainer");

    if (userName) {
      main.classList.remove("hidden");
    }
  }

  window.createTask = createTask;
  window.subtaskCross = subtaskCross;
  window.chanceSub = chanceSub;
  window.checkSub = checkSub;
  window.removeSubtask = removeSubtask;
  window.updateSubtask = updateSubtask;
  window.clearAllBox = clearAllBox;
})();
