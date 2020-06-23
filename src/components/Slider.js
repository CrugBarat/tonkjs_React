import React from 'react';
import './Component.css'

const Slider = (props) => {

    function handleChange(evt) {
        props.update(evt.target.value)
    }

    return (
      <div>
        <input className={`${props.styleName}`} type="range" min={props.min} max={props.max} step={props.step} onChange={handleChange} value={props.value}>
        </input>
      </div>
    )
}

export default Slider;
