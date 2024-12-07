"use strict";

if (!window.BASE_URL) {
  window.BASE_URL =
    "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
}

let tasks = []; // Tasks werden hier dynamisch geladen
let currentDraggedElement;

window.onload = async () => {
  includeHTML();
  await fetchTasks(); // Tasks von Firebase laden
  setID();
  updateHTML();
};

/**
 * Ruft die Aufgaben aus der Firebase-Datenbank ab und speichert sie in der `tasks`-Variable.
 */
async function fetchTasks() {
  try {
    const response = await fetch(`${BASE_URL}tasks.json`); // Aufgaben abrufen
    const data = await response.json(); // Daten im JSON-Format umwandeln

    if (data) {
      tasks = Object.entries(data).map(([key, task]) => ({
        ...task,
        databaseKey: key, // Den eindeutigen Schlüssel speichern
      }));
      console.log("Tasks erfolgreich geladen:", tasks);
    } else {
      console.warn("Keine Tasks in der Datenbank gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
}
/**
 * Weist jedem Task in der `tasks`-Liste eine eindeutige ID zu.
 */
function setID() {
  let currentID = 0;
  tasks.forEach((task) => {
    task.id = currentID;
    currentID++;
  });
}

/**
 * Aktualisiert das Task-Board, indem die Tasks in die entsprechenden Bereiche gerendert werden.
 */
function updateHTML() {
  renderTaskSection("toDo", "to-do");
  renderTaskSection("inProgress", "in-progress");
  renderTaskSection("awaitFeedback", "await-feedback");
  renderTaskSection("done", "done");
}

/**
 * Rendert die Tasks in einen bestimmten Bereich basierend auf ihrem Fortschritt.
 *
 * @param {string} section - Die ID des HTML-Elements, das den Aufgabenbereich repräsentiert.
 * @param {string} keyword - Der Fortschrittsstatus, nach dem Tasks gefiltert werden (z. B. "to-do", "done").
 */
function renderTaskSection(section, keyword) {
  const filteredTasks = tasks.filter((task) => task.progress === keyword);
  const container = document.getElementById(section);
  container.innerHTML = "";

  if (filteredTasks.length > 0) {
    filteredTasks.forEach((task) => {
      container.innerHTML += generateTodoHTML(task);
    });
  } else {
    container.innerHTML = `<span class="noTaskSpan">No tasks in ${keyword}</span>`;
  }
}

/**
 * Generiert den HTML-Code für eine einzelne Aufgabe.
 *
 * @param {Object} task - Das Aufgabenobjekt, das gerendert werden soll.
 * @returns {string} - Der HTML-String, der die Aufgabe darstellt.
 */

function generateTodoHTML(task) {
  let subTaskHTML = "";
  let categoryClass = "";

  // Kategorie CSS-Klasse festlegen
  if (task.category === "Technical Task") {
    categoryClass = "category-technical";
  } else {
    categoryClass = "category-story";
  }

  // Priorität bestimmen
  let priotask = "";
  if (task.prio === "low") {
    priotask =
      '<img id="svg-low" src="/icons/prio-low.svg" alt="Low" class="task-card-prio atb-sitz"/>';
  } else if (task.prio === "medium") {
    priotask =
      '<img id="svg-medium" src="/icons/prio-medium.svg" alt="Medium" class="task-card-prio atb-sitz"/>';
  } else if (task.prio === "high") {
    priotask =
      '<img id="svg-high" src="/icons/prio-high.svg" alt="High" class="task-card-prio atb-sitz"/>';
  }

  // Subtasks zählen und HTML erstellen, wenn vorhanden
  if (Array.isArray(task.subtask) && task.subtask.length > 0) {
    const completedSubtasks = task.subtask.filter(
      (subtask) => subtask.done,
    ).length; // Anzahl abgeschlossener Subtasks
    const totalSubtasks = task.subtask.length; // Gesamtanzahl der Subtasks

    subTaskHTML = `
            <div class="task-card-subtask" id="boardSubtask-to-do-0">
                <div class="subtask-container">
                    <div class="subtask-value" style="width: ${Math.round((completedSubtasks / totalSubtasks) * 100)}%"></div>
                </div>
                <div class="subtask-info">${completedSubtasks}/${totalSubtasks} Subtasks</div>
            </div>`;
  }

  return `
        <div class="list" draggable="true" onclick="showOrHideOverlayTask(${JSON.stringify(task).replace(/"/g, "&quot;")})"
             ondragstart="startDragging(${task.id})" 
             ondragend="clearAllHighlights()" 
             class="todo">
             <div class="task-card-category">
                <span class="${categoryClass}">${task.category}</span> <span>${priotask}</span>
             </div>
                <h3 class="task-card-title">${task.title}</h3>
                <p class="task-card-description">${task.description}</p>
            ${subTaskHTML}
        </div>

`;
}

/**
 * Setzt die ID des aktuell gezogenen Tasks.
 *
 * @param {number} id - Die ID des gezogenen Tasks.
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Erlaubt das Ziehen und Ablegen von Elementen, indem das Standardverhalten verhindert wird.
 *
 * @param {DragEvent} event - Das Drag-Event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Verschiebt den aktuell gezogenen Task in eine neue Fortschrittskategorie und aktualisiert das Board.
 *
 * @param {string} progress - Die neue Fortschrittskategorie für den Task (z. B. "to-do", "done").
 */
function moveTo(progress) {
  tasks[currentDraggedElement].progress = progress; // Fortschritt lokal aktualisieren
  updateTaskProgressInDatabase(currentDraggedElement); // Fortschritt in Firebase speichern
  updateHTML(); // HTML aktualisieren
}

/**
 * Hebt den Drop-Bereich hervor, wenn ein ziehbares Element darüber schwebt.
 *
 * @param {string} id - Die ID des Drop-Bereichs, der hervorgehoben werden soll.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Entfernt die Hervorhebung von allen Drop-Bereichen.
 */
function clearAllHighlights() {
  const dropZones = document.querySelectorAll(".drag-area");
  dropZones.forEach((zone) => {
    zone.classList.remove("drag-area-highlight");
  });
}

/**
 * Entfernt die Hervorhebung von einem bestimmten Drop-Bereich.
 *
 * @param {string} id - Die ID des Drop-Bereichs, dessen Hervorhebung entfernt werden soll.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Aktualisiert den Fortschrittsstatus eines Tasks in der Firebase-Datenbank.
 *
 * @param {number} taskIndex - Der Index des Tasks im `tasks`-Array.
 */
async function updateTaskProgressInDatabase(taskIndex) {
  try {
    const task = tasks[taskIndex];
    const databaseKey = task.databaseKey; // Der eindeutige Schlüssel des Tasks in Firebase
    if (!databaseKey) return; // Verhindere Updates, wenn kein Schlüssel existiert

    await fetch(`${BASE_URL}tasks/${databaseKey}.json`, {
      method: "PATCH", // Aktualisierung (kein vollständiges Überschreiben)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: task.progress }), // Nur das `progress`-Feld aktualisieren
    });

    console.log(`Task "${task.title}" erfolgreich aktualisiert.`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks in Firebase:", error);
  }
}

function filterAndShowTask() {
  const input = document
    .getElementById("filterTaskInput")
    .value.trim()
    .toLowerCase();

  // Filtere die Aufgaben basierend auf Titel oder Beschreibung
  const filteredTasks = tasks.filter((task) => {
    const titleMatch = task.title.toLowerCase().includes(input);
    const descriptionMatch = task.description.toLowerCase().includes(input);
    return titleMatch || descriptionMatch;
  });

  // Wenn keine Eingabe vorhanden ist, zeige alle Tasks
  if (input === "") {
    updateHTML(); // Zeige alle Tasks ohne Filter
  } else {
    renderFilteredTasks(filteredTasks);
  }
}

/**
 * Rendert gefilterte Tasks auf dem Board.
 *
 * @param {Array} filteredTasks - Die gefilterten Tasks, die angezeigt werden sollen.
 */
function renderFilteredTasks(filteredTasks) {
  const sections = {
    "to-do": "toDo",
    "in-progress": "inProgress",
    "await-feedback": "awaitFeedback",
    done: "done",
  };

  // Leere alle Abschnitte
  Object.values(sections).forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    section.innerHTML =
      '<span class="noTaskSpan">Keine passenden Aufgaben gefunden.</span>';
  });

  // Tasks je nach Fortschritt in die richtigen Abschnitte einsortieren
  filteredTasks.forEach((task) => {
    const sectionId = sections[task.progress];
    const section = document.getElementById(sectionId);

    if (section) {
      // Wenn die Sektion bereits leere Nachricht enthält, leeren und Task hinzufügen
      if (section.innerHTML.includes("Keine passenden Aufgaben gefunden.")) {
        section.innerHTML = "";
      }
      section.innerHTML += generateTodoHTML(task);
    }
  });
}

function showOrHideOverlay() {
  const overlayContainer = document.getElementById("overlayContainer");

  if (!overlayContainer) {
    console.error("overlayContainer konnte nicht gefunden werden!");
    return;
  }

  // Überprüfe, ob das Overlay bereits angezeigt wird
  if (overlayContainer.style.display === "block") {
    overlayContainer.style.display = "none";
    document.body.style.overflowY = ""; // Scrollen wieder erlauben
  } else {
    if (
      overlayContainer.innerHTML.trim() &&
      overlayContainer.style.display === "none"
    ) {
      // Wenn das Overlay bereits Inhalte hat und nur versteckt war
      overlayContainer.style.display = "block";
      document.body.style.overflowY = "hidden"; // Scrollen verhindern
      // Initialisiere notwendige Funktionen erneut

      //setMinDate();
      //setStartColorSVGButton();

      return;
    }

    // Verhindert das Scrollen
    document.body.style.overflowY = "hidden";
    window.scrollTo(0, 0);
    overlayContainer.classList.add("at-overlay");

    overlayContainer.innerHTML = ` <div class="headlineAndClosed" id="headlineAndClosed">
                          <div class="headline">
                                <h1>Add Task</h1>    
                          </div>
                          
                    <div class="overlay-closed" id="overlay-closed" onclick="overlayClosed()">
                            <img id="closedSVG" class="filter-gray " src="/icons/close.svg" alt="Close" /> 
                    </div>
                </div>  
            <div class="overlay-add-task">
                <div class="content-overlay-left">  
                    <div class="dfg">
                        <label for="title">Title<span class="star"> *</span></label><br>
                        <input class="input-title" type="text" id="title" name="title" placeholder="Enter a Title" required>
                    </div>

                    <div class="dfg">
                        <label for="description">Description</label><br>
                        <textarea class="textarea-description" id="description" name="description"
                                  rows="4" cols="50" placeholder="Enter a Description" required></textarea>
                    </div>

                </div>
                <div class="content-overlay-right">
                    <div class="dfg">
                        <label for="date">Due date<span class="star"> *</span></label><br>
                        <input class="input-date" type="date" id="date" name="date" placeholder="dd/mm/yyyy" required>
                    </div>

                    <div class="content-add-task-button dfg">
                        <p>Prio</p>
                        <p class="add-task-button-set">
                            <button class="prioritize-button-high" id="prioritize-button-high" value="high">Urgent <img id="svg-high" src="/icons/prio-high.svg" alt="High" class="atb-sitz"/></button>
                            <button class="prioritize-button-medium" id="prioritize-button-medium" value="medium">Medium <img id="svg-medium" src="/icons/prio-medium.svg" alt="Medium" class="atb-sitz"/></button>
                            <button class="prioritize-button-low" id="prioritize-button-low" value="low">Low <img id="svg-low" src="/icons/prio-low.svg" alt="Low" class="atb-sitz"/></button>
                        </p>
                    </div>

                    <div class="dfg category-title">
                        Category<span class="star"> *</span>
                    </div>

                    <div class="dfg custom-select-container" id="custom-select-container">
                        <div class="custom-select" id="customSelect">
                            <span class="selected-option">Select task category</span>
                            <svg class="custom-arrow" width="14" height="14" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z"></path>
                            </svg>
                        </div>
                        <ul class="options-list" id="optionsList">
                            <li data-value="0">Select task category</li>
                            <li data-value="1">Technical Task</li>
                            <li data-value="2">User Story</li>
                        </ul>
                    </div>


                    <div class="dfg">
                        <label for="subtask">Subtask</label><br>
                        <input class="input-subtask" type="text" id="subtask" name="subtask" placeholder="Add new subtask">
                        <div class="input-Button" id="subtask-icon" onclick="subtaskCross();">
                            <img src="icons/add.svg" alt="Add" class="add-subtask-button filter-gray">
                        </div>
                        <div id="subtasks"></div>
                    </div>

                </div>

            </div>

            <div class="button-set task-buttons">

                <div class="clear-task-button" id="clear-task" onclick="overlayClosed();">
                    <button id="clear-task-button">Cancel</button>
                </div>

                <div class="create-task-button" id="create-button">
                   <button id="create-task-button" onclick="createTask();">Create Task</button>
               </div>

            </div>

            <div class="required-task" id="required-task">
                <span class="star">* </span>&nbsp; This field is required
            </div>`;

    // add-task.js laden und sicherstellen, dass Funktionen verfügbar sind
    if (!window.addTaskLoaded) {
      loadExternalScript("./js/addTask.js", () => {
        setMinDate();
        setStartColorSVGButton();
      });
      window.addTaskLoaded = true; // Markiere Skript als geladen
    } else {
      // Falls das Skript bereits geladen wurde, Initialisierungsfunktionen erneut aufrufen
      setMinDate();
      setStartColorSVGButton();
    }

    overlayContainer.style.display = "block";
  }
}

/**
 * Lädt ein externes JavaScript in das aktuelle Dokument und ruft optional einen Callback auf.
 * @param {string} src - Der Pfad zur externen JavaScript-Datei.
 * @param {function} callback - Eine Funktion, die nach dem Laden ausgeführt wird.
 */
function loadExternalScript(src, callback) {
  const existingScript = document.querySelector(`script[src="${src}"]`);

  if (!existingScript) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      console.log(`${src} erfolgreich geladen.`);
      if (typeof callback === "function") callback();
    };
    script.onerror = () => console.error(`Fehler beim Laden von ${src}.`);
    document.body.appendChild(script);
  } else {
    console.log(`${src} ist bereits geladen.`);
    if (typeof callback === "function") callback(); // Falls Skript schon geladen, trotzdem Callback ausführen
  }
}

/**
 * Schließt das Overlay und entfernt das addTask.js-Skript
 */
function overlayClosed() {
  const overlayContainer = document.getElementById("overlayContainer");

  // Entferne das addTask.js-Skript
  const script = document.querySelector('script[src="./js/addTask.js"]');
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
}

/**
 * Setze alles auf Standartwerte beim reload
 */
function setStartColorSVGButton() {
  const svgLow = document.getElementById("svg-low");
  const svgMedium = document.getElementById("svg-medium");
  const svgHigh = document.getElementById("svg-high");
  const buttonMedium = document.getElementById("prioritize-button-medium");

  svgLow.classList.add("filter-green");
  svgMedium.classList.add("filter-black");
  buttonMedium.classList.add("bco", "text-color-reverse", "font-bold");
  svgHigh.classList.add("filter-red");
}

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

function showOrHideOverlayTask(task) {
  const overlay = document.getElementById("overlayContainerTask");

  if (overlay.style.display === "none" || overlay.innerHTML === "") {
    // Sicherstellen, dass subtasks ein Array ist, um Fehler zu vermeiden
    const subtasks = Array.isArray(task.subtask) ? task.subtask : [];

    // Kategorie bestimmen
    let categoryClass = "";

    // Kategorie CSS-Klasse festlegen
    if (task.category === "Technical Task") {
      categoryClass = "category-technical";
    } else {
      categoryClass = "category-story";
    }

    // Priorität bestimmen
    let priotask = "";
    if (task.prio === "low") {
      priotask =
        '<img id="svg-low" src="/icons/prio-low.svg" alt="Low" class="task-card-prio atb-sitz"/>';
    } else if (task.prio === "medium") {
      priotask =
        '<img id="svg-medium" src="/icons/prio-medium.svg" alt="Medium" class="task-card-prio atb-sitz"/>';
    } else if (task.prio === "high") {
      priotask =
        '<img id="svg-high" src="/icons/prio-high.svg" alt="High" class="task-card-prio atb-sitz"/>';
    }

    overlay.innerHTML = `
      <div class="overlay-content">
        <div class="task-card-overlay-top">
              <div class="task-card-overlay-category"><span class="${categoryClass}">${task.category}</span></div>
                  <div class="overlay-closed" id="overlay-closed" onclick="hideOverlayTask()">
                            <img id="closedSVG" class="filter-gray " src="/icons/close.svg" alt="Close" /> 
                  </div>                 
        </div>
        <h3 class="task-card-overlay-title">${task.title}</h3>
        <p class="task-card-overlay-description">${task.description}</p>
        <p class="task-card-overlay-date">Due date: ${task.date}</p>
        <p class="task-card-overlay-prio">Priority: ${capitalizeFirstLetter(task.prio)} ${priotask}</p>
        <div class="task-card-subtask-overlay" id="overlaySubtask"><p>Subtasks</p>
        <div class="st-overlay subtask-overlay-list">
                <ul>
                
          ${subtasks
            .map(
              (subtask, index) => `
    <li>
      <label>
        <input type="checkbox" 
               ${subtask.done ? "checked" : ""} 
               onchange="toggleSubtaskStatus('${task.databaseKey}', ${index}, this.checked)">
        ${subtask.title}
      </label>
    </li>`,
            )
            .join("")}
        </ul>
</div>
        </div>
        <div class="task-card-overlay-bottom">
                        <img class="overlay-action-btn btn-delete filter-gray" src="/icons/board-delete.png" alt="" onclick="deleteTask('-OAxMXPc_LkTUgb74fK3')">
                        <hr>
                        <img class="overlay-action-btn btn-edit filter-gray" src="/icons/board-edit.png" alt="" onclick="openOrCloseEditTask()">
        </div>
      </div>
    `;
    overlay.style.display = "block"; // Overlay anzeigen
    overlay.classList.add("overlay");
    // Verhindert das Scrollen
    document.body.style.overflowY = "hidden";
    window.scrollTo(0, 0);
  } else {
    overlay.style.display = "none"; // Overlay verstecken
    overlay.classList.remove("overlay");
  }
}

function hideOverlayTask() {
  const overlay = document.getElementById("overlayContainerTask");
  overlay.style.display = "none";

  document.body.style.overflowY = "scroll"; // Scrollen wieder erlauben
}

/**
 *
 * @param string
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
  if (!string) return ""; // Falls der String leer oder undefined ist
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Aktualisiert den Status eines Subtasks in Firebase.
 *
 * @param {string} taskKey - Der Firebase-Schlüssel der Hauptaufgabe.
 * @param {number} subtaskIndex - Der Index des Subtasks im Array.
 * @param {boolean} isDone - Der neue Status des Subtasks.
 */
async function toggleSubtaskStatus(taskKey, subtaskIndex, isDone) {
  try {
    const task = tasks.find((task) => task.databaseKey === taskKey);
    if (!task) return;

    // Lokale Änderung des Subtasks
    task.subtask[subtaskIndex].done = isDone;

    // Aktualisierung in Firebase
    await fetch(`${BASE_URL}tasks/${taskKey}/subtask/${subtaskIndex}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: isDone }),
    });

    console.log(`Subtask ${subtaskIndex} erfolgreich aktualisiert: ${isDone}`);
    updateHTML(); // Board aktualisieren
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Subtasks:", error);
  }
}
