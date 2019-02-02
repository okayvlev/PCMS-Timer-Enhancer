function updateIcon() {
    chrome.storage.local.get('isRunning', function(result) {
        chrome.browserAction.setIcon({ path: 'favicon' + (result.isRunning ? "" : "_off") + '.png' });
    });
};

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ isRunning: true }, function() {
        updateIcon();
    });
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get('isRunning', function(result) {
        var val = !result.isRunning;
        chrome.storage.local.set({ isRunning: val }, function() {
            updateIcon();
            chrome.tabs.query({ }, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, { isRunning: val }, function(response) { });
                });
            });
        });
    })
});
