
document.addEventListener("DOMContentLoaded", () => {
  // HERO PHOTO SLIDER
  const heroImage = document.getElementById("heroImage");
  const dotsContainer = document.getElementById("sliderDots");
  const prevButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");
  const slideCount = document.getElementById("slideCount");

  const photos = [
    "assets/images/hero/oishi-action-reporting.jpg",
    "assets/images/hero/oishi-action-event.jpg",
    "assets/images/hero/oishi-action-production.jpg",
    "assets/images/hero/oishi-background-photo-01.jpg",
    "assets/images/hero/oishi-background-photo-02.jpg"
  ];

  let currentSlide = 0;
  let sliderTimer;

  function showSlide(index) {
    currentSlide = (index + photos.length) % photos.length;

    if (heroImage) {
      heroImage.style.backgroundImage =
        `linear-gradient(90deg, rgba(5,13,26,.45), rgba(5,13,26,.05)), url("${photos[currentSlide]}")`;
    }

    if (dotsContainer) {
      dotsContainer.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
        dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
      });
    }

    if (slideCount) {
      slideCount.textContent =
        `${String(currentSlide + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;
    }
  }

  function startSlider() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
  }

  if (heroImage && dotsContainer) {
    photos.forEach((photo, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show photo ${index + 1}`);
      dot.addEventListener("click", () => {
        showSlide(index);
        startSlider();
      });
      dotsContainer.appendChild(dot);
    });

    prevButton?.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      startSlider();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      startSlider();
    });

    // Preload the next images to make transitions smoother.
    photos.forEach((photo) => {
      const image = new Image();
      image.src = photo;
    });

    showSlide(0);
    startSlider();
  }

  // MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open") ?? false;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ACTIVITIES FILTER
  const filterButtons = document.querySelectorAll(".filter-btn");
  const activityCards = document.querySelectorAll(".activity-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      activityCards.forEach((card) => {
        const matches =
          filter === "all" || card.dataset.category === filter;
        card.hidden = !matches;
      });
    });
  });

  // CURRENT YEAR
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ACTIVE NAVIGATION LINK
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navItems.forEach((link) => {
            const active = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", active);
          });
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach((section) => observer.observe(section));
  }
});

