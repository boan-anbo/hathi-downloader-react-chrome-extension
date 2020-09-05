"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HathiService = void 0;
class HathiService {
    constructor(doc) {
        this.doc = doc;
    }
    //}
    getTotalPageNumber() {
        const pageNumberString = this.doc.querySelectorAll(' [data-slot = total-seq ] ')[0];
        return parseInt(pageNumberString.innerText);
    }
    getBookTitle() {
        const result = this.doc.querySelectorAll('[itemprop=name]');
        return result[0].textContent;
    }
    createBanner() {
        let banner = document.createElement('div');
        banner.innerHTML = `<div><p id='bannerMessageG'></p></div>`;
        document.body.insertBefore(banner, document.body.firstChild);
    }
    getDocumentId() {
        let documentId = this.doc.URL.match(/id=(.{3}).([\d\w]*)/);
        if (documentId) {
            return [documentId[1], documentId[2]];
        }
    }
    SanitizerFileName(bookTitle) {
        const pattern = /[a-zA-Z\d]*\s/g;
        const result = bookTitle.match(pattern);
        console.log('Sanitize', result);
        return result.slice(0, 5).join('').trim().replace(/\s\s*/g, '_').toLowerCase();
    }
    getImageDownloadFileName(pageNumber) {
        let docTitle = this.getBookTitle();
        // docTitle = docTitle.split(' ')
        docTitle = this.SanitizerFileName(docTitle);
        // return path + this.getDocumentId()[1] + ' - ' + docTitle + ' - ' + pageNumber + '.png'
        return pageNumber.toString();
    }
    getImageDownloadPath() {
        let docTitle = this.getBookTitle();
        // docTitle = docTitle.split(' ')
        docTitle = this.SanitizerFileName(docTitle);
        return docTitle;
    }
    getUrl(sequence) {
        let documentId = this.getDocumentId();
        if (documentId) {
            return `https://babel.hathitrust.org/cgi/imgsrv/image?id=${documentId[0]}.${documentId[1]};seq=${sequence};size=100;rotation=0`;
        }
    }
}
exports.HathiService = HathiService;
//# sourceMappingURL=HathiService.js.map