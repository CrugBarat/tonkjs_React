import React from 'react';
import './Component.css'

const Select = (props) => {
  const options = props.choices.map((choice, index) => {
      return <option key={index} value={choice.name}>{choice}</option>
  });

  function handleChange(ev) {
    props.onSelect(ev.target.value);
  }

  return (
    <select className={props.styleName} onChange={handleChange} defaultValue="default">
      <option value="default" disabled>{props.name}</option>
      {options}
    </select>
  )
}

export default Select;
