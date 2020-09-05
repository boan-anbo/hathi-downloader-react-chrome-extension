"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
        console.log(response.farewell);
    });
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const gift = request;
    switch (gift.instruction) {
        case "DownloadOne":
            DownloadOne(gift.payload[0][0], gift.payload[0][1]);
            break;
    }
    console.log('IM Listener for Background, I JUST Heard', request);
    console.log('The Sender is', sender);
    // console.log(sender.tab ?
    //     "from a content script:" + sender.tab.url :
    //     "from the extension");
    // if (request.greeting == "hello")
    //     sendResponse({farewell: "goodbye"});
});
function DownloadOne(entry, path) {
    // chrome.downloads.onDeterminingFilename.removeListener(function(item, suggest) {
    //     suggest({filename: entry.path + item.filename});
    // });
    chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
        suggest({ filename: path + '\\' + item.filename });
    });
    console.log('Starting to Download Entry', entry, 'to the path', path);
    chrome.downloads.download(entry);
}
//# sourceMappingURL=background.js.map