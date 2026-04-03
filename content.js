let observer = null;
let lastRun = 0;

let settings = {
  shorts: true,
  home: false,
  trending: false,
  autoplay: false,
  comments: false,
  sidebar: false,
  stats: { shortsBlocked: 0, homeBlocked: 0, trendingBlocked: 0 }
};

// ✅ Throttle to prevent lag
function shouldRun() {
  const now = Date.now();
  if (now - lastRun < 500) return false; // run max every 500ms
  lastRun = now;
  return true;
}

// ✅ Safe stat update (no spam)
function updateStat(key) {
  settings.stats[key]++;
  chrome.storage.local.set({ stats: settings.stats });
}

// ---------------- SHORTS ----------------
function redirectShorts() {
  if (window.location.pathname.startsWith("/shorts/")) {
    updateStat("shortsBlocked");
    window.location.replace("https://www.youtube.com/");
    return true;
  }
  return false;
}

function removeShortsUI() {
  document.querySelectorAll('a[href*="/shorts/"]').forEach(el => el.remove());
}

// ---------------- HOME ----------------
function removeHomeUI() {
  if (window.location.pathname !== "/") return;

  // Hide main feed (keeps retrying)
  const primary = document.querySelector("#primary");
  if (primary) {
    primary.style.setProperty("display", "none", "important");
  }

  // Ensure sidebar stays visible
  const guide = document.querySelector("ytd-guide-renderer");
  if (guide) {
    guide.style.setProperty("display", "block", "important");
  }

  // Add overlay message ONCE
  if (!document.getElementById("defog-overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "defog-overlay";
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 55%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        font-weight: bold;
        opacity: 0.6;
        z-index: 9999;
      ">
        🚫 Stay Focused
      </div>
    `;
    document.body.appendChild(overlay);

    updateStat("homeBlocked");
  }
}
// ---------------- TRENDING ----------------
function removeTrendingUI() {
  if (window.location.pathname.includes("/feed/trending")) {
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:40px;'>Trending Blocked</h2>";
    updateStat("trendingBlocked");
  }
}

// ---------------- OTHERS ----------------
function removeAutoplayUI() {
  const toggle = document.querySelector("#toggle");
  if (toggle) toggle.remove();
}

function removeCommentsUI() {
  const comments = document.querySelector("ytd-comments");
  if (comments) comments.remove();
}

function removeSidebarUI() {
  const sidebar = document.querySelector("#secondary");
  if (sidebar) sidebar.remove();
}

// ---------------- MAIN ----------------
function run() {
  if (!shouldRun()) return;

  if (settings.shorts) {
    if (redirectShorts()) return;
    removeShortsUI();
  }

  if (settings.home) removeHomeUI();
  if (settings.trending) removeTrendingUI();
  if (settings.autoplay) removeAutoplayUI();
  if (settings.comments) removeCommentsUI();
  if (settings.sidebar) removeSidebarUI();
}

// ---------------- INIT ----------------
function init() {
  if (observer) return;

  run();

  observer = new MutationObserver(run);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener("yt-navigate-finish", run);
}

// Load settings
chrome.storage.local.get(Object.keys(settings), (res) => {
  settings = { ...settings, ...res };
  init();
});

// Listen for toggle updates
chrome.storage.onChanged.addListener((changes) => {
  for (const key in changes) {
    settings[key] = changes[key].newValue;
  }
  run();
});