import React, {Fragment} from 'react';
import getImage from '../helpers/imgMap.js';
import './Component.css'

const TonkBox = (props) => {
  if(!props.tonkbox) return null;

  return (
    <Fragment>
      <a href={props.tonkbox.path}>
      <div className={props.tonkbox.class}>
        <div className={props.tonkbox.capClass}>
          <img className={props.tonkbox.imgClass} src={getImage(props.tonkbox.image)} alt=""/>
          <div className={props.tonkbox.caption}>
            <div className={props.tonkbox.blur}></div>
            <div className={props.tonkbox.capText}>
            <p className="tonk-box-title">{props.tonkbox.name}</p>
            <p></p>
            <p></p>
            <p></p>
            </div>
          </div>
        </div>
      </div>
      </a>
    </Fragment>
  )
}

export default TonkBox;
