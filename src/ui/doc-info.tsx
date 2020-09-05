import React, {Component} from 'react';
import DocTitle from "./doc-title";
import {BasicBookInfo} from "../app/entities";





export default class DocInfo extends Component<BasicBookInfo, {}> {
    constructor(props) {
        super(props);
        console.log('DOC INFO CLASS PROPS', props)
    }
    componentDidUpdate(props){
        // Desired operations: ex setting state
        console.log('Doc Info Detected CHANGEEEEEEEE', this.props)
    }
    render()  {
        return (<div>
            <DocTitle title={this.props.title} />

        </div>
        )
    }

}


