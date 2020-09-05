import {Gift} from "../app/Gift";
import {Button, Intent} from "@blueprintjs/core";
import React, {useState} from "react";
import {ProgressReport} from "./popui.const";
import {DownloaderState} from "../app/HathiDownloader";

export const StartStopButton = (props: {
    progressReport: ProgressReport,
    SendToBackground: (gift: Gift) => void
}) => {

    const [startButtonClicked, SetStartButton] = useState<boolean>(false)

    const startDownload = new Gift({
        instruction: "DownloadAll",
        from: "Popup",
        recipient: "Background"
    })
    const stopDownload = new Gift({
        instruction: "StopDownload",
        from: "Popup",
        recipient: "Background"
    })
    return (
        <div>
        <Button onClick={
            () => {
            props.SendToBackground(startDownload);
            SetStartButton(true);
            }
        } icon='download' intent={Intent.PRIMARY} disabled={  (startButtonClicked === true ) || ( props.progressReport.downloaderState === DownloaderState.DOWNLOADING) }>
            <span>Start</span>
        </Button>
        <Button onClick={ () => props.SendToBackground(stopDownload) } icon='stop' intent={Intent.NONE} >
            <span>Stop</span>
        </Button>
        </div>
    )
}
