"use strict";

const loadingIndicator = document.getElementById("loading");




document.addEventListener('DOMContentLoaded', () => {
    showLoading();

    themeToggle();

    hideLoading();

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
