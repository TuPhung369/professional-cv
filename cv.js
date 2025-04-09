// Initialize Mermaid diagrams
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "Arial",
  fontSize: 16,
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
});

// Dark mode toggle functionality
const themeToggle = document.getElementById("themeToggle");

// Check for saved theme preference or use device preference
const savedTheme = localStorage.getItem("theme");
if (
  savedTheme === "dark" ||
  (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.body.classList.add("dark-mode");
}

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Reload Mermaid diagrams to update their theme
  setTimeout(() => {
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
  }, 100);
});

