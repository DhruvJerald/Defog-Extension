let observer = null;
let enabled = true;
let lastUrl = "";
let debounceTimer = null;

function redirectShorts() {
  if (window.location.href.includes("/shorts/")) {
    window.location.replace("https://www.youtube.com/");
    return true;
  }
  return false;
}

function removeShortsUI() {
  document.querySelectorAll('a[href*="/shorts/"]').forEach(el => el.remove());

  document.querySelectorAll("ytd-rich-section-renderer").forEach(section => {
    const title = section.querySelector("#title");
    if (title && title.textContent.toLowerCase().includes("shorts")) {
      section.remove();
    }
  });

  document.querySelectorAll("ytd-mini-guide-entry-renderer").forEach(item => {
    if (item.textContent.toLowerCase().includes("shorts")) {
      item.remove();
    }
  });
}

function hideHomeFeed() {
  const feed = document.querySelector("ytd-rich-grid-renderer");
  if (feed) {
    feed.style.display = "none";
  }
}
function run() {
  if (!enabled) return;

  const currentUrl = window.location.href;

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    if (redirectShorts()) return;
  }

  removeShortsUI();
  hideHomeFeed();
}

function debouncedRun() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    run();
  }, 200);
}

function init() {
  if (observer) return;

  run();

  observer = new MutationObserver(() => {
    debouncedRun();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener("yt-navigate-finish", run);

  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest("a");
      if (!link || !link.href) return;

      if (link.href.includes("/shorts/")) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
}

chrome.storage.local.get(["enabled"], (res) => {
  enabled = res.enabled ?? true;
  if (enabled) init();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;

    if (enabled) {
      init();
      run();
    } else {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }
});