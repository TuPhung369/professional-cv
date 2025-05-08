// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize theme
  initializeTheme();

  // Set up theme toggle
  setupThemeToggle();

  // Render Mermaid diagrams
  renderMermaidDiagrams();

  // Set up other event listeners
  setupEventListeners();

  // Apply dynamic grid layout
  applyDynamicGridLayout();

  // Add hover effect to strength items
  const strengthItems = document.querySelectorAll(".strength-item");
  strengthItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-5px)";
      item.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0)";
      item.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.1)";
    });
  });

  // Animate technical skills when they come into view
  const techSkills = document.querySelectorAll(".tech-skill");

  // Create an intersection observer for tech skills
  const techObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered animation with delay based on index
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);

          // Stop observing once animation is triggered
          techObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Set initial styles and observe each tech skill
  techSkills.forEach((skill, index) => {
    // Initially set opacity to 0 and move down
    skill.style.opacity = "0";
    skill.style.transform = "translateY(20px)";
    skill.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    // Add hover effect for icon color change
    const icon = skill.querySelector(".tech-skill-icon");
    if (icon) {
      // Generate a random color for each skill on hover
      const colors = [
        "#2196F3", // Blue
        "#4CAF50", // Green
        "#FF9800", // Orange
        "#9C27B0", // Purple
        "#E91E63", // Pink
        "#00BCD4", // Cyan
        "#3F51B5", // Indigo
        "#009688", // Teal
      ];

      const randomColor = colors[index % colors.length];

      skill.addEventListener("mouseenter", () => {
        icon.style.backgroundColor = randomColor;
        icon.style.transition = "background-color 0.3s ease";
      });

      skill.addEventListener("mouseleave", () => {
        icon.style.backgroundColor = "var(--header-bg)";
      });
    }

    // After a small delay, start observing
    setTimeout(() => {
      techObserver.observe(skill);
    }, 100);
  });
});

// Initialize theme based on saved preference
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  // Check for saved theme preference or use dark mode as default
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "🌞"; // Sun emoji for light mode
  } else {
    // Dark mode is default (no class needed as it's in :root)
    themeToggle.textContent = "🌙"; // Moon emoji for dark mode
  }
}

// Set up theme toggle button
function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", function () {
    // Toggle theme class
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");

    // Update localStorage and button icon
    if (isLight) {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌞"; // Sun emoji for light mode
    } else {
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "🌙"; // Moon emoji for dark mode
    }

    // Re-render Mermaid diagrams with new theme
    setTimeout(function () {
      try {
        // Simply call our renderMermaidDiagrams function which will use the stored original content
        renderMermaidDiagrams();

        // Reapply grid layout
        applyDynamicGridLayout();
      } catch (error) {
        console.error("Error re-rendering Mermaid diagrams:", error);
      }
    }, 200);
  });
}

// Render all Mermaid diagrams
function renderMermaidDiagrams() {
  try {
    console.log("Rendering Mermaid diagrams...");

    // Get current theme
    const isLight = document.body.classList.contains("light-mode");
    const theme = isLight ? "default" : "dark";

    // Configure Mermaid with the current theme
    mermaid.initialize({
      startOnLoad: false,
      theme: theme,
      securityLevel: "loose",
      logLevel: 1,
    });

    // Get all Mermaid diagrams
    const diagrams = document.querySelectorAll(".mermaid");

    // Reset and restore original content for each diagram
    diagrams.forEach((diagram, index) => {
      // Clear the diagram
      diagram.innerHTML = "";

      // Reset the diagram
      diagram.removeAttribute("data-processed");

      // Restore the original content from our saved array
      if (
        window.originalMermaidContent &&
        window.originalMermaidContent[index]
      ) {
        diagram.textContent = window.originalMermaidContent[index];
      }
    });

    // Initialize Mermaid diagrams
    try {
      mermaid.init(undefined, diagrams);
      console.log("Mermaid diagrams rendered with theme:", theme);
    } catch (initError) {
      console.error("Error initializing Mermaid diagrams:", initError);

      // If initialization fails, try rendering each diagram individually
      diagrams.forEach((diagram, index) => {
        try {
          mermaid.init(undefined, [diagram]);
        } catch (singleError) {
          console.warn(`Error rendering diagram ${index}:`, singleError);
        }
      });
    }
  } catch (error) {
    console.error("Error rendering Mermaid diagrams:", error);
  }
}

// Apply dynamic grid layout to tech-skills sections
function applyDynamicGridLayout() {
  try {
    // Don't apply on mobile devices
    if (window.innerWidth <= 768) return;

    // Target all tech-skills containers
    const techSkillsContainers = document.querySelectorAll(".tech-skills");

    techSkillsContainers.forEach(function (container) {
      const items = container.querySelectorAll(".tech-skill");
      const itemCount = items.length;

      // Apply grid layout based on number of items
      if (itemCount >= 3 && itemCount % 2 === 1) {
        // If 3 or more items and odd number, use 3 columns
        container.style.gridTemplateColumns = "repeat(3, 1fr)";

        // Adjust item width for better fit in 3-column layout
        items.forEach(function (item) {
          item.style.width = "100%";
        });
      } else {
        // Otherwise use 2 columns
        container.style.gridTemplateColumns = "repeat(2, 1fr)";

        // Reset item width for 2-column layout
        items.forEach(function (item) {
          item.style.width = "100%";
        });
      }
    });
  } catch (error) {
    console.error("Error applying grid layout:", error);
  }
}

// Set up other event listeners
function setupEventListeners() {
  // Add click handlers for contact links
  const emailLink = document.querySelector('a[href^="mailto:"]');
  const phoneLink = document.querySelector('a[href^="tel:"]');

  if (emailLink) {
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      const email = this.getAttribute("href").replace("mailto:", "");
      window.location.href = "mailto:" + email;
    });
  }

  if (phoneLink) {
    phoneLink.addEventListener("click", function (e) {
      e.preventDefault();
      const phone = this.getAttribute("href").replace("tel:", "");
      window.location.href = "tel:" + phone;
    });
  }

  // Make sure progress bars are visible
  const skillBars = document.querySelectorAll(".progress");

  // Make sure all progress bars are visible with their correct width
  skillBars.forEach((bar) => {
    // Ensure the progress bar is visible
    bar.style.display = "block";
  });

  // Add window resize handler
  window.addEventListener("resize", function () {
    applyDynamicGridLayout();
  });
}

