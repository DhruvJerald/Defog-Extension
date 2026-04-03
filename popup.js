const toggles = {
  toggleShorts: "shorts",
  toggleHome: "home",
  toggleTrending: "trending",
  toggleAutoplay: "autoplay",
  toggleComments: "comments",
  toggleSidebar: "sidebar"
};

// Load toggle states
chrome.storage.local.get(Object.values(toggles), (res) => {
  for (const [id, key] of Object.entries(toggles)) {
    const el = document.getElementById(id);
    el.checked = res[key] ?? false;
    el.addEventListener("change", () => {
      chrome.storage.local.set({ [key]: el.checked });
    });
  }
});

// Stats display
function updateStats() {
  chrome.storage.local.get("stats", (res) => {
    const stats = res.stats || { shortsBlocked: 0, homeBlocked: 0, trendingBlocked: 0 };
    document.getElementById("statsDisplay").textContent =
      `Shorts blocked: ${stats.shortsBlocked} | Home blocked: ${stats.homeBlocked} | Trending blocked: ${stats.trendingBlocked}`;
  });
}
updateStats();
setInterval(updateStats, 5000);

// Timer
let timerInterval;
const timerDisplay = document.getElementById("timerDisplay");
const progressCircle = document.getElementById("progressCircle");
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - percent * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

document.getElementById("startTimer").addEventListener("click", () => {
  let minutes = parseInt(document.getElementById("customMinutes").value) || 25;
  let time = minutes * 60;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
    setProgress(time / (minutes * 60));
    if (time <= 0) {
      clearInterval(timerInterval);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon48.png",
        title: "Defog Timer",
        message: "Focus session complete!"
      });
    }
    time--;
  }, 1000);
});

document.getElementById("stopTimer").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerDisplay.textContent = "00:00";
  setProgress(0);
});

// APPLY SAVED THEME ON LOAD
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("theme", (res) => {
    if (res.theme === "light") {
      document.body.classList.add("light-theme");
    }
  });
});

// TOGGLE THEME
document.getElementById("toggleTheme").addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");

  chrome.storage.local.set({
    theme: isLight ? "light" : "dark"
  });
});