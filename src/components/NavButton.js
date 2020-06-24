import React from 'react';
import './Component.css'

export default function NavButton(props) {

  return (
    <a href={props.link}>
      <img className={props.styleName} src={props.image} alt=""/>
    </a>
  )
}
