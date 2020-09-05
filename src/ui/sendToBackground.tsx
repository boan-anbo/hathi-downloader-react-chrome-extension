import React from 'react';
import {standardGift} from "./popui.const";

function SendToBackground(props) {
    const SendMessageToBackground = () => {
        console.log('Sending Message From Popup to the Background')
        chrome.runtime.sendMessage(standardGift)
    }

    return (
        <div>
            <button onClick={() => SendMessageToBackground()}>
                Send Message To Background
            </button>
        </div>
    );
}

export default SendToBackground;
