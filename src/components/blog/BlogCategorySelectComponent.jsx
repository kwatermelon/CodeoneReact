import React from 'react';

function BlogCategorySelectComponent(props) {
    return(
        <div className="col">
            <label htmlFor={props.id} className="form-label">{props.title}</label>
            <span className={props.id + " form-control form-control-lg"} id={props.id}>{props.names.length === 0 ? props.title : props.names.join(", ")}</span>
            {
                props.values.map(element => {
                    return <input type="hidden" name={props.name} value={element} key={element} />
                })
            }
            <select className="form-select form-select-lg" onChange={props.onChange}>
                <option>{props.title} 선택</option>
            {
                props.data !== undefined && props.data.map(element => {
                    return <option value={element.seq} key={element.seq}>{element.name}</option>;
                })
            }
            </select>
        </div>
    );
}

export default BlogCategorySelectComponent;