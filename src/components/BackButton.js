import React from 'react';
import './Component.css'
import rewind from '../assets/images/rewind.png';

export default function BackButton() {

  return (
    <a href="/select">
      <img className="back-button" src={rewind} alt=""/>
    </a>
  )
}
