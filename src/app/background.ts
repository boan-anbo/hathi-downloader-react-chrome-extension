import {Gift} from "./Gift";
import DownloadItem = chrome.downloads.DownloadItem;

import {HathiDownloader} from "./HathiDownloader";


let hathiDownloader: HathiDownloader;



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        const gift = request as Gift;
        switch (gift.type) {
            case "BasicBookInfo":
                console.log('Background Received Basic Book Infor', gift.payload)
                break;
            case "DownloadSeed":
                console.warn('BACKGROUND Received Download Seed', gift.payload)
                hathiDownloader = new HathiDownloader(gift.payload.downloadSeed, gift.payload.basicBookInfo)
                break
            case "DOM":
                console.warn('BACKGROUND RECEIVED DOM', gift.payload as Document)
                break
        }
        switch(gift.instruction) {
            case "DownloadAll":
                console.warn('BACKGROUND RECEIVED INSTRUCTION TO DOWNLOAD ALLLLL', hathiDownloader)
                if (hathiDownloader) {
                    hathiDownloader.StartDownload()
                }
                break;
            case "ReportProgress":
                sendResponse(hathiDownloader.GenerateReport())
                break
            case "StopDownload":
                if (hathiDownloader) {
                    hathiDownloader.StopDownload()
                }
                break;
        }
        console.log('IM Listener for Background, I JUST Heard', request)
        console.log('The Sender is', sender)
        // console.log(sender.tab ?
        //     "from a content script:" + sender.tab.url :
        //     "from the extension");
        // if (request.greeting == "hello")
        //     sendResponse({farewell: "goodbye"});
    });



