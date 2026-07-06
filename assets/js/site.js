/* 간다GO — site behaviour (progressive enhancement, no dependencies) */
(function () {
  "use strict";

  // Mobile navigation panel
  var toggle = document.querySelector(".nav-toggle");
  var panel = document.getElementById("mobile-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    // Close panel when a link is tapped
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // Current year in footer
  var y = document.querySelector("[data-year]");
  if (y) {
    // Static year injected at build time is the source of truth; JS only
    // updates if the build value is older than the client's current year.
    var built = parseInt(y.getAttribute("data-year"), 10);
    var now = new Date().getFullYear();
    if (now > built) y.textContent = String(now);
  }
})();
