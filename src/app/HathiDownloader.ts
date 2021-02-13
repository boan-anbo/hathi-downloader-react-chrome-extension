
import DownloadItem = chrome.downloads.DownloadItem;
import {DownloadEntry, DownloadSeed, ProgressReport} from "../ui/popui.const";
import {BasicBookInfo} from "./entities";

import {interval, Subscription} from 'rxjs'

export class HathiDownloader {
    private downloaderState: DownloaderState
    private intervalNumber = 800
    private defaultInterval = 8;
    private interval = interval(this.intervalNumber)
    private downloadSeed: DownloadSeed
    private basicBookInfo: BasicBookInfo
    private downloadIds: number [] = [];
    private currentPageNumber: number = 1;
    private _currentDownload: DownloadItem;
    private progressSubscription: Subscription;
    private allFinished: boolean = false;
    private stopNow: boolean = false;
    private downloadInterval: number;

    constructor(downloadSeed: DownloadSeed, basicBookInfo: BasicBookInfo) {
        this.downloadSeed = downloadSeed
        this.basicBookInfo = basicBookInfo
        this.SetDownloadFolder = this.SetDownloadFolder.bind(this)
        chrome.downloads.onDeterminingFilename.removeListener(this.SetDownloadFolder)
        if (!chrome.downloads.onDeterminingFilename.hasListeners()) {
        chrome.downloads.onDeterminingFilename.addListener(this.SetDownloadFolder);
        }
        this.ResetDownloadInterval(this.defaultInterval)
        this.SetDownloaderState(DownloaderState.READY)
    }

    ResetAll() {
        this.ResetCurrentItem()
        this.ResetDownloadInterval(this.defaultInterval)
        this.ResetCurrentPageNumber()
        this.ResetDownloadIds()
        this.allFinished= false
        this.stopNow = false
    }
    ResetCurrentPageNumber() {
        this.currentPageNumber = 1
    }
    ResetDownloadIds() {
        this.downloadIds = []
    }
    SetDownloaderState(state: DownloaderState) {
        this.downloaderState = state
    }

    private StartDownloadProgress(downloadId) {
        this.progressSubscription = this.interval.subscribe((second) => {
            this.UpdateCurrentItem(downloadId);

            console.log('Reporting progress every second', this.getCurrentProgress())
            if (this.getCurrentProgress() === 1) {
                this.downloadInterval--
                if (this.downloadInterval <= 0) {
                    console.log('CurrentDownload Finished')
                    this.StopSingleDownloadProgress()
                    this.ResetCurrentItemAndDownloadInterval()
                    this.DownloadNext();
                }
            }

        })
    }

    StopDownload() {
        this.stopNow = true;
        this.downloadInterval = 0

    }
    private ResetCurrentItem() {
        this.currentDownload = null

    }
    private ResetCurrentItemAndDownloadInterval() {
        this.ResetCurrentItem();
        this.ResetDownloadInterval(8);

    }
    private StopSingleDownloadProgress() {
        this.progressSubscription?.unsubscribe()
    }

    getAllUrls(): string[] {
        return this.downloadSeed.allUrls
    }
    private getPath(): string {
        return this.downloadSeed.path
    }
    private get currentDownload(): chrome.downloads.DownloadItem {
        if (this._currentDownload) {
            return this._currentDownload;
        }
    }

    private set currentDownload(item: chrome.downloads.DownloadItem) {
        console.log('Download ITEM RETRIEVED!!!!', item)
        this._currentDownload = item;
    }

    private getCurrentProgress() {
        return this.currentDownload?.bytesReceived / this.currentDownload?.totalBytes;
    }

    private UpdateCurrentItem(id: number) {
        chrome.downloads.search({
            id
        }, (item) => {
            this.currentDownload = item[0]
        })
    }

    private DownloadOne(entry: DownloadEntry, pageNumber: number) {
        console.log('Starting to Download Entry', entry, 'to the path', this.getPath())
        chrome.downloads.download(entry, (downloadId) => {
            this.downloadIds[pageNumber - 1] = downloadId;
            console.log('Download Started', entry.filename, 'Download Id:', downloadId)
            this.UpdateCurrentItem(downloadId);
            this.StartDownloadProgress(downloadId)
        })
    }
    private SetDownloadFolder(item, suggest){
        suggest({filename: this.downloadSeed.path + '\\' + item.filename})
    }

    private getCurrentItem = (): DownloadEntry => {
        return {
            url: this.getAllUrls()[this.currentPageNumber - 1],
            filename: this.basicBookInfo.downloadPath + ' - ' + this.currentPageNumber,
            saveAs: false
        }
    }
    GenerateReport(): ProgressReport {
        return {
            currentPage: this.getCurrentPageNumber(),
            currentPageProgress: this.getCurrentProgress(),
            allPages: this.basicBookInfo.pages,
            allPageProgress: (this.getCurrentPageNumber() - 1) / this.basicBookInfo.pages,
            allFinished: this.allFinished,
            currentInterval: this.downloadInterval,
            downloaderState: this.downloaderState
        }
    }
    private DownloadNext() {
        if (this.stopNow !== true) {
            if (this.currentPageNumber < this.getTotalPageNumber()) {
                this.currentPageNumber++
                this.DownloadOne(this.getCurrentItem(), this.getCurrentPageNumber())
                console.log('Starting Download Page', this.currentPageNumber)
            }
            else {
                this.AnnounceAllFinished()
            }
        } else {
            this.StopAllProgress()
        }
    }

    private ResetDownloadInterval(interValBetweenDownloads: number) {
        this.downloadInterval = (1000 / this.intervalNumber) * interValBetweenDownloads
    }

    private AnnounceAllFinished() {
        console.warn('All pages downloaded')
        this.allFinished = true;
        this.SetDownloaderState(DownloaderState.ALLFINISHED)
    }
    private StopAllProgress() {
        this.StopSingleDownloadProgress()
        this.SetDownloaderState(DownloaderState.STOPPED);

    }

    StartDownload() {
        this.ResetAll()
        console.log('DOWNLOADER STARTED DOWNLOAD')
        this.currentPageNumber = 1
        this.SetDownloaderState(DownloaderState.DOWNLOADING)
        this.DownloadOne(this.getCurrentItem(), this.getCurrentPageNumber())

    }

    getCurrentPageNumber(): number {
        return this.currentPageNumber
    }

    private getTotalPageNumber() {

        return this.basicBookInfo.pages
    }
}


export enum DownloaderState {
    'READY'= 'READY',
    'DOWNLOADING' = 'DOWNLOADING',
    'STOPPED' = 'STOPPED',
    'ALLFINISHED' = 'ALLFINISHED'
}
