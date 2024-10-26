const tasks = [{
    "category": "User Story",
    "contacts": [
      "Max Mustermann"
    ],
    "databaseKey": "-O8loADmcZ2h2D9qHeg3",
    "date": "2024-10-12",
    "description": "Dieser Task wird benötigt um das editieren auf der Board Seite zu simulieren.",
    "prio": "medium",
    "progress": "to-do",
    "subtask": [
      {
        "done": false,
        "title": "Subtask 1"
      },
      {
        "done": false,
        "title": "Add new Subtask"
      },
      {
        "done": true,
        "title": "Editieren funktioniert"
      }
    ],
    "title": "Test Task für das Editieren."
  }, {
    "category": "Technical Task",
    "contacts": [
      "Max Mustermann"
    ],
    "databaseKey": "-O9-9mjJbFH1o3WGp8NR",
    "date": "2024-10-14",
    "description": "controll every point of the list",
    "prio": "high",
    "progress": "in-progress",
    "title": "join "
  }, {
    "category": "User Story",
    "contacts": [
      "Max Mustermann"
    ],
    "databaseKey": "-O9-9mjJbFH1o3WGp8NR",
    "date": "2024-10-14",
    "description": "controll Array",
    "prio": "high",
    "progress": "to-do",
    "title": "dritter task "
  }];

let currentDraggedElement;
let currentTask;

window.onload = () => {
    includeHTML();
    updateHTML();
}

function updateHTML() {
    renderTaskSection('toDo', 'to-do');
    renderTaskSection('inProgress', 'in-progress');
}

function renderTaskSection(section, keyword) {
    const filteredTask = tasks.filter((t, i) => t.progress == keyword);
    document.getElementById(section).innerHTML = '';

    filteredTask.forEach((task, i) => {
        currentTask = task;
        document.getElementById(section).innerHTML += generateTodoHTML(task, i);
    });

}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(task, i) {
    return `<div draggable="true" ondragstart="startDragging(${i})" class="todo">${task.title}</div>`;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}