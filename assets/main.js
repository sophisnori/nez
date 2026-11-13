/* Swiss Report Forum – minimales JavaScript (kein Framework, kein Tracking).
   Fiktives Medium für ein Schulprojekt. Es werden keine Daten versendet. */
(function () {
  "use strict";

  // "Als PDF speichern": öffnet den Druckdialog, das Print-Stylesheet macht den Rest.
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.print(); });
  });

  // Teilen-Buttons
  var status = document.querySelector(".share-status");
  function say(msg) { if (status) { status.textContent = msg; } }

  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = window.location.href.split("#")[0];
      var title = document.title.replace(/ – Swiss Report Forum$/, "");
      var kind = btn.getAttribute("data-share");

      if (kind === "native" && navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
        return;
      }
      if (kind === "copy" || kind === "native") {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(
            function () { say("Link kopiert."); },
            function () { say("Kopieren nicht möglich – bitte Adresse manuell kopieren."); }
          );
        } else {
          say("Kopieren nicht möglich – bitte Adresse manuell kopieren.");
        }
        return;
      }
      var text = encodeURIComponent(title + " " + url);
      var targets = {
        mail: "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(url),
        whatsapp: "https://wa.me/?text=" + text,
        x: "https://x.com/intent/post?text=" + text
      };
      if (targets[kind]) { window.open(targets[kind], "_blank", "noopener"); }
    });
  });

  // Daumen hoch/runter im Forum (nur lokal, ohne Speicherung)
  document.querySelectorAll(".vote").forEach(function (btn) {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      var n = btn.querySelector(".n");
      var pressed = btn.getAttribute("aria-pressed") === "true";
      var count = parseInt(n.textContent, 10) || 0;
      n.textContent = pressed ? count - 1 : count + 1;
      btn.setAttribute("aria-pressed", pressed ? "false" : "true");
    });
  });

  // "Antworten" springt ins Kommentarfeld
  document.querySelectorAll(".reply-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var field = document.getElementById("comment-text");
      if (!field) { return; }
      var name = btn.closest(".comment").querySelector(".comment-head strong").textContent;
      field.value = "@" + name + " ";
      field.focus();
    });
  });

  // Formulare: nichts wird gesendet, nur Rückmeldung
  function fakeSubmit(selector, msg) {
    document.querySelectorAll(selector).forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var note = form.querySelector(".form-note");
        if (note) { note.textContent = msg; }
        form.reset();
      });
    });
  }
  fakeSubmit(".comment-form", "Danke. Ihr Beitrag wird nach Prüfung durch die Moderation freigeschaltet.");
  fakeSubmit(".newsletter form", "Danke. Bitte bestätigen Sie Ihre Anmeldung per E-Mail.");
})();
