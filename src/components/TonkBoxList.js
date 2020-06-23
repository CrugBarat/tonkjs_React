import React, {Fragment} from 'react';
import TonkBox from './TonkBox';

const TonkBoxList = (props) => {
  const tonkbox = props.tonkboxes.map((tonkbox, index) => {
    return <TonkBox tonkbox={tonkbox} key={index}/>
  });

  return(
    <Fragment>
      {tonkbox}
    </Fragment>
  )
}

export default TonkBoxList;
