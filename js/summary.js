"use strict";

let currentDate = new Date();
let currentHour = currentDate.getHours();
const userName = localStorage.getItem("currentUser");
const BASE_URL =
  "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";

document.addEventListener("DOMContentLoaded", (event) => {
  setWelcomeText();
  clearAllElements();

  countTasksByStatus("to-do", ".st-todo .st-number");
  // In-Progress-Aufgaben zählen
  countTasksByStatus("in-progress", ".st-in-progress .st-number");
  // Done-Aufgaben zählen
  countTasksByStatus("done", ".st-done .st-number");
  // Awaiting Feedback-Aufgaben zählen
  countTasksByStatus("await-feedback", ".st-feedback .st-number");
  // Alle Task zusammen zählen
  countAllTasks();
  countHighPriorityTasks();
  setUpcomingDeadline();
});

function setWelcomeText() {
  let welcomeText = document.getElementById("welcomeText");
  let welcomeName = document.getElementById("welcomeName");

  welcomeText.innerText = "";
  welcomeName.innerText = "";

  if (welcomeText) {
    if (currentHour >= 6 && currentHour <= 11) {
      welcomeText.innerText = "Good Morning,";
    } else if (currentHour >= 12 && currentHour <= 17) {
      welcomeText.innerText = "Good Afternoon,";
    } else if (currentHour >= 18 && currentHour <= 22) {
      welcomeText.innerText = "Good Evening,";
    } else {
      welcomeText.innerText = "Good Night,";
    }
    welcomeName.innerText = userName === null ? "Guest" : userName;
  } else {
    console.error("Element with ID 'welcomeText' not found.");
  }
}

/**
 *
 * @returns {Promise<any|null>}
 */
async function fetchTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`);
    if (!response.ok) {
      throw new Error("Fehler beim Abrufen der Aufgaben");
    }
    const data = await response.json();
    return data; // Gibt alle Aufgaben zurück
  } catch (error) {
    console.error("Fehler beim Abrufen der Aufgaben:", error);
    return null;
  }
}

async function countTasksByStatus(status, selector) {
  const tasks = await fetchTasks();
  if (!tasks) {
    console.error("Keine Aufgaben gefunden!");
    return;
  }

  // Filtere die Aufgaben nach dem angegebenen Status
  let count = 0;
  for (const key in tasks) {
    if (tasks[key].progress === status) {
      count++;
    }
  }

  // Zeige die Anzahl der Aufgaben im entsprechenden HTML-Element an
  const element = document.querySelector(selector);
  if (element) {
    element.innerText = count;
  } else {
    console.error(`Element für '${status}' nicht gefunden!`);
  }
}

/**
 *
 * @returns {Promise<void>}
 */
async function countAllTasks() {
  const tasks = await fetchTasks();
  if (!tasks) {
    console.error("Keine Aufgaben gefunden!");
    return;
  }

  // Gesamtanzahl berechnen
  const totalCount = Object.keys(tasks).length;

  // Zeige die Gesamtanzahl im entsprechenden HTML-Element an
  const totalElement = document.querySelector(".st-in-board .st-number");
  if (totalElement) {
    totalElement.innerText = totalCount;
  } else {
    console.error("Element für die Gesamtanzahl nicht gefunden!");
  }
}

function clearAllElements() {
  // Selektiere alle relevanten Elemente
  const elementsToClear = document.querySelectorAll(
    ".st-todo .st-number, .st-in-progress .st-number, .st-done .st-number, .st-feedback .st-number, .st-in-board .st-number, .st-deadline, .st-number",
  );

  // Leere den Textinhalt aller gefundenen Elemente
  elementsToClear.forEach((element) => {
    element.innerText = "";
  });
}

/**
 * Findet das früheste Datum aus den Tasks und zeigt es an.
 */
async function setUpcomingDeadline() {
  const tasks = await fetchTasks(); // Tasks aus der Datenbank abrufen
  if (!tasks) {
    console.error("Keine Aufgaben gefunden!");
    return;
  }

  // Filtere Tasks, die ein gültiges Datum haben
  const tasksWithDates = Object.values(tasks).filter((task) => task.date);

  if (tasksWithDates.length === 0) {
    console.error("Keine Aufgaben mit Datum gefunden!");
    return;
  }

  // Finde das früheste Datum
  let earliestDate = tasksWithDates[0].date; // Start mit dem ersten Task
  tasksWithDates.forEach((task) => {
    if (new Date(task.date) < new Date(earliestDate)) {
      earliestDate = task.date;
    }
  });

  // Datum im HTML anzeigen
  const deadlineElement = document.querySelector(".st-deadline");
  if (deadlineElement) {
    deadlineElement.innerText = formatDate(earliestDate); // Optional: Datum formatieren
  } else {
    console.error("Element für 'Upcoming Deadline' nicht gefunden!");
  }
}

/**
 * Formatiert ein Datum in lesbarem Format.
 * @param {string} dateStr - Das Datum als String im ISO-Format.
 * @returns {string} - Das formatierte Datum (z. B. "December 10, 2024").
 */
function formatDate(dateStr) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
}

/**
 * Zählt die Anzahl der Tasks mit der Priorität "high" und zeigt sie an.
 */
async function countHighPriorityTasks() {
  const tasks = await fetchTasks(); // Tasks aus der Datenbank abrufen
  if (!tasks) {
    console.error("Keine Aufgaben gefunden!");
    return;
  }

  // Filtere die Aufgaben mit der Priorität "high"
  let highPrioCount = 0;
  for (const key in tasks) {
    if (tasks[key].prio === "high") {
      highPrioCount++;
    }
  }

  // Zeige die Anzahl der High-Priority-Aufgaben im HTML an
  const highPrioElement = document.querySelector(".st-info-left .st-number");
  if (highPrioElement) {
    highPrioElement.innerText = highPrioCount;
  } else {
    console.error("Element für 'High Priority'-Zählung nicht gefunden!");
  }
}
