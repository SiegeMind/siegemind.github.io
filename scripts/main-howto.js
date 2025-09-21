// Add scroll animations
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
        }
      });
    },
    { threshold: 0.1 }
  );

  steps.forEach((step) => {
    observer.observe(step);
  });

  // Smooth scrolling for back button
  document.querySelector(".back-btn").addEventListener("click", function (e) {
    if (this.getAttribute("href") === "index.html") {
      return; // Let the default navigation happen
    }

    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
