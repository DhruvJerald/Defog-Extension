const toggle = document.getElementById("toggle");
const statusText = document.getElementById("status");

chrome.storage.local.get(["enabled"], (res) => {
  const isEnabled = res.enabled ?? true;
  toggle.checked = isEnabled;
  statusText.textContent = isEnabled ? "Enabled" : "Disabled";
});

toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  chrome.storage.local.set({ enabled: isEnabled });
  statusText.textContent = isEnabled ? "Enabled" : "Disabled";
});