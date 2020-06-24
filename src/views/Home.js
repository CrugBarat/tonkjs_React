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
        <h3 className="homepage-title">TONK.js</h3>
      </div>
      <NavButton name="forward" link={"/select"} image={forward} styleName={"forward-button"} />
    </Fragment>
  )
}
