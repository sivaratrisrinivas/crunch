// background.js
chrome.action.onClicked.addListener((tab) => {
    // Send a message to the active tab when the icon is clicked
    chrome.tabs.sendMessage(tab.id, { action: "TOGGLE_CRUNCH" })
        .catch(() => {
            // Ignore errors if the user clicks on a non-webpage tab (like settings)
        });
});