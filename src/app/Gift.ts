import {GiftTypes, GiftInstruction} from "../ui/popui.const";

export class Gift {
    constructor (gift: Gift) {
        Object.assign(this, gift)
    }
    instruction: GiftInstruction;
    type?: GiftTypes;
    payload?: any;
    from: Components;
    recipient?: Components;
}



export type Components = 'Popup' | 'Content' | 'Background'
