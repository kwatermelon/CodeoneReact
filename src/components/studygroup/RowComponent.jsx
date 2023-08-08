import React from 'react';

function RowComponent(props) {
    return(
        <div className="row">
            {props.left}
            {props.right}
        </div>
    );
}

export default RowComponent;