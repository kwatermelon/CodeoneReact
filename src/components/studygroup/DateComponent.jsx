import React from 'react';

function DateComponent(props) {
    return(
        <div className="col">
        <label htmlFor={props.id} id={props.id+"Label"} className="form-label">{props.title}</label>
        <input type="date" className={props.id + " form-control form-control-lg"} id={props.id} name={props.id} onChange={props.onChange} value={props.value} />

        {
            props.extra !== undefined && (
                <>
                ~
                <input type="date" className={props.extra.id + " form-control form-control-lg"} id={props.extra.id} name={props.extra.id} onChange={props.extra.onChange} value={props.extra.value} />
                </>
            )
        }
    </div>
    );
}

export default DateComponent;