import React, {Fragment} from 'react';
import NavButton from '../components/NavButton';
import forward from '../assets/images/forward.png';
import './Views.css'


export default function Home() {

  return (
    <Fragment>
      <div className="homepage-title-container">
        <h3 className="homepage-title">TONK.js</h3>
      </div>
      <NavButton name="forward" link={"/select"} image={forward} styleName={"forward-button"} />
    </Fragment>
  )
}
