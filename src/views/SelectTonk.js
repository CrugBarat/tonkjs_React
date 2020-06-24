import React, {Fragment} from 'react';
import TonkBoxList from '../components/TonkBoxList';
import TonkBoxes from '../config/TonkBoxes';
import git from '../assets/images/git.png';
import linked from '../assets/images/linked.png';
import about from '../assets/images/about.png';

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
        <div>
          <a href="https://github.com/CrugBarat/tonkjs_React">
            <img className="link-logo" src={git} alt=""/>
          </a>
          <a href="https://www.linkedin.com/in/craig-t-barratt/">
            <img className="link-logo" src={linked} alt=""/>
          </a>
          <a href="/about">
            <img className="link-logo" src={about} alt=""/>
          </a>
        </div>
      </main>
    </Fragment>
  )
}
