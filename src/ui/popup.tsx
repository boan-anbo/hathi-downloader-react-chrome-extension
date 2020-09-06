import * as React from "react"
import * as ReactDOM from "react-dom"

import "../styles/popup.css"
import {Gift} from "../app/Gift";
import {ProgressReport, standardGift} from "./popui.const";
import SendToBackground from "./sendToBackground";
import {BasicBookInfo} from "../app/entities";
import {Button, Icon, Intent, ProgressBar} from "@blueprintjs/core";
import {DownloadState} from "./downloadState";
import {StartStopButton} from "./StartStopButton";
import {interval, Observable, Subscription, TimeInterval} from 'rxjs';




const DownloadPath = (props: {
    downloadPath: string
}) => {
    return <div><Icon icon="folder-open" intent={Intent.PRIMARY}  /><span>To Folder: </span><span className="bp3-code ">{ props.downloadPath }</span></div>
}

const PageNumber = (props: {pageNumber: number}) => {
    return <div><Icon icon='document' intent={Intent.PRIMARY} /><span>Pages: </span><span className='bp3-text-small'>{ props.pageNumber }</span></div>
}

const Title = (props: {title: string}) => {
    return (
        <div><Icon icon={'book'} intent={Intent.PRIMARY} /><span>Title: </span><span className='bp3-text-small'>{ props.title  }</span></div>
    );
}

const Progress = (props: {
    progressReport: ProgressReport
}) => {
    return (<div>
        <ProgressBar intent={Intent.SUCCESS} value={ props.progressReport?.allPageProgress }/>
        ( { props.progressReport?.currentPage } / {props.progressReport?.allPages })
    </div>)
}

const CurrentState = (props: {
    currentState: DownloadState
}) => {
    return <div>{ props.currentState }</div>
}

class Popup extends React.Component<{},
    {
    currentState: DownloadState,
    basicBookInfo: BasicBookInfo,
    progressReport: ProgressReport,
    progressCheckTimer: Observable<number>
    }
    > {

    progressCheckSubscription: Subscription;

    constructor(props: {}) {
        super(props);
        this.state = {
            currentState: DownloadState.IDLE,
            basicBookInfo: {
                title: null,
                pages: null,
                downloadPath: null

            },
            progressReport: new ProgressReport(),
            progressCheckTimer: interval(1000)
        }
    this.SendMessageToCurrentContentTab = this.SendMessageToCurrentContentTab.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any) {
        console.log('POP UP DETECTED CHANGEEEE', this.state)
    }

    componentWillUnmount() {
        this.progressCheckSubscription?.unsubscribe()
    }

    componentDidMount() {
        const getBasicBookInfo: Gift = {
            instruction: "Get",
            type: "BasicBookInfo",
            from: "Popup",
            recipient: "Content"
        }
        this.SendMessageToCurrentContentTab(getBasicBookInfo)

        chrome.runtime.onMessage.addListener((gift: Gift) => {
            console.log("Im the listener for popup, I just hear", gift)

            switch(gift.instruction) {
                case "Push":
                    switch(gift.type) {
                        case "BasicBookInfo":
                            console.log('I HAVE RECEIVED BASIC BOOK INFO', gift.payload)
                            this.setState({
                                basicBookInfo : gift.payload
                            })
                            if (this.IsBookInfoComplete(gift.payload)) {
                                this.setState({currentState : DownloadState.FoundBook})
                            }
                            break
                        case "DOM":
                            console.log('I am Popup FINALLY RECEIVED THE,', gift.payload)
                            break
                    }
                    break
            }
        })
        this.StartProgressTimer()
    }

    StartProgressTimer() {
        this.progressCheckSubscription = this.state.progressCheckTimer.subscribe(() => {
            console.log('A second passed!!!')
            this.CheckDownloadProgres()
        })
    }

    StopProgressTimer() {
        this.progressCheckSubscription?.unsubscribe()
    }

    CheckDownloadProgres() {
        this.SendMessageToCurrentContentTab({
            instruction: "ReportProgress",
            from: "Popup",
            recipient: "Background"
        })
    }

    FetchProgressReport = (progressReport: ProgressReport) => {
            console.log(progressReport);
            this.setState({progressReport})

    }
    SendMessageToCurrentContentTab = (gift: Gift) => {
        console.log('I am in Popup, I am sending', standardGift, 'to content')
        const fetchReport = this.FetchProgressReport
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            chrome.tabs.sendMessage(
                tabs[0].id,
                gift,
                    fetchReport
                );
        });
    }

    IsBookInfoComplete(basicBookInfo?: BasicBookInfo) {
        if (basicBookInfo) return basicBookInfo.downloadPath && basicBookInfo.pages && basicBookInfo.title
        else return this.state.basicBookInfo.downloadPath && this.state.basicBookInfo.pages && this.state.basicBookInfo.title
    }

    GetContent() {
    }
    private ShowMeTheTitle() {

    }

    private

    render() {
        return (

            <div className="popup-padded">


                <CurrentState currentState={ this.state.currentState } />
                { this.IsBookInfoComplete() && <div>
                <Title title={ this.state.basicBookInfo.title } />
                <PageNumber pageNumber={ this.state.basicBookInfo.pages } />
                <DownloadPath downloadPath={ this.state.basicBookInfo.downloadPath } />
                <Progress progressReport={ this.state.progressReport } />
                </div>
                }
                <StartStopButton progressReport={ this.state.progressReport } SendToBackground={this.SendMessageToCurrentContentTab} />
                <Button onClick={ () => this.CheckDownloadProgres() }>Check Progress</Button>
                <SendToBackground />



                <button onClick={() => this.ShowMeTheTitle()}>
                    Send Message To Content
                </button>


                { JSON.stringify(this.state.progressReport) }
            </div>
        )
    }


}

// --------------

ReactDOM.render(

        <Popup />

    ,
    document.getElementById('root')
)


