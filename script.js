(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("site-nav");

  function setMenuOpen(isOpen) {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    nav.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      setMenuOpen(!open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) {
        setMenuOpen(false);
      }
    });
  }

  /* ---------- Accordion (smooth open/close) ---------- */
  function openPanel(panel) {
    if (!panel) return;

    panel.hidden = false;
    panel.classList.add("is-open");

    if (reduceMotion) {
      panel.style.height = "auto";
      return;
    }

    panel.style.height = "0px";
    panel.offsetHeight;
    panel.style.height = panel.scrollHeight + "px";

    var onEnd = function (event) {
      if (event.propertyName !== "height") return;
      panel.style.height = "auto";
      panel.removeEventListener("transitionend", onEnd);
    };
    panel.addEventListener("transitionend", onEnd);
  }

  function closePanel(panel) {
    if (!panel || panel.hidden) return;

    if (reduceMotion) {
      panel.classList.remove("is-open");
      panel.hidden = true;
      panel.style.height = "";
      return;
    }

    panel.style.height = panel.scrollHeight + "px";
    panel.offsetHeight;
    panel.style.height = "0px";
    panel.classList.remove("is-open");

    var onEnd = function (event) {
      if (event.propertyName !== "height") return;
      panel.hidden = true;
      panel.style.height = "";
      panel.removeEventListener("transitionend", onEnd);
    };
    panel.addEventListener("transitionend", onEnd);
  }

  document.querySelectorAll("[data-accordion]").forEach(function (accordion) {
    accordion.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        var item = trigger.closest(".accordion__item");
        var panel = item ? item.querySelector(".accordion__panel") : null;

        accordion.querySelectorAll(".accordion__trigger").forEach(function (other) {
          if (other === trigger) return;
          other.setAttribute("aria-expanded", "false");
          var otherItem = other.closest(".accordion__item");
          var otherPanel = otherItem ? otherItem.querySelector(".accordion__panel") : null;
          closePanel(otherPanel);
        });

        if (expanded) {
          trigger.setAttribute("aria-expanded", "false");
          closePanel(panel);
        } else {
          trigger.setAttribute("aria-expanded", "true");
          openPanel(panel);
        }
      });
    });
  });

  /* ---------- Placeholder links (contacts / projects) ---------- */
  document.querySelectorAll('a[data-placeholder="true"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      var label = (link.textContent || "").trim().replace(/\s+/g, " ");
      var message =
        "Ссылка пока не добавлена. Откройте index.html и найдите комментарий TODO рядом с «" +
        (label || "этим контактом") +
        "».";

      if (link.classList.contains("project-link")) {
        message =
          "Ссылка на проект пока не добавлена. Найдите в index.html комментарий TODO рядом с кнопкой «Посмотреть проект».";
      }

      window.alert(message);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------- Active nav by section ---------- */
  var sectionIds = ["services", "projects", "about", "pricing", "faq", "contacts"];
  var navLinks = document.querySelectorAll('.nav__list a[href^="#"]');

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      link.classList.toggle("is-active", href === "#" + id);
    });
  }

  if (navLinks.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0
      }
    );

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }
})();
