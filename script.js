
/* =========================================================
   OISHI PORTFOLIO — INTERACTIVE JAVASCRIPT
   Faria Ahmed Oishi
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ================= HERO SLIDER ================= */

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const prevButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");
  const currentSlideLabel = document.getElementById("currentSlide");
  const dots = Array.from(document.querySelectorAll(".slider-dot"));
  const heroHighlight = document.getElementById("heroHighlight");
  const hero = document.querySelector(".hero");

  const headlineWords = ["matter.", "connect.", "inspire."];

  let currentIndex = 0;
  let sliderTimer = null;
  let touchStartX = 0;

  function animateHeadline(index) {
    if (!heroHighlight) return;

    heroHighlight.classList.remove("headline-change");

    // Restart the CSS animation.
    void heroHighlight.offsetWidth;

    heroHighlight.textContent = headlineWords[index] || "matter.";
    heroHighlight.classList.add("headline-change");
  }

  function showSlide(index) {
    if (!slides.length) return;

    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;

      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;

      dot.classList.toggle("active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (currentSlideLabel) {
      currentSlideLabel.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    animateHeadline(currentIndex);
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function previousSlide() {
    showSlide(currentIndex - 1);
  }

  function stopSlider() {
    if (sliderTimer !== null) {
      window.clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  function startSlider() {
    stopSlider();

    if (slides.length < 2) return;

    // Respect the visitor's reduced-motion preference.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    sliderTimer = window.setInterval(nextSlide, 6000);
  }

  if (slides.length) {
    showSlide(0);
    startSlider();
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextSlide();
      startSlider();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      previousSlide();
      startSlider();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startSlider();
    });
  });

  // Pause autoplay while visitors interact with the hero.
  if (hero) {
    hero.addEventListener("mouseenter", stopSlider);
    hero.addEventListener("mouseleave", startSlider);
    hero.addEventListener("focusin", stopSlider);
    hero.addEventListener("focusout", (event) => {
      if (!hero.contains(event.relatedTarget)) {
        startSlider();
      }
    });

    // Mobile swipe support.
    hero.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    hero.addEventListener("touchend", (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const difference = touchEndX - touchStartX;

      if (Math.abs(difference) > 55) {
        if (difference < 0) {
          nextSlide();
        } else {
          previousSlide();
        }

        startSlider();
      }
    }, { passive: true });
  }


  /* ================= MOBILE NAVIGATION ================= */

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("open", !isOpen);
    });

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu after clicking outside it.
    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Restore desktop navigation when resizing upward.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  /* ================= ACTIVE NAVIGATION ================= */

  const pageSections = document.querySelectorAll(
    "#home, #about, #academic-work, #experiences, #contact"
  );

  if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;

          navItems.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    pageSections.forEach((section) => sectionObserver.observe(section));
  }


  /* ================= EXPERIENCE FILTERS ================= */

  const filterButtons = Array.from(
    document.querySelectorAll(".filter-button")
  );

  const experienceGroups = Array.from(
    document.querySelectorAll(".experience-group")
  );

  function filterExperiences(category) {
    experienceGroups.forEach((group) => {
      const matches =
        category === "all" ||
        group.dataset.category === category;

      group.hidden = !matches;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterExperiences(button.dataset.filter || "all");
    });
  });

  if (filterButtons.length) {
    filterExperiences("all");
  }


  /* ================= CURRENT YEAR ================= */

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }


  /* ================= BACK TO TOP ================= */

  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  }


  /* ================= IMAGE FALLBACK ================= */

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    }, { once: true });
  });

});

.hero-highlight.headline-change {
  animation: headline-swap 0.65s cubic-bezier(.2, .75, .25, 1) both;
}

@keyframes headline-swap {
  from {
    opacity: 0;
    filter: blur(7px);
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}
