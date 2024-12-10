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
                          
                         <div class="task-main-container">
        <div class="wrapper">
            <a href="#" class="close-button" onclick="hideOverlayTask()">
        <div class="in">
            <div class="close-button-block"></div>
            <div class="close-button-block"></div>
           </div>
        <div class="out">
                <div class="close-button-block"></div>
                <div class="close-button-block"></div>
           </div>
             </a>
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
                          <div class="wrapper">
            <a href="#" class="close-button" onclick="hideOverlayTask()">
        <div class="in">
            <div class="close-button-block"></div>
            <div class="close-button-block"></div>
           </div>
        <div class="out">
                <div class="close-button-block"></div>
                <div class="close-button-block"></div>
           </div>
             </a>
        </div>                
        </div>
        <h3 class="task-card-overlay-title">${task.title}</h3>
        <p class="task-card-overlay-description">${task.description}</p>
        <p class="task-card-overlay-date">Due date: ${task.date}</p>
        <p class="task-card-overlay-prio">Priority: ${capitalizeFirstLetter(task.prio)} ${priotask}</p>
        ${
          subtasks.length > 0
            ? ` 
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
        </div>`
            : ""
        }
        
        <div class="task-card-overlay-bottom">
                        <img class="overlay-action-btn btn-delete filter-gray" src="/icons/board-delete.png" alt="" onclick="deleteTask('${task.databaseKey}')">
                        <hr>
                        <img class="overlay-action-btn btn-edit filter-gray" src="/icons/board-edit.png" alt="" onclick="openOrCloseEditTask('${task.databaseKey}')">
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

/**
 *
 * @param taskKey
 * @returns {Promise<void>}
 */
async function deleteTask(taskKey) {
  try {
    // Lokale Änderung: Task aus dem Array entfernen
    const taskIndex = tasks.findIndex((task) => task.databaseKey === taskKey);
    if (taskIndex === -1) {
      console.warn("Task nicht gefunden:", taskKey);
      return;
    }
    tasks.splice(taskIndex, 1);

    // Firebase-Request: Task löschen
    await fetch(`${BASE_URL}tasks/${taskKey}.json`, {
      method: "DELETE",
    });

    console.log(`Task ${taskKey} erfolgreich gelöscht`);

    // Aktualisiere die Anzeige
    updateHTML();

    // Overlay Schließen
    hideOverlayTask();
  } catch (error) {
    console.error("Fehler beim Löschen der Aufgabe:", error);
  }
}

function openOrCloseEditTask(taskKey) {
  const overlay = document.getElementById("overlayContainerTask");

  // Lokale Änderung: Task aus dem Array entfernen
  const taskIndex = tasks.findIndex((task) => task.databaseKey === taskKey);
  const task = tasks[taskIndex];

  if (taskIndex === -1) {
    console.warn("Task nicht gefunden:", taskKey);
    return;
  }

  // Kategorie bestimmen
  let categoryClass = "";

  // Kategorie CSS-Klasse festlegen
  if (task.category === "Technical Task") {
    categoryClass = "category-technical";
  } else {
    categoryClass = "category-story";
  }

  const subtasks = task.subtask || [];

  if (overlay.style.display === "block") {
    overlay.innerHTML = "";

    overlay.innerHTML = `
     <div class="task-main-container">
        <div class="wrapper">
            <a href="#" class="close-button" onclick="hideOverlayTask()">
        <div class="in">
            <div class="close-button-block"></div>
            <div class="close-button-block"></div>
           </div>
        <div class="out">
                <div class="close-button-block"></div>
                <div class="close-button-block"></div>
           </div>
             </a>
        </div>
            <form class="task-form et-form" action="">
                <div class="edit-Task-Title">
                    <label for="editTaskTitle">Title *</label>
                    <input class="input-title" type="text" id="editTaskTitle" name="title" placeholder="Enter a Title" value="${task.title}" required>
                </div>
                
                <div class="edit-Task-Description">
                 <label for="editTaskDescription">Description</label>
                   <textarea class="textarea-description" id="editTaskDescription" name="description" data-value="${task.description}">${task.description}
                   </textarea>                 
                </div>
                
                <div class="edit-Task-Date">
                   <label for="date">Due date *</label>
                   <input class="input-date" type="date" id="date" name="date" placeholder="dd/mm/yyyy" value="${task.date}" required>
                </div>
                
                <div class="edit-Task-Prio">
                      <label for="date">Prio</label>
                    <p class="edit-task-button-set" id="edit-button-set">
                         <button class="prioritize-button-high ${task.prio === "high" ? "bcr text-color-reverse font-bold active" : ""}" id="prioritize-button-high" value="high">Urgent <img id="svg-high-task" src="/icons/prio-high.svg" alt="High" class="atb-sitz"/></button>
                         <button class="prioritize-button-medium ${task.prio === "medium" ? "bco text-color-reverse font-bold active" : ""}" id="prioritize-button-medium" value="medium">Medium <img id="svg-medium-task" src="/icons/prio-medium.svg" alt="Medium" class="atb-sitz"/></button>
                         <button class="prioritize-button-low ${task.prio === "low" ? "bcg text-color-reverse font-bold active" : ""}" id="prioritize-button-low" value="low">Low <img id="svg-low-task" src="/icons/prio-low.svg" alt="Low" class="atb-sitz"/></button>
                   </p>
                </div>
                <div class="edit-Task-Category">
                    <div class="category-title">
                         Category
                    </div>

                    <div class="edit-custom-select-container" id="custom-select-container">
                        <div class="custom-select" id="customSelect">
                        <span class="selected-option">${task.category === "Technical Task" ? "Technical Task" : "User Story"}</span>
                            <svg class="custom-arrow" width="14" height="14" viewBox="0 0 24 24">
                                <path d="M7 10l5 5 5-5z"></path>
                            </svg>
                        </div>
                        <ul class="options-list" id="optionsList">
                            <li class="${task.category === "Technical Task" ? "selected" : ""}">Technical Task</li>
                            <li class="${task.category === "User Story" ? "selected" : ""}">User Story</li>
                        </ul>
                    </div>
                </div>
${
  subtasks.length > 0
    ? `             
<div class="edit-Task-subtask">
    <div class="subtask-title">
        Subtasks
    </div>
    <div class="edit-subtask-task">
        <ul>
            ${subtasks
              .map(
                (subtask, index) => `
            <li>
                <input 
                    type="checkbox" 
                    ${subtask.done ? "checked" : ""} 
                    onchange="toggleSubtaskStatus('${task.databaseKey}', ${index}, this.checked)">
                <input 
                    class="subtask-title-input"
                    type="text" 
                    value="${subtask.title}" 
                    onblur="saveSubtaskEdit('${task.databaseKey}', ${index}, this.value)">
                <button 
                    class="btn-remove-subtask" 
                    onclick="removeSubtask('${task.databaseKey}', ${index}')">
                    Remove
                </button>
            </li>`,
              )
              .join("")}
        </ul>
    </div>
  </div>
</div>`
    : ""
}
                
                <div class="edit-button">
                        <button class="edit-submit" onclick="updateTask('${task.databaseKey}', '${task.progress}');">Save Task</button>
                </div>
                
            </form>
    </div>
    `;

    const buttonLow = document.getElementById("prioritize-button-low");
    const buttonMedium = document.getElementById("prioritize-button-medium");
    const buttonHigh = document.getElementById("prioritize-button-high");

    const svgLow = document.getElementById("svg-low-task");
    const svgMedium = document.getElementById("svg-medium-task");
    const svgHigh = document.getElementById("svg-high-task");

    const customSelect = document.getElementById("customSelect");
    const optionsList = document.getElementById("optionsList");
    const selectedOption = document.querySelector(".selected-option");

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

    boxShadow();

    // Event-Listener für Formular-Submit verhindern
    document.querySelector(".task-form").addEventListener("submit", (event) => {
      event.preventDefault();
    });

    // Öffnet oder schließt das Dropdown-Menü beim Klicken
    customSelect.addEventListener("click", () => {
      const isOpen = optionsList.style.display === "block";
      optionsList.style.display = isOpen ? "none" : "block";
      customSelect.classList.toggle("open", !isOpen); // Toggle für die Pfeildrehung
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
  }
}

/**
 * Setze einen Shadow um die Button Low/Medium/High
 */
function boxShadow() {
  const buttonLow = document.getElementById("prioritize-button-low");
  const buttonMedium = document.getElementById("prioritize-button-medium");
  const buttonHigh = document.getElementById("prioritize-button-high");

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
}

/**
 *  Lösche alle Klassen aus den Ad-Task Buttons
 */
function deleteButtonColor() {
  const buttonLow = document.getElementById("prioritize-button-low");
  const buttonMedium = document.getElementById("prioritize-button-medium");
  const buttonHigh = document.getElementById("prioritize-button-high");

  const svgLow = document.getElementById("svg-low-task");
  const svgMedium = document.getElementById("svg-medium-task");
  const svgHigh = document.getElementById("svg-high-task");

  // Löscht alle Klassen vom Low Button
  buttonLow.classList.remove("bcg", "text-color-reverse", "font-bold");

  // Löscht alle Klassen vom Medium Button

  buttonMedium.classList.remove("bco", "text-color-reverse", "font-bold");
  svgMedium.classList.add("filter-standard");
  svgMedium.dataset.value = "medium";

  // Löscht alle Klassen vom High Button

  buttonHigh.classList.remove("bcr", "text-color-reverse", "font-bold");
}

/**
 *
 * @param taskKey
 * @param subtaskIndex
 * @returns {Promise<void>}
 */
async function removeSubtask(taskKey, subtaskIndex) {
  try {
    // Entferne den Subtask lokal
    const task = tasks.find((task) => task.databaseKey === taskKey);
    if (!task) return;

    task.subtask.splice(subtaskIndex, 1);

    // Entferne den Subtask aus Firebase
    await fetch(`${BASE_URL}/tasks/${taskKey}/subtask.json`, {
      method: "PUT", // Überschreibt die gesamte Subtask-Liste
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task.subtask),
    });

    console.log(`Subtask ${subtaskIndex} erfolgreich entfernt.`);
    openOrCloseEditTask(taskKey); // UI aktualisieren
  } catch (error) {
    console.error("Fehler beim Entfernen des Subtasks:", error);
  }
}

/**
 *
 * @param taskKey
 * @param subtaskIndex
 * @param newTitle
 * @returns {Promise<void>}
 */
async function saveSubtaskEdit(taskKey, subtaskIndex, newTitle) {
  try {
    if (newTitle.trim() === "") {
      showToast("Der Titel der Unteraufgabe darf nicht leer sein.", "#F44336");
      return;
    }

    // Lokale Änderung
    const task = tasks.find((task) => task.databaseKey === taskKey);
    if (!task) return;

    task.subtask[subtaskIndex].title = newTitle;

    // Firebase aktualisieren
    await fetch(`${BASE_URL}/tasks/${taskKey}/subtask/${subtaskIndex}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    console.log(`Subtask ${subtaskIndex} erfolgreich bearbeitet.`);
  } catch (error) {
    console.error("Fehler beim Speichern des Subtasks:", error);
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

async function updateTask(currentTaskKey, progressNow) {
  const taskKey = currentTaskKey;

  if (!taskKey) {
    console.error("Kein Task-Schlüssel verfügbar!");
    return;
  }

  // Sammle aktuelle Werte aus dem Formular
  const title = document.getElementById("editTaskTitle").value.trim();
  const description = document
    .getElementById("editTaskDescription")
    .value.trim();
  const date = document.getElementById("date").value;

  // Prio
  const prioButtons = document.querySelectorAll(".edit-task-button-set button");
  let prio = "";
  prioButtons.forEach((button) => {
    if (button.classList.contains("active")) {
      prio = button.value;
    }
  });

  // Kategorie
  const categoryElement = document.querySelector(".selected-option");
  const category = categoryElement ? categoryElement.innerText : "";

  // Subtasks
  const subtaskElements = document.querySelectorAll(".edit-subtask-task ul li");
  const subtasks = Array.from(subtaskElements).map((li) => ({
    done: li.querySelector("input[type='checkbox']").checked,
    title: li.querySelector(".subtask-title-input").value,
  }));

  const updatedTask = {
    title,
    description,
    date,
    prio,
    category,
    progress: progressNow,
    subtask: subtasks,
  };

  try {
    // Aktualisiere Task in der Datenbank
    const response = await fetch(`${BASE_URL}/tasks/${taskKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren des Tasks");
    }

    console.log("Task erfolgreich aktualisiert!");

    // Aktualisiere das lokale tasks-Array
    const taskIndex = tasks.findIndex((task) => task.databaseKey === taskKey);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    }

    // HTML aktualisieren
    updateHTML();
    hideOverlayTask(); // Schließt das Overlay
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks:", error);
  }
}
