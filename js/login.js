"use strict";

const loadingIndicator = document.getElementById("loading");
const mailInput = document.getElementById("mailInput");
const pwdInput = document.getElementById("pwdInput");
const signUpButton = document.getElementById("sign-up");
const loginButton = document.getElementById("log");
const guestLoginButton = document.getElementById("guest-log");
const pwdInputIcon = document.getElementById("pwd");
const userLogin = document.getElementById("submit-login");
const BASE_URL = "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
const toastLoginDesc = document.getElementById("desc");


document.addEventListener('DOMContentLoaded', (event) => {
    showLoading();
    themeToggle();
    hideLoading();
    w3.includeHTML();
});


/**
 *
 * @param path
 * @returns {Promise<void>}
 */


async function loadData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        let data = await response.json();
        //console.log("Datenbank auslesen: " + data.email);
        return data;

    } catch (error) {
        console.error("Failed to load data:", error.message);
        return null;
    }

}


function login(data) {
    const mail = document.getElementById("mail");
    const pwd = document.getElementById("pwd");

    // Validierung der Eingaben
    if (!mail.value || !pwd.value) {
        toastLoginDesc.innerText = "Sie müssen Benutzerdaten eingeben.";
        launch_toast();
        return; // Funktion hier beenden
    }

    // Sicherstellen, dass "data", "data.email" und "data.password" definiert sind
    if (data && data.email && data.password) {
        const dataMail = data.email.toString();
        const dataPwd = data.password.toString();

        // Überprüfen, ob die eingegebene Mail mit der Datenbank übereinstimmt
        if (mail.value === dataMail && pwd.value === dataPwd) {
            //console.log("Deine Daten lauten: " + JSON.stringify(data));
            // Hir kommt die weiterleitung zum Board

        } else {
            launch_toast();
            toastLoginDesc.innerText = "Du hast die falschen Daten eingegeben.";
        }
    } else {
        console.error("Die Daten sind nicht vorhanden oder ungültig.");
    }
}




document.getElementById("submit-login").addEventListener("click", async (event) => {
    event.preventDefault(); // Verhindert das automatische Abschicken des Formulars
    const users = await loadData("/users");
    login(users); // Übergibt die geladenen Benutzerdaten an die login-Funktion
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
    signUpButton.classList.add("sign-up");
    signUpButton.classList.remove("focus-sign-up");
});


loginButton.addEventListener("mouseover", (event) => {
    loginButton.classList.add("focus-login");
    loginButton.classList.remove("submit-login");
});

loginButton.addEventListener("mouseout", (event) => {
    loginButton.classList.add("submit-login");
    loginButton.classList.remove("focus-login");
});


guestLoginButton.addEventListener("mouseover", (event) => {
    guestLoginButton.classList.add("focus-guest");
    guestLoginButton.classList.remove("submit-guest");
});

guestLoginButton.addEventListener("mouseout", (event) => {
    guestLoginButton.classList.add("submit-guest");
    guestLoginButton.classList.remove("focus-guest");
});



pwdInputIcon.addEventListener("focus", () => {
    pwdInputIcon.classList.add("visibility"); // Das visibility_off Icon anzeigen, wenn das Feld fokussiert ist
});

pwdInputIcon.addEventListener("click", (event) => {
    const isIconClicked = event.offsetX > pwdInputIcon.clientWidth - 30;

    if (isIconClicked) {
        if (pwdInputIcon.classList.contains("visibility")) {
            pwdInputIcon.classList.remove("visibility");
            pwdInputIcon.classList.add("hidden");
            pwdInputIcon.type = "text"; // Passwort anzeigen
        } else {
            pwdInputIcon.classList.remove("hidden");
            pwdInputIcon.classList.add("visibility");
            pwdInputIcon.type = "password"; // Passwort verbergen
        }
    }
});



window.addEventListener('load', () => {
    const logoContainer = document.querySelector('.logo-container');

    // Verhindere die Animation beim direkten Laden
    setTimeout(() => {
        logoContainer.classList.add('moved');
    }, 400); // Startet die Animation nach 500ms, um einen kurzen Ladeeffekt zu ermöglichen
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


function launch_toast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}
