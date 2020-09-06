import {Gift} from "../app/Gift";
import {Button, Intent} from "@blueprintjs/core";
import React, {useEffect, useState} from "react";
import {ProgressReport} from "./popui.const";
import {DownloaderState} from "../app/HathiDownloader";

export const StartStopButton = (props: {
    progressReport: ProgressReport,
    SendToBackground: (gift: Gift) => void
}) => {

    const [startButtonClicked, SetStartButtonClicked] = useState<boolean>(false)
    const [stateProgressReport, SetStateProgressReport] = useState<ProgressReport>(new ProgressReport())


    useEffect( () => {
        SetStateProgressReport(props.progressReport)
        if (props.progressReport?.downloaderState === DownloaderState.STOPPED) {
            SetStartButtonClicked(false)
        }
    }, [props.progressReport] )

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
            {JSON.stringify(stateProgressReport)}
        <Button onClick={
            () => {
            props.SendToBackground(startDownload);
            SetStartButtonClicked(true);
            }
        } icon='download' intent={Intent.PRIMARY} disabled={
            (startButtonClicked === true ) ||
            ( stateProgressReport?.downloaderState === DownloaderState.DOWNLOADING ) || ( stateProgressReport?.downloaderState === null )
        }>

            <span>Start</span>
        </Button>
        <Button onClick={ () =>
        {
            props.SendToBackground(stopDownload)
            // because hooks don't merge states, it hass to be reassigned.
            SetStateProgressReport((previousState) => {
               return Object.assign(previousState, {
                downloaderState: DownloaderState.STOPPED
            })
            })
        } }
                disabled={ props.progressReport?.downloaderState !== DownloaderState.DOWNLOADING }
                icon='stop' intent={Intent.NONE} >
            <span>Stop</span>
        </Button>
        </div>
    )
}
