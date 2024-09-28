"use strict";

const BASE_URL = "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
const toastLoginDesc = document.getElementById("desc");
const nameInput = document.getElementById("nameInput");
const pwdInputConfirm = document.getElementById("pwdInputConfirm");
const mailInput = document.getElementById("mailInput");
const pwdInput = document.getElementById("pwdInput");
const pwdInputIcon = document.getElementById("pwd");
const pwdInputIconConfirm = document.getElementById("pwdConfirm");


document.addEventListener('DOMContentLoaded', (event) => {
    themeToggle();
    w3.includeHTML();
    cleanFields();
    //postData("/users", {"email": "test@test.com", "password": "1234"});
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

    cleanFields();
});


/**
 * Toast Benachrichtigung
 */
function showToast(text){
    var x=document.getElementById("toast");
    x.classList.add("show");
    x.innerHTML=text;
    setTimeout(function(){
        x.classList.remove("show");
    },4000);
}


/**
 * Passwort Feld
 */
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
 * Passwort Confirm Feld
 */
pwdInputIconConfirm.addEventListener("click", (event) => {
    const isIconClicked = event.offsetX > pwdInputIconConfirm.clientWidth - 30;

    if (isIconClicked) {
        if (pwdInputIconConfirm.classList.contains("visibility")) {
            pwdInputIconConfirm.classList.remove("visibility");
            pwdInputIconConfirm.classList.add("hidden");
            pwdInputIconConfirm.type = "text"; // Passwort anzeigen
        } else {
            pwdInputIconConfirm.classList.remove("hidden");
            pwdInputIconConfirm.classList.add("visibility");
            pwdInputIconConfirm.type = "password"; // Passwort verbergen
        }
    }
});



/**
 * Beim Klicken auf das Name-Feld den Rahmen setzen
 */
nameInput.addEventListener("click", (event) => {
    nameInput.style.border = "solid 1px var(--border-input-focus)";
    pwdInput.style.border = "solid 1px var(--border-inputfeld-login)";
    mailInput.style.border = "solid 1px var(--border-inputfeld-login)";
    pwdInputConfirm.style.border = "solid 1px var(--border-inputfeld-login)";
});

/**
 * Beim Klicken auf das E-Mail-Feld den Rahmen setzen
 */

mailInput.addEventListener("click", (event) => {
    mailInput.style.border = "solid 1px var(--border-input-focus)";
    pwdInput.style.border = "solid 1px var(--border-inputfeld-login)";
    pwdInputConfirm.style.border = "solid 1px var(--border-inputfeld-login)";
    nameInput.style.border = "solid 1px var(--border-inputfeld-login)";
});

/**
 * Beim Klicken auf das Passwort-Feld den Rahmen setzen
 */

pwdInput.addEventListener("click", (event) => {
    pwdInput.style.border = "solid 1px var(--border-input-focus)";
    mailInput.style.border = "solid 1px var(--border-inputfeld-login)";
    pwdInputConfirm.style.border = "solid 1px var(--border-inputfeld-login)";
    nameInput.style.border = "solid 1px var(--border-inputfeld-login)";
});


/**
 * Beim Klicken auf das Passwort Confirm-Feld den Rahmen setzen
 */
pwdInputIconConfirm.addEventListener("click", (event) => {
    pwdInputConfirm.style.border = "solid 1px var(--border-input-focus)";
    pwdInput.style.border = "solid 1px var(--border-inputfeld-login)";
    mailInput.style.border = "solid 1px var(--border-inputfeld-login)";
    nameInput.style.border = "solid 1px var(--border-inputfeld-login)";
});


/**
 * Event, das das Entfernen der Rahmen steuert, wenn außerhalb der Felder geklickt wird
 */
document.addEventListener("click", (event) => {
    // Prüfen, ob der Klick nicht auf das E-Mail- oder Passwortfeld erfolgt ist
    if (!mailInput.contains(event.target) && !pwdInput.contains(event.target) && !nameInput.contains(event.target) && !pwdInputConfirm.contains(event.target)) {
        mailInput.style.border = "solid 1px var(--border-inputfeld-login)"; // Standart Rahmen hinzufügen
        pwdInput.style.border = "solid 1px var(--border-inputfeld-login)";  // Standart Rahmen hinzufügen
        pwdInputConfirm.style.border = "solid 1px var(--border-inputfeld-login)";  // Standart Rahmen hinzufügen
        nameInput.style.border = "solid 1px var(--border-inputfeld-login)";  // Standart Rahmen hinzufügen
    }
});

/**
 * Säubert alle Felder beim laden
 */
function cleanFields() {
    const isPoliceChecked = document.getElementById("myCheckbox");
    const nameInput = document.getElementById("name");
    const mailInput = document.getElementById("mail");
    const pwdInput = document.getElementById("pwd");
    const pwdConfirmInput = document.getElementById("pwdConfirm");

    nameInput.value = "";
    mailInput.value = "";
    pwdInput.value = "";
    pwdConfirmInput.value = "";
    isPoliceChecked.checked = "";

}

async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 * Sende das Formular ab
 */
document.getElementById("submit-singup").addEventListener("click", async (event) => {
    event.preventDefault(); // Verhindert das automatische Abschicken des Formulars

    const isPoliceChecked = document.getElementById("myCheckbox").checked;


    console.log("klick button:", isPoliceChecked);

    if (isPoliceChecked) {
        //Hier kommt die logik rein was soll passieren, wenn der haken gesetzt wurde
        console.log("check");
    } else {
        //Hier kommt die Logik rein was passieren soll, wenn der haken nicht gesetzt wurde
        console.log("not check");
    }

});


