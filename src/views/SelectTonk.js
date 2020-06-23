import React, {Fragment} from 'react';
import TonkBoxList from '../components/TonkBoxList';
import TonkBoxes from '../config/TonkBoxes'

export default function SelectTonk() {
  return (
    <Fragment>
      <header>
        <div className="select-title-container">
          <h1 className="select-title">TONK.js</h1>
        </div>
        <hr/>
      </header>
      <main>
        <p className="select-tonk-box">Select your Tonk-box</p>
        <TonkBoxList tonkboxes={TonkBoxes}/>
      </main>
    </Fragment>
  )
}
