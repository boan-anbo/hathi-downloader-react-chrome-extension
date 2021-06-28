import {DownloadOption, Gift} from "./Gift";
import {HathiService} from "./HathiService";

import {BasicBookInfo} from "./entities";
import {DownloadEntry, DownloadSeed, GiftInstruction, GiftTypes, ProgressReport} from "../ui/popui.const";



console.log('HEY I FOUND THIS IS A HATHI WEBSITE', document)
const hathiService = new HathiService(document)

console.log('PAGE Number', hathiService.getBookTitle())



// const firspageUrl = hathiService.getUrl(1)



const basicBookInfo: BasicBookInfo = {
    title: hathiService.getBookTitle(),
    pages: hathiService.getTotalPageNumber(),
    downloadPath: hathiService.getImageDownloadPath()
}

SendToBackground(basicBookInfo, 'BasicBookInfo');

const downloadSeed: DownloadSeed = {
   path: hathiService.getImageDownloadPath(),
   documentId: hathiService.getDocumentId(),


}


SendToBackground({
    downloadSeed,
    basicBookInfo
}, 'DownloadSeed')


// const downloadEntry = {
//     url: firspageUrl,
//     filename: hathiService.getImageDownloadFileName(1),
//     saveAs: false
// }



chrome.runtime.onMessage.addListener((message: Gift, sender, sendResponse) => {
    console.log('I m listener for Content, I just heard', message)
    switch (message.instruction) {
        case "Get":
            switch (message.type) {
                case "body":
                    const doc = document
                    PushToPopup(doc, 'DOM')
                    break
                case "BasicBookInfo":
                    PushToPopup(basicBookInfo, "BasicBookInfo")
                    break
            }
            break
        case "DownloadAll":
            if (message.recipient === 'Background') {
                console.log(`Im Content, I am forwarding Popup's download all instruction to the Background`)
                SendInstructionToBackground('DownloadAll', message.downloadOptions  )
                break;
            }
        case "ReportProgress":
            if (message.recipient === 'Background') {
                console.log(`Im Content, I am forwarding Popup's ${message.instruction} instruction to the Background`)
                chrome.runtime.sendMessage(<Gift>{
                    instruction: message.instruction,
                    from: "Content",
                    recipient: "Background"
                }, (progressReport) => {
                    console.log(`I HEARD RESPONSE FROM BACKGROUND, about ${message.instruction}`, progressReport)
                    sendResponse(progressReport as ProgressReport)
                })
                break
            }
        case "StopDownload":
            if (message.recipient === 'Background') {
                console.log(`Im Content, I am forwarding Popup's ${message.instruction} instruction to the Background`)
                chrome.runtime.sendMessage(<Gift>{
                    instruction: message.instruction,
                    from: "Content",
                    recipient: "Background"
                })
            }
    }
    return true;
})

function SendInstructionToBackground(instruction: GiftInstruction, downloadOption?: DownloadOption, sendResponseToPopup?: (response: any) => void ) {
    const gift = new Gift({
        instruction: instruction,
        from: "Content",
        recipient: "Background"
        ,
        downloadOptions: downloadOption ?? undefined
    })
    chrome.runtime.sendMessage(gift, (reply) => {
        console.log(`I HEARD RESPONSE FROM BACKGROUND, about ${instruction}`, reply)
        sendResponseToPopup('FUCK OFF POPUP')
    })

}
function PushToPopup (payload, payloadType: GiftTypes) {

    const gift = new Gift({
        instruction: "Push",
        payload: payload,
        type: payloadType,
        from: "Content",
        recipient: "Popup"
    });
    chrome.runtime.sendMessage(gift)
    console.log('I am Tab Content, Im sending to Popup', gift)
}

function SendTitle()
{
    chrome.runtime.sendMessage(<Gift>{
        instruction: "Push",
        from: "Content",
        type: "docTitle"
    }, function (response) {
        console.log(response.farewell);
    });
}

function DownloadOne(entry: DownloadEntry, path) {
    chrome.runtime.sendMessage(<Gift>{
        instruction: "DownloadSeed",
        from: "Content",
        payload: [
            [entry, path]
            ],
        recipient: "Background"
    }, function (response) {
        console.log(response?.farewell);
    });
}

function SendToBackground(payload, type: GiftTypes){
    console.log('Content is Sending', payload, type)
    const gift = new Gift({
        instruction: "Push",
        payload: payload,
        type: type,
        from: "Content",
        recipient: "Background"
    });
    chrome.runtime.sendMessage(gift)
}
