import React from 'react';

function SelectComponent(props) {
    return(
        <div className="col">
            <label htmlFor={props.id} className="form-label">{props.title}</label>
            <select className={props.id + " form-select form-select-lg"} id={props.id} name={props.id} onChange={props.onChange} value={props.value}>
                <option>{props.title}</option>
                {
                    props.data !== undefined && props.data.map(element => {
                        return <option value={element.seq} key={element.seq}>{element.name}</option>
                    })
                }
            </select>
        </div>
    );
}

export default SelectComponent;