"use strict";

const loadingIndicator = document.getElementById("loading");
const mailInput = document.getElementById("mailInput");
const pwdInput = document.getElementById("pwdInput");
const signUpButton = document.getElementById("sign-up");
const loginButton = document.getElementById("log");



document.addEventListener('DOMContentLoaded', (event) => {
    showLoading();
    themeToggle();
    hideLoading();
    w3.includeHTML();
});



// Beim Klicken auf das E-Mail-Feld den Rahmen setzen
mailInput.addEventListener("click", (event) => {
    mailInput.style.border = "solid 1px var(--border-input-focus)";
    pwdInput.style.border = "solid 1px var(--border-inputfeld-login)";
});

// Beim Klicken auf das Passwort-Feld den Rahmen setzen
pwdInput.addEventListener("click", (event) => {
    pwdInput.style.border = "solid 1px var(--border-input-focus)";
    mailInput.style.border = "solid 1px var(--border-inputfeld-login)";
});

// Event, das das Entfernen der Rahmen steuert, wenn außerhalb der Felder geklickt wird
document.addEventListener("click", (event) => {
    // Prüfen, ob der Klick nicht auf das E-Mail- oder Passwortfeld erfolgt ist
    if (!mailInput.contains(event.target) && !pwdInput.contains(event.target)) {
        mailInput.style.border = "solid 1px var(--border-inputfeld-login)"; // Standart Rahmen hinzufügen
        pwdInput.style.border = "solid 1px var(--border-inputfeld-login)";  // Standart Rahmen hinzufügen
    }
});


signUpButton.addEventListener("mouseover", (event) => {
   signUpButton.classList.add("focus-sign-up");
   signUpButton.classList.remove("sign-up");
});

signUpButton.addEventListener("mouseout", (event) => {
    signUpButton.classList.add("sign-up");         // Hinzufügen der ursprünglichen Klasse
    signUpButton.classList.remove("focus-sign-up"); // Entfernen der Fokus-Klasse
});


loginButton.addEventListener("mouseover", (event) => {
    loginButton.classList.add("focus-login");
    loginButton.classList.remove("submit-login");
});






/**
 * Show Spinner
 */
function showLoading() {
    loadingIndicator.classList.add("active");
}


/**
 * Hide Spinner
 */
function hideLoading() {
    loadingIndicator.classList.remove("active");
}
