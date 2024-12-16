const dropUser = "";
document.addEventListener("DOMContentLoaded", function () {
  checkUserLoggedIn();
});

/**
 * Prüft, ob ein Benutzer angemeldet ist, indem es das Vorhandensein eines Benutzer-Tokens in localStorage überprüft.
 * Wenn ein Benutzer angemeldet ist, wird die Seite angezeigt, andernfalls wird auf die Anmeldeseite umgeleitet.
 */
function checkUserLoggedIn() {
  setTimeout(() => {
    const dropUser = document.getElementById("dropUser");
    const user = localStorage.getItem("currentUser");
    const result = user ? user.charAt(0).toUpperCase() : "N/A";

    dropUser.innerText = "";
    dropUser.innerText = result;
  }, 200);
}

/**
 * Meldet den aktuellen Benutzer ab, indem das Benutzertoken aus localStorage entfernt und zur Anmeldeseite weitergeleitet wird.
 */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "./index.html";
}

/**
 * Öffnet ein Informationsfeld (Infobox) und lädt dessen Inhalt. Fügt einen Ereignis-Listener hinzu
 * um die Infobox zu schließen, wenn der Benutzer außerhalb der Infobox klickt.
 */
function dropDown() {
  document.getElementById("dropDown").classList.toggle("show");
}

/**
 * Schließt das Informationsfeld (Infobox), indem es ausgeblendet und sein Inhalt gelöscht wird.
 */

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
