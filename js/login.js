"use strict";

const mailInput = document.getElementById("mailInput");
const pwdInput = document.getElementById("pwdInput");
const signUpButton = document.getElementById("sign-up");
const loginButton = document.getElementById("log");
const guestLoginButton = document.getElementById("guest-log");
const pwdInputIcon = document.getElementById("pwd");
const BASE_URL = "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
const autoFill  = document.getElementById("auto-login");


document.addEventListener('DOMContentLoaded', (event) => {
    themeToggle();
    w3.includeHTML();
    cleanFields();

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
        return data;
    } catch (error) {
        console.error("Failed to load data:", error.message);
        return null;
    }

}

function login(users) {
    const mail = document.getElementById("mail").value.trim();
    const pwd = document.getElementById("pwd").value.trim();

    // Validierung der Eingaben
    if (!mail || !pwd) {
        showToast("Sie müssen Benutzerdaten eingeben.");
        return;
    }

    // Durchlaufe alle Benutzer
    let userFound = false;
    for (let userId in users) {
        const userData = users[userId];

        // Überprüfen, ob die eingegebene E-Mail und das Passwort übereinstimmen
        if (userData.email === mail && userData.password === pwd) {
            console.log("Login erfolgreich für Benutzer:", userData);
            userFound = true;
            // Hier könnte eine Weiterleitung zum Board oder eine Session gesetzt werden
            window.location.href = "/board.html"; // Weiterleitung
            break; // Beende die Schleife, wenn der Benutzer gefunden wurde
        }
    }

    if (!userFound) {
        showToast("Du hast die falschen Daten eingegeben.");
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

// Beim Klick auf Auto Fill werden daten eingesetzt

    autoFill.addEventListener("click", (event) => {


        const autoMail = document.getElementById("mail");
        const autoPWD = document.getElementById("pwd");

        autoMail.value = "demo@posteo.de";
        autoPWD.value = "demo";


    });

/**
 * Event, das das Entfernen der Rahmen steuert, wenn außerhalb der Felder geklickt wird
 */
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


/**
 * AnimierteLogo beim Starten
 */
window.addEventListener('load', () => {
    const logoContainer = document.querySelector('.logo-container');

    // Verhindere die Animation beim direkten Laden
    setTimeout(() => {
        logoContainer.classList.add('moved');
    }, 400); // Startet die Animation nach 500ms, um einen kurzen Ladeeffekt zu ermöglichen
});


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
 * Säubert alle Felder beim laden
 */
function cleanFields() {

    const mailInput = document.getElementById("mail");
    const pwdInput = document.getElementById("pwd");

    mailInput.value = "";
    pwdInput.value = "";
}