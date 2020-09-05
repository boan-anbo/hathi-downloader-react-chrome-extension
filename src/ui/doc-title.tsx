import React from 'react';

function DocTitle(props) {
    return (
        <div>{props.title ? props.title : 'Waiting For the Title'}</div>
    );
}

export default DocTitle;
