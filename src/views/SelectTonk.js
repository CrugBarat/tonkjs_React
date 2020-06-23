import React from 'react';
import TonkBoxList from '../components/TonkBoxList';
import TonkBoxes from '../config/TonkBoxes'

export default function SelectTonk() {
  return (
    <header>
      <div className="select-title-container">
        <h1 className="select-title">TONK.js</h1>
      </div>
      <hr/>
      <main>
        <p className="select-tonk-box">Select your Tonk-box</p>
        <TonkBoxList tonkboxes={TonkBoxes}/>
      </main>
    </header>
  )
}
