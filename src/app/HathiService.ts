export class HathiService {
    constructor(doc) {
        this.doc = doc
    }
    totalPageNumber: any;
    doc: Document;
    //}

    getTotalPageNumber(): number {
        const pageNumberString = this.doc.querySelectorAll(' [data-slot = total-seq ] ')[0] as HTMLElement
        return parseInt(pageNumberString.innerText);

    }

    getBookTitle(): string{
        const result = this.doc.querySelectorAll('[itemprop=name]');

        return result[0].textContent
    }
    createBanner() {
        let banner = document.createElement ('div');
        banner.innerHTML = `<div><p id='bannerMessageG'></p></div>`
        document.body.insertBefore(banner, document.body.firstChild);
    }

    getDocumentId() {
        let documentId = this.doc.URL.match(/id=(.{3}).([\d\w]*)/)
        if (documentId) {
            return [documentId[1], documentId[2]]
        }
    }

    private SanitizerFileName(bookTitle: string): string {

        const pattern = /[a-zA-Z\d]*\s/g

        const result = bookTitle.match(pattern)

        console.log('Sanitize', result)

        return result.slice(0, 5).join('').trim().replace(/\s\s*/g, '_').toLowerCase()

    }

    getImageDownloadFileName(pageNumber: number){
        let docTitle = this.getBookTitle()
        // docTitle = docTitle.split(' ')
        docTitle = this.SanitizerFileName(docTitle)

        // return path + this.getDocumentId()[1] + ' - ' + docTitle + ' - ' + pageNumber + '.png'
        return pageNumber.toString()
    }

    getImageDownloadPath(): string {
        let docTitle = this.getBookTitle()
        // docTitle = docTitle.split(' ')
        docTitle = this.SanitizerFileName(docTitle)
        return docTitle;
    }
    getAllUrls(): string[] {
        const allUrls = []
        for (let i=1; i <= this.getTotalPageNumber(); i++) {
            allUrls.push(this.getUrl(i))
        }
        return allUrls
    }
    getUrl(sequence) {
        let documentId = this.getDocumentId()
        if (documentId) {
            return `https://babel.hathitrust.org/cgi/imgsrv/image?id=${documentId[0]}.${documentId[1]};seq=${sequence};size=100;rotation=0`
        }
    }

    // Your code here...
    //alert(getUrl(1))



    // startDownload(startPage, endPage, interval) {
    //     let loopNumber = endPage - startPage + 1
    //
    //     function task(i, currentPage) {
    //         setTimeout(function() {
    //             let currentPage = startPage + i
    //             downloadOnePage(currentPage)
    //             let timeRemain = parseInt((endPage - currentPage + 1) * (interval / 1000) / 60)
    //             let progress = `[Download progress: ${startPage + i} / ${this.totalPageNumber}]<br>[Download Time Remaining: ${timeRemain} Minutes]`
    //             showOnBanner(progress)
    //         }, interval * i);
    //     }
    //
    //     for (let i=0; i<loopNumber; i++) {
    //         task(i);
    //     }
    //
    //
    // }
}
