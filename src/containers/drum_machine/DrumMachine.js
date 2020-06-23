import React, {Fragment, useState, useEffect} from 'react';
import Tone from 'tone';
import './DrumMachine.css';
import SampleArray from '../config/drum_machine/SampleArray';
import Select from '../components/Select';
import Slider from '../components/Slider';
import kick from '../assets/sounds/kick.wav';
import hat from '../assets/sounds/hat.wav';
import snare from '../assets/sounds/snare.wav';
import tom from '../assets/sounds/tom.wav';

export default function DrumMachine() {
  const [samples] = useState(SampleArray);
  const [sampler] = useState(new Tone.Sampler({"E1": kick, "E3": snare, "E5": hat, "E2": tom}));
  const [rows, setRows] = useState(document.body.querySelectorAll('div > div'));
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [eventID, setEventID] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0.0);
  const [gain, setGain] = useState(1.0);
  const [delay, setDelay] = useState(0.0);
  const [sampleChoices] = useState(['808']);
  const [kit, setKit] = useState('808');
  const [recDest] = useState(Tone.context.createMediaStreamDestination());
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);

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
    setIndex(index + 1);
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
    setIndex(0);
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

  function updateSwing(swing) {
    setSwing(parseFloat(swing));
    Tone.Transport.swing = swing;
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

  function resetDelay() {
    sampler.disconnect();
    sampler.toMaster();
    setDelay(0);
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
        link.innerHTML = 'DOWNLOAD FILE';
        document.body.appendChild(link);
      };
    }
  }

  return (
    <Fragment>
      <section className="controls-container">
        <div>
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
          <input className="row1" type="checkbox" />
        </div>
        <div>
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
          <input className="row2" type="checkbox" />
        </div>
        <div>
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
          <input className="row3" type="checkbox" />
        </div>
        <div>
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
          <input className="row4" type="checkbox" />
        </div>

          <div className="values-border">
            <div className="values-container">
              <h3 className="values">{kit} <p className="units">Kit</p></h3>
              <h3 className="values">{swing} <p className="units">Swing</p></h3>
              <h3 className="values">{delay} <p className="units">Delay</p></h3>
              <h3 className="values">{gain} <p className="units">Gain</p></h3>
              <h3 className="values">{bpm} <p className="units">BPM</p></h3>
            </div>
          </div>
          <div className="media-border">
            <div className="media-controls-container">
              <p className="controls-title">CONTROLS</p>
              <div className="main-control">
                <button name="play" onClick={startDrumMachine}></button>
              </div>
                <div className="sub-controls">
                <div>
                  <button name="record" onClick={recordStart}></button>
                </div>
                <div>
                  <button name="stop" onClick={stopMedia}></button>
                </div>
              </div>
            </div>
          </div>
          <div className="sliders-container">
              <div className="slider-value">
                <p>BPM</p>
              </div>
              <div className="slider-container">
                <Slider styleName={"bpm-slider"} min={1} max={180} step={1} value={bpm} update={updateBPM} />
              </div>
              <div className="slider-value">
                <p>SWING</p>
              </div>
              <div className="slider-container">
                <Slider styleName={"swing-slider"} min={0.0} max={1.0} step={0.1} value={swing} update={updateSwing} />
              </div>
              <div className="slider-value">
                <p>DELAY</p>
              </div>
              <div className="slider-container">
                <Slider styleName={"delay-slider"} min={0.0} max={1.0} step={0.1} value={delay} update={updateDelay} />
              </div>
              <div className="slider-value">
                <p>GAIN</p>
              </div>
              <div className="slider-container">
                <Slider styleName={"gain-slider"} min={0.1} max={1.0} step={0.1} value={gain} update={updateGain} />
              </div>
            </div>
          <div>
            <div className="reset-but-container">
              <button className="destroy-buttons reset-buttons" onClick={resetDelay}>RESET DELAY</button>
            </div>
            <div className="clear-but-container">
              <button className="destroy-buttons clear-button" onClick={clearDrumMachine}>CLEAR</button>
            </div>
            <div>
              <Select choices={sampleChoices} name={"Kits"} />
            </div>
        </div>
      </section>
    </Fragment>
  )
}
