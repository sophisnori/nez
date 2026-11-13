/* Neue Eidgenössische Zeitung – minimales JavaScript (kein Framework, kein Tracking).
   Fiktives Medium für ein Schulprojekt. Es werden keine Daten versendet. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Live-Datum: Alle Zeitangaben werden beim Öffnen aus der aktuellen
     Uhrzeit berechnet. Ohne JavaScript bleibt der statische Text stehen.

     <body data-pub-ago="160">            Artikel erschien vor 160 Minuten
     <body data-pub-day="-1" data-pub-time="09:15">   gestern, 09:15 Uhr
     data-d="-2" data-f="wd"   Datum relativ zum Erscheinungstag (Tage)
     data-d="vote"             Sonntag vor dem Erscheinungstag (kein echter Abstimmungstermin)
     data-base="now"           relativ zu heute statt zum Erscheinungstag
     data-f: wd | d | dy | full | stamp   (Wochentag, 6. November, ... 2026, mit Wochentag, mit Uhrzeit)
     data-ago="41"             «vor 41 Min.», zählt live weiter
     data-clock="160"          Uhrzeit von vor 160 Minuten, z. B. «14:02»
     Der Artikel über Sam Altman ist echt und hat bewusst keine data-pub-*-Angabe.
     ------------------------------------------------------------------ */
  var LOCALE = "de-CH";
  var loaded = new Date();
  var MIN = 60000, DAY = 86400000;

  // Echte eidgenössische Abstimmungssonntage: das erfundene Resultat darf nie auf einen davon fallen.
  var REAL_VOTE_DAYS = ["2026-03-08", "2026-06-14", "2026-09-27", "2026-11-29", "2027-02-28"];

  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function onWeekday(d) {               // Wochenende -> vorangehender Freitag, gleiche Uhrzeit
    var day = d.getDay();
    return day === 6 ? addDays(d, -1) : day === 0 ? addDays(d, -2) : d;
  }
  function voteSunday(pub) {            // letzter Sonntag vor dem Erscheinungstag
    var d = addDays(pub, -1);
    while (d.getDay() !== 0) { d = addDays(d, -1); }
    while (REAL_VOTE_DAYS.indexOf(iso(d)) !== -1) { d = addDays(d, -7); }
    return d;
  }
  function format(d, f) {
    var o = {
      wd: { weekday: "long" },
      d: { day: "numeric", month: "long" },
      dy: { day: "numeric", month: "long", year: "numeric" },
      full: { weekday: "long", day: "numeric", month: "long", year: "numeric" }
    };
    if (f === "stamp") {
      return format(d, "full") + ", " + d.toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit" }) + " Uhr";
    }
    return d.toLocaleDateString(LOCALE, o[f] || o.dy);
  }
  function ago(minutes) {
    if (minutes < 1) { return "gerade eben"; }
    if (minutes < 60) { return "vor " + minutes + " Min."; }
    if (minutes < 1440) { return "vor " + Math.floor(minutes / 60) + " Std."; }
    var days = Math.floor(minutes / 1440);
    return days === 1 ? "vor 1 Tag" : "vor " + days + " Tagen";
  }

  // Erscheinungszeitpunkt des Artikels
  var body = document.body, pub = null;
  if (body.dataset.pubAgo) {
    pub = new Date(loaded.getTime() - Number(body.dataset.pubAgo) * MIN);
  } else if (body.dataset.pubDay) {
    var hm = (body.dataset.pubTime || "09:00").split(":");
    pub = addDays(loaded, Number(body.dataset.pubDay));
    pub.setHours(Number(hm[0]), Number(hm[1]), 0, 0);
  }
  if (pub) {
    pub = onWeekday(pub);
    // Artikel, die auf den Vortag verweisen («am Mittwochabend»), nie auf einen Montag legen,
    // sonst hätte die Behörde ihre Mitteilung an einem Sonntag verschickt.
    if (body.dataset.pubDay && pub.getDay() === 1) { pub = addDays(pub, -3); }
  }

  document.querySelectorAll("[data-d]").forEach(function (el) {
    var base = el.dataset.base === "now" || !pub ? loaded : pub;
    var d = el.dataset.d === "vote" ? voteSunday(base) : addDays(base, Number(el.dataset.d));
    el.textContent = format(d, el.dataset.f);
    if (el.tagName === "TIME") { el.setAttribute("datetime", el.dataset.f === "stamp" ? d.toISOString() : iso(d)); }
  });

  document.querySelectorAll("[data-clock]").forEach(function (el) {
    var t = new Date(loaded.getTime() - Number(el.dataset.clock) * MIN);
    el.textContent = t.toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit" });
  });

  var tickers = document.querySelectorAll("[data-ago]");
  function tick() {
    var elapsed = Math.floor((Date.now() - loaded.getTime()) / MIN);
    tickers.forEach(function (el) { el.textContent = ago(Number(el.dataset.ago) + elapsed); });
  }
  tick();
  if (tickers.length) { setInterval(tick, 30000); }

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
      var title = document.title.replace(/ – Neue Eidgenössische Zeitung$/, "");
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
