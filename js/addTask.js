"use strict";

const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputDate = document.getElementById("date");
const inputCategory = document.getElementById("category");
const inputSub = document.getElementById("subtask");
const buttonLow = document.getElementById("prioritize-button-low");
const buttonMedium = document.getElementById("prioritize-button-medium");
const buttonHigh = document.getElementById("prioritize-button-high");

const svgLow = document.getElementById("svg-low");
const svgMedium = document.getElementById("svg-medium");
const svgHigh = document.getElementById("svg-high");

document.addEventListener("DOMContentLoaded", (event) => {

    setStartColorSVG();

});

function setStartColorSVG() {
    svgLow.classList.add("filter-green");
    svgMedium.classList.add("filter-black");
    buttonMedium.classList.add("bco","text-color-reverse", "font-bold");
    svgHigh.classList.add("filter-red");
}


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

// Beim Klicken auf das Category-Feld den Rahmen setzen
inputCategory.addEventListener("click", (event) => {
    inputCategory.style.border = "solid 1px var(--border-input-focus)";
    inputTitle.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDescription.style.border = "solid 1px var(--border-inputfeld-login)";
    inputDate.style.border = "solid 1px var(--border-inputfeld-login)";
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
    buttonLow.classList.add("active-color");
    buttonMedium.classList.remove("active-color");
    buttonHigh.classList.remove("active-color");
});

buttonMedium.addEventListener("click", () => {
    buttonMedium.classList.add("active-color");
    buttonLow.classList.remove("active-color");
    buttonHigh.classList.remove("active-color");
});

buttonHigh.addEventListener("click", () => {
    buttonHigh.classList.add("active-color");
    buttonLow.classList.remove("active-color");
    buttonMedium.classList.remove("active-color");
});