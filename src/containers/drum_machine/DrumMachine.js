import React, {Fragment, useState, useEffect} from 'react';
import Tone from 'tone';
import './DrumMachine.css';
import SampleArray from '../../config/drum_machine/SampleArray';
import SampleChoices from '../../config/drum_machine/SampleChoices';
import Select from '../../components/Select';
import Slider from '../../components/Slider';
import NavButton from '../../components/NavButton';
import kick from '../../assets/sounds/808/kick.wav';
import hat from '../../assets/sounds/808/hat.wav';
import snare from '../../assets/sounds/808/snare.wav';
import tom from '../../assets/sounds/808/tom.wav';
import rewind from '../../assets/images/rewind.png';
import forward from '../../assets/images/forward.png';

export default function DrumMachine() {
  const [samples, setSamples] = useState(SampleArray[0]);
  const [sampler, setSampler] = useState(new Tone.Sampler({"E1": kick, "E3": snare, "E5": hat, "E2": tom}));
  const [rows, setRows] = useState(document.body.querySelectorAll('div > div'));
  const [playing, setPlaying] = useState(false);
  const [eventID, setEventID] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [distortion, setDistortion] = useState(0.0);
  const [gain, setGain] = useState(1.0);
  const [delay, setDelay] = useState(0.0);
  const [sampleChoices] = useState(SampleChoices);
  const [kit, setKit] = useState('808');
  const [recDest] = useState(Tone.context.createMediaStreamDestination());
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);

  let index = 0;

  useEffect(() => {getRows()}, []);

  function getRows() {
    const rows = document.body.querySelectorAll('section > div');
    setRows(rows);
  }

  function repeat() {
    let step = index % 16;
    for (let i = 0; i < 4; i++) {
      let sample = samples[i];
      let row = rows[i];
      let input = row.querySelector(`input:nth-child(${step + 1})`);
      console.log(index);
      if (input.checked) {
        sampler.triggerAttackRelease(Object.keys(sample[0]), '16n');
      }
    }
    index++;
  }

  function startDrumMachine() {
    if(!playing) {
      stopDrumMachine();
      sampler.disconnect();
      sampler.connect(recDest);
      sampler.toMaster();
      const eventID = Tone.Transport.scheduleRepeat(repeat, '16n');
      setEventID(eventID);
      Tone.Transport.start();
      setPlaying(true);
    }
  }

  function stopDrumMachine() {
    Tone.Transport.stop();
    Tone.Transport.clear(eventID);
    index = 0
    setPlaying(false);
  }

  function stopMedia() {
    if(recording) {
      recordStop();
    }
    stopDrumMachine();
  }

  function clearDrumMachine() {
    stopDrumMachine();
    const inputs = document.body.querySelectorAll('input');
    for(let i =0; i<inputs.length; i++) {
      inputs[i].checked = false;
    }
  }

  function updateBPM(bpm) {
    setBpm(parseInt(bpm));
    Tone.Transport.bpm.value = bpm;
  }

  function updateDistortion(distortion) {
    sampler.disconnect();
    setDistortion(parseFloat(distortion));
    const dist = new Tone.Distortion(distortion).toMaster();
    sampler.connect(dist);
  }

  function updateGain(gain) {
    sampler.disconnect();
    setGain(parseFloat(gain));
    const newGain = new Tone.Gain(gain);
    newGain.toMaster();
    sampler.connect(newGain);
    setDelay(0);
  }

  function updateDelay(delay) {
    sampler.disconnect();
    setDelay(parseFloat(delay));
    const pingPong = new Tone.PingPongDelay("4n", delay).toMaster();
    sampler.connect(pingPong);
  }

  function resetEffects() {
    sampler.disconnect();
    sampler.toMaster();
    setDelay(0);
    setDistortion(0);
  }

  function handleSampleSelect(num) {
     let newSampleObj = {};
     for(let i=0; i < SampleArray[num].length; i++) {
       let key = Object.keys(SampleArray[num][i][0])
       newSampleObj[key] = SampleArray[num][i][0][key]
     }
     setSampler(new Tone.Sampler(newSampleObj));
   }

  function onSampleSelect(sample) {
    if(sample === 'Electro') {
        setKit('Elt');
        setSamples(SampleArray[1]);
        handleSampleSelect(1);
        stopDrumMachine();
    } else if (sample === 'Acoustic') {
        setKit('Act');
        setSamples(SampleArray[2]);
        handleSampleSelect(2);
        stopDrumMachine();
    } else if (sample === 'Techno') {
        setKit('Tch');
        setSamples(SampleArray[3]);
        handleSampleSelect(3);
        stopDrumMachine();
    } else if (sample === 'FX') {
        setKit('Fx');
        setSamples(SampleArray[4]);
        handleSampleSelect(4);
        stopDrumMachine();
    } else {
        setKit('808');
        setSamples(SampleArray[0]);
        handleSampleSelect(0);
        stopDrumMachine();
    }
  }

  function recordStart() {
    const recorder = new MediaRecorder(recDest.stream, {'type': 'audio/wav'});
    setRecorder(recorder);
    setRecording(true);
    recorder.start();
  }

  function recordStop() {
    if(recorder != null) {
      setRecording(false);
      recorder.stop();
      clearDrumMachine();
      setRecorder(null);
      const recChunks = [];
      recorder.ondataavailable = evt => recChunks.push(evt.data);
      recorder.onstop = evt => {
        let blob = new Blob(recChunks, {'type': 'audio/wav'});
        const audioURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.color = 'white';
        link.style.cssText = "font-size: 20px; color: white;"
        link.href = audioURL;
        link.download = 'my_recording';
        link.innerHTML = '&nbsp; DOWNLOAD &nbsp;';
        document.body.appendChild(link);
      };
    }
  }

  return (
    <Fragment>
      <NavButton name="back" link={"/select"} image={rewind} styleName={"back-button"} />
      <NavButton name="forward" link={"/arpeggiator"} image={forward} styleName={"forward-button"} />
      <section className="drum-machine-controls-container">
        <div>
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
          <input id="row1" className="drum-machine-rows" type="checkbox" />
        </div>
        <div>
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
          <input id="row2" className="drum-machine-rows" type="checkbox" />
        </div>
        <div>
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
          <input id="row3" className="drum-machine-rows" type="checkbox" />
        </div>
        <div>
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
          <input id="row4" className="drum-machine-rows" type="checkbox" />
        </div>

          <div className="drum-machine-values-border">
            <div className="drum-machine-values-container">
              <h3 className="drum-machine-values">{kit} <p className="drum-machine-units">Kit</p></h3>
              <h3 className="drum-machine-values">{distortion} <p className="drum-machine-units">Distortion</p></h3>
              <h3 className="drum-machine-values">{delay} <p className="drum-machine-units">Delay</p></h3>
              <h3 className="drum-machine-values">{gain} <p className="drum-machine-units">Gain</p></h3>
              <h3 className="drum-machine-values">{bpm} <p className="drum-machine-units">BPM</p></h3>
            </div>
          </div>
          <div className="drum-machine-media-border">
            <div className="drum-machine-media-controls-container">
              <p className="drum-machine-controls-title">CONTROLS</p>
              <div className="drum-machine-main-control">
                <button className="drum-machine" name="play" onClick={startDrumMachine}></button>
              </div>
                <div className="sub-controls">
                <div>
                  <button className="drum-machine" name="record" onClick={recordStart}></button>
                </div>
                <div>
                  <button className="drum-machine" name="stop" onClick={stopMedia}></button>
                </div>
              </div>
            </div>
          </div>
          <div className="drum-machine-sliders-container">
              <div className="drum-machine-slider-value">
                <p>BPM</p>
              </div>
              <div className="drum-machine-slider-container">
                <Slider styleName={"bpm-slider"} min={1} max={180} step={1} value={bpm} update={updateBPM} />
              </div>
              <div className="drum-machine-slider-value">
                <p>DIST</p>
              </div>
              <div className="drum-machine-slider-container">
                <Slider styleName={"swing-slider"} min={0.0} max={1.0} step={0.1} value={distortion} update={updateDistortion} />
              </div>
              <div className="drum-machine-slider-value">
                <p>DELAY</p>
              </div>
              <div className="drum-machine-slider-container">
                <Slider styleName={"delay-slider"} min={0.0} max={1.0} step={0.1} value={delay} update={updateDelay} />
              </div>
              <div className="drum-machine-slider-value">
                <p>GAIN</p>
              </div>
              <div className="drum-machine-slider-container">
                <Slider styleName={"gain-slider"} min={0.1} max={1.0} step={0.1} value={gain} update={updateGain} />
              </div>
            </div>
          <div>
            <div className="drum-machine-reset-but-container">
              <button className="drum-machine-destroy-buttons drum-machine-reset-buttons" onClick={resetEffects}>RESET</button>
            </div>
            <div className="drum-machine-clear-but-container">
              <button className="drum-machine-destroy-buttons drum-machine-clear-button" onClick={clearDrumMachine}>CLEAR</button>
            </div>
            <div>
              <Select styleName={"sample-select"} choices={sampleChoices} name={"Kits"} onSelect={onSampleSelect}/>
            </div>
            <h3 className="drum-tonk-label">TONK.js</h3>
        </div>
      </section>
    </Fragment>
  )
}
