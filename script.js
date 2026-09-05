(function () {
  "use strict";

  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2600);
  }

  /* -----------------------------------------------------------
     Add to calendar (.ics download)
     Event: Sept 11 2026, 6:00 PM - 8:00 PM, "قلباً جديداً"
     ----------------------------------------------------------- */
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function toICSDate(date) {
    return (
      date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) + "T" +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) + "Z"
    );
  }

  function buildICS() {
    var start = new Date(2026, 8, 11, 18, 0, 0); // Sept 11 2026, 18:00 local
    var end = new Date(2026, 8, 11, 20, 0, 0);

    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Qalban Jadidan Invitation//AR",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@qalban-jadidan-invitation",
      "DTSTAMP:" + toICSDate(new Date()),
      "DTSTART:" + toICSDate(start),
      "DTEND:" + toICSDate(end),
      "SUMMARY:قلباً جديداً",
      "DESCRIPTION:اوهيت إم فيري - قلباً جديداً",
      "LOCATION:قاعة مارمرقس",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    return lines.join("\r\n");
  }

  function downloadICS() {
    var icsContent = buildICS();
    var blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "قلباً-جديداً.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    showToast("تم تنزيل الحدث — أضِفه إلى تقويمك");
  }

  var calendarBtn = document.getElementById("calendarBtn");
  if (calendarBtn) {
    calendarBtn.addEventListener("click", downloadICS);
  }

  /* -----------------------------------------------------------
     Share invitation
     ----------------------------------------------------------- */
  var shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var shareData = {
        title: "قلباً جديداً",
        text: "اوهيت إم فيري — قلباً جديداً | 11.9.2026 الساعة 6:00 مساءً | قاعة مارمرقس",
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(function () {
          /* user cancelled share — no action needed */
        });
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          showToast("تم نسخ الرابط");
        }).catch(function () {
          showToast("تعذّر نسخ الرابط");
        });
      } else {
        showToast("تعذّر نسخ الرابط");
      }
    });
  }

  /* -----------------------------------------------------------
     Reduced motion: skip decorative timing niceties gracefully.
     CSS already handles the heavy lifting via the media query;
     nothing further required in JS.
     ----------------------------------------------------------- */
})();
