// Get elements
let button = document.getElementById("toggle");
let statusText = document.getElementById("status");

// Load saved state
chrome.storage.local.get(["enabled"], function(result) {
    let enabled = result.enabled;

    // Default to ON if not set
    if (enabled === undefined) {
        enabled = true;
        chrome.storage.local.set({ enabled: true });
    }

    updateUI(enabled);
});

// Button click
button.addEventListener("click", function() {
    chrome.storage.local.get(["enabled"], function(result) {
        let enabled = result.enabled;

        let newState = !enabled;

        chrome.storage.local.set({ enabled: newState });

        updateUI(newState);
    });
});

// Update UI
function updateUI(enabled) {
    if (enabled) {
        statusText.innerText = "Status: ENABLED";
        button.innerText = "Disable";
    } else {
        statusText.innerText = "Status: DISABLED";
        button.innerText = "Enable";
    }
}