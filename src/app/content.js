"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Gift_1 = require("./Gift");
const HathiService_1 = require("./HathiService");
console.log('HEY I FOUND THIS IS A HATHI WEBSITE', document);
const hathi = new HathiService_1.HathiService(document);
console.log('PAGE Number', hathi.getBookTitle());
console.log('Image Path', hathi.getUrl(1));
const testUrl = hathi.getUrl(1);
const basicBookInfo = {
    title: hathi.getBookTitle(),
    pages: hathi.getTotalPageNumber(),
    downloadPath: hathi.getImageDownloadPath()
};
PushToPopup(basicBookInfo);
DownloadOne({
    url: testUrl,
    filename: hathi.getImageDownloadFileName(1),
    saveAs: false
}, hathi.getImageDownloadPath());
chrome.runtime.onMessage.addListener((message) => {
    console.log('I m listener for Content, I just heard', message);
    switch (message.instruction) {
        case "Get":
            switch (message.value) {
                case "body":
                    const doc = document;
                    PushToPopup(doc);
                    break;
            }
            break;
    }
});
function PushToPopup(payload) {
    console.log('I am sending the DOC to Popup');
    const gift = new Gift_1.Gift({
        instruction: "Push",
        payload: payload,
        value: "body",
        from: "Content",
        recipient: "Popup"
    });
    chrome.runtime.sendMessage(gift);
}
function SendTitle() {
    chrome.runtime.sendMessage({
        instruction: "Push",
        from: "Content",
        value: "docTitle"
    }, function (response) {
        console.log(response.farewell);
    });
}
function DownloadOne(entry, path) {
    chrome.runtime.sendMessage({
        instruction: "DownloadOne",
        from: "Content",
        payload: [
            [entry, path]
        ],
        recipient: "Background"
    }, function (response) {
        console.log(response === null || response === void 0 ? void 0 : response.farewell);
    });
}
//# sourceMappingURL=content.js.map