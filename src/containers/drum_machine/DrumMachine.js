import React, {Fragment, useState, useEffect} from 'react';
import Tone from 'tone';
import './DrumMachine.css';
import SampleArray from '../../config/drum_machine/SampleArray';
import Select from '../../components/Select';
import Slider from '../../components/Slider';
import kick from '../../assets/sounds/kick.wav';
import hat from '../../assets/sounds/hat.wav';
import snare from '../../assets/sounds/snare.wav';
import tom from '../../assets/sounds/tom.wav';

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
              <h3 className="drum-machine-values">{swing} <p className="drum-machine-units">Swing</p></h3>
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
                <p>SWING</p>
              </div>
              <div className="drum-machine-slider-container">
                <Slider styleName={"swing-slider"} min={0.0} max={1.0} step={0.1} value={swing} update={updateSwing} />
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
              <button className="drum-machine-destroy-buttons drum-machine-reset-buttons" onClick={resetDelay}>RESET DELAY</button>
            </div>
            <div className="drum-machine-clear-but-container">
              <button className="drum-machine-destroy-buttons drum-machine-clear-button" onClick={clearDrumMachine}>CLEAR</button>
            </div>
            <div>
              <Select styleName={"sample-select"} choices={sampleChoices} name={"Kits"} />
            </div>
        </div>
      </section>
    </Fragment>
  )
}
