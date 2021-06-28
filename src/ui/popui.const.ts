import {Gift} from "../app/Gift";
import DownloadItem = chrome.downloads.DownloadItem;
import {DownloaderState} from "../app/HathiDownloader";
import {HathiService} from "../app/HathiService";

export const standardGift: Gift = {
    instruction: "Get",

    from: "Popup"
};




export type GiftTypes = 'docTitle' | 'body' | 'BasicBookInfo' | 'DOM' | 'DownloadSeed'

export type GiftInstruction = 'Get' | 'Push' | 'DownloadSeed' | 'DownloadAll' | 'ReportProgress' | 'StopDownload'


export interface DownloadSeed {
    // allUrls: string[],
    path: string
    documentId: string[]
}


export interface DownloadEntry  {
    url: string;
    filename: string;
    saveAs: boolean
}

export class ProgressReport {
    currentPage: number = null
    currentPageProgress: number = null
    allPageProgress: number = null
    allPages: number = null
    allFinished: boolean = false
    currentInterval: number = null
    downloaderState: DownloaderState = null
}
