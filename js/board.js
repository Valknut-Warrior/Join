"use strict";

const BASE_URL = "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
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
      tasks = Object.values(data); // Konvertiert das Objekt in ein Array
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
  tasks.forEach(task => {
    task.id = currentID;
    currentID++;
  });
}

/**
 * Aktualisiert das Task-Board, indem die Tasks in die entsprechenden Bereiche gerendert werden.
 */
function updateHTML() {
  renderTaskSection('toDo', 'to-do');
  renderTaskSection('inProgress', 'in-progress');
  renderTaskSection('awaitFeedback', 'await-feedback');
  renderTaskSection('done', 'done');
}

/**
 * Rendert die Tasks in einen bestimmten Bereich basierend auf ihrem Fortschritt.
 *
 * @param {string} section - Die ID des HTML-Elements, das den Aufgabenbereich repräsentiert.
 * @param {string} keyword - Der Fortschrittsstatus, nach dem Tasks gefiltert werden (z. B. "to-do", "done").
 */
function renderTaskSection(section, keyword) {
  const filteredTasks = tasks.filter(task => task.progress === keyword);
  const container = document.getElementById(section);
  container.innerHTML = '';

  if (filteredTasks.length > 0) {
    filteredTasks.forEach(task => {
      container.innerHTML += generateTodoHTML(task);
    });
  } else {
    container.innerHTML = `<span class="noTaskSpan">Keine Aufgaben in ${keyword}</span>`;
  }
}

/**
 * Generiert den HTML-Code für eine einzelne Aufgabe.
 *
 * @param {Object} task - Das Aufgabenobjekt, das gerendert werden soll.
 * @returns {string} - Der HTML-String, der die Aufgabe darstellt.
 */
function generateTodoHTML(task) {
  let categoryClass = '';
  if (task.category === 'Technical Task') {
    categoryClass = 'category-technical';
  } else {
    categoryClass = 'category-story';
  }
  return `
        <div class="list" draggable="true" 
             ondragstart="startDragging(${task.id})" 
             ondragend="clearAllHighlights()" 
             class="todo">
             <div class="task-card-category">
             <span class="${categoryClass}">${task.category}</span>
             </div>
             <h3 class="task-card-title">${task.title}</h3>
            <p class="task-card-description">${task.description}</p>
        </div>`;
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
  tasks[currentDraggedElement].progress = progress;
  updateHTML();
}

/**
 * Hebt den Drop-Bereich hervor, wenn ein ziehbares Element darüber schwebt.
 *
 * @param {string} id - Die ID des Drop-Bereichs, der hervorgehoben werden soll.
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Entfernt die Hervorhebung von allen Drop-Bereichen.
 */
function clearAllHighlights() {
  const dropZones = document.querySelectorAll('.drag-area');
  dropZones.forEach(zone => {
    zone.classList.remove('drag-area-highlight');
  });
}

/**
 * Entfernt die Hervorhebung von einem bestimmten Drop-Bereich.
 *
 * @param {string} id - Die ID des Drop-Bereichs, dessen Hervorhebung entfernt werden soll.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}