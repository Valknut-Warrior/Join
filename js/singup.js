"use strict";

const BASE_URL = "https://join-38273-default-rtdb.europe-west1.firebasedatabase.app/";
const toastLoginDesc = document.getElementById("desc");
const mailInput = document.getElementById("mailInput");
const pwdInput = document.getElementById("pwdInput");
const pwdInputIcon = document.getElementById("pwd");
const pwdInputIconConfirm = document.getElementById("pwdConfirm");


document.addEventListener('DOMContentLoaded', (event) => {
    themeToggle();
    w3.includeHTML();
});


window.addEventListener('load', () => {
    const logoContainer = document.querySelector('.logo-container');

    // Verhindere die Animation beim direkten Laden
    setTimeout(() => {
        logoContainer.classList.add('moved');
    }, 400); // Startet die Animation nach 500ms, um einen kurzen Ladeeffekt zu ermöglichen
});

function launch_toast() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}


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