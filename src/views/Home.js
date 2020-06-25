import React, {Fragment, useEffect} from 'react';
import Tone from 'tone';
import NavButton from '../components/NavButton';
import forward from '../assets/images/forward.png';
import './Views.css'


export default function Home() {

  useEffect(() => {
    document.documentElement.addEventListener(
      "mousedown", function(){
      if (Tone.context.state !== 'running') {
      Tone.context.resume();
  }})
  });

  return (
    <Fragment>
      <div className="homepage-title-container">
        <div className="animation-container">
          <div className="homepage-title beep-title">
            <h3>BEEP.js</h3>
          </div>
          <div className="homepage-title bop-title">
            <h3>BOP.js</h3>
          </div>
          <div className="homepage-title boop-title">
            <h3>BOOP.js</h3>
          </div>
          <div className="homepage-title tonk-title">
            <h3>TONK.js</h3>
          </div>
          <div className="homepage-title">
            <h3>.js</h3>
          </div>
        </div>
      </div>
        <div className="homepage-button-container">
          <NavButton name="forward" link={"/select"} image={forward} styleName={"forward-button"} />
        </div>
    </Fragment>
  )
}
