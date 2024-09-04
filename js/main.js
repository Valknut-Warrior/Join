"use strict";

const loadingIndicator = document.getElementById("loading");
const mailInput = document.getElementById("mailInput");
const pwdInput = document.getElementById("pwdInput");
const loginPage = document.getElementById("login-button");




document.addEventListener('DOMContentLoaded', (event) => {
    showLoading();
    themeToggle();
    hideLoading();
    w3.includeHTML();
});



mailInput.addEventListener("click", (event) => {
    mailInput.style.border = "solid 1px var(--border-input-focus)";
    pwdInput.style.border = "solid 1px var(--border-inputfeld-login";
});


pwdInput.addEventListener("click", (event) => {
   pwdInput.style.border = "solid 1px var(--border-input-focus)";
   mailInput.style.border = "solid 1px var(--border-inputfeld-login)";
});


loginPage.addEventListener('click', (event) => {
    mailInput.style.border = "solid 1px var(--border-inputfeld-login)";
    pwdInput.style.border = "solid 1px var(--border-inputfeld-login";
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
