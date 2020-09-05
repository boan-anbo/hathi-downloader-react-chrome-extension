"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
require("../styles/popup.css");
const popui_const_1 = require("./popui.const");
const doc_info_1 = __importDefault(require("./doc-info"));
const sendToBackground_1 = __importDefault(require("./sendToBackground"));
class Hello extends React.Component {
    constructor() {
        super(...arguments);
        this.SendMessageToCurrentContentTab = (gift) => {
            console.log('I am in Popup, I am sending', popui_const_1.standardGift, 'to content');
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, gift, function (response) {
                    console.log(response);
                });
            });
        };
    }
    componentDidMount() {
        chrome.runtime.onMessage.addListener((gift) => {
            console.log("Im the listener for popup, I just hear", gift);
            switch (gift.instruction) {
                case "Push":
                    switch (gift.value) {
                        case "body":
                            console.log('I am Popup FINALLY RECEIVED THE,', gift.payload);
                            break;
                    }
                    break;
            }
        });
    }
    GetContent() {
    }
    ShowMeTheTitle() {
    }
    render() {
        return (React.createElement("div", { className: "popup-padded" },
            React.createElement(doc_info_1.default, null),
            React.createElement(sendToBackground_1.default, null),
            React.createElement("button", { onClick: () => this.ShowMeTheTitle() }, "Send Message To Content")));
    }
}
// --------------
ReactDOM.render(React.createElement(Hello, null), document.getElementById('root'));
//# sourceMappingURL=popup.js.map