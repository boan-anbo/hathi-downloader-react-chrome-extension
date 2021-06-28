import {GiftTypes, GiftInstruction} from "../ui/popui.const";

export class DownloadOption {

    startingPage?: number
    interval?: number
    resolution?: number
}
export class Gift {
    constructor (gift: Gift) {
        Object.assign(this, gift)
    }
    instruction: GiftInstruction;
    type?: GiftTypes;
    payload?: any;
    from: Components;
    recipient?: Components;
    downloadOptions?: DownloadOption
}



export type Components = 'Popup' | 'Content' | 'Background'
