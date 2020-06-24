import React, {Fragment} from 'react';
import TonkBoxList from '../components/TonkBoxList';
import TonkBoxes from '../config/TonkBoxes';
import NavButton from '../components/NavButton';
import git from '../assets/images/git.png';
import linked from '../assets/images/linked.png';
import rewind from '../assets/images/rewind.png';

export default function About() {
  return (
    <Fragment>
      <header>
        <div className="select-title-container">
          <h1 className="select-title">TONK.js</h1>
        </div>
        <hr/>
      </header>
      <main>
        <p className="select-tonk-box">What's all this then?</p>
        <div className="about-container">
          <p className="about-text"><span className="tonk-bold pink">TONK.js</span> uses the power of <span className="green">Tone.js</span>, a framework for creating interactive music in the broswer.
            <a href="https://tonejs.github.io/">
              <span className="tonk-bold sky-blue"> More info here!</span>
            </a>
          </p>
          <p className="about-text">Each <span className="tonk-bold purple">TONK-BOX</span> comes equipped with a selection of pads that once triggered play a specific sound when the user presses play. <span className="tonk-bold red">Other features include:</span></p>
          <ul>
            <li className="pink">Effect manipulation</li>
            <li className="green">Multiple synths/kit presets</li>
            <li className="sky-blue">Record & download</li>
          </ul>
          <p className="about-text">Pick your <span className="tonk-bold purple">TONK-BOX</span>. Make some <span className="tonk-bold pink">NOISE!</span></p>
        </div>
        <div>
          <NavButton name="back" link={"/select"} image={rewind} styleName={"about-back-button"} />
          <a href="https://github.com/CrugBarat/tonkjs_React">
            <img className="link-logo" src={git} alt=""/>
          </a>
          <a href="https://www.linkedin.com/in/craig-t-barratt/">
            <img className="link-logo" src={linked} alt=""/>
          </a>
        </div>
      </main>
    </Fragment>
  )
}
