"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const popui_const_1 = require("./popui.const");
function SendToBackground(props) {
    const SendMessageToBackground = () => {
        console.log('Sending Message From Popup to the Background');
        chrome.runtime.sendMessage(popui_const_1.standardGift);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { onClick: () => SendMessageToBackground() }, "Send Message To Background")));
}
exports.default = SendToBackground;
//# sourceMappingURL=sendToBackground.js.map