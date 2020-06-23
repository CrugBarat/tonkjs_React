import React, {Fragment, useEffect, useState} from 'react';
import Tone from 'tone';
import './StepSequencer.css';
import NotesArray from '../../config/step_sequencer/NotesArray';
import SynthsArray from '../../config/step_sequencer/SynthsArray';
import SynthChoices from '../../config/step_sequencer/SynthChoices';
import Select from '../../components/Select';
import Slider from '../../components/Slider';

export default function StepSequencer() {
  const [notes, setNotes] = useState(NotesArray);
  const [synths] = useState(SynthsArray);
  const [synthArr, setSynthArr] = useState([]);
  const [synthChoices] = useState(SynthChoices);
  const [currentNote, setCurrentNote] = useState('C3');
  const [rows, setRows] = useState(document.body.querySelectorAll('div > div'));
  const [playing, setPlaying] = useState(false);
  const [eventID, setEventID] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0.0);
  const [gain, setGain] = useState(1.0);
  const [delay, setDelay] = useState(0.0);
  const [recDest] = useState(Tone.context.createMediaStreamDestination());
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);

  let index = 0;

  useEffect(() => {
    getRows();
    makeSynthArr(0);
  }, []);

  function getRows() {
    const rows = document.body.querySelectorAll('section > div');
    setRows(rows);
  }

  function makeSynthArr(choice) {
    const synthArr = [];
    for(let i=0; i<8; i++) {
      synthArr.push(synths[choice]);
    }
    setSynthArr(synthArr);
  }

  function startSynth() {
    if(!playing) {
      stopSynth();
      synthArr.forEach(synth => synth.connect(recDest));
      synthArr.forEach(synth => synth.toMaster());
      const eventID = Tone.Transport.scheduleRepeat(repeat, '8n');
      setEventID(eventID);
      Tone.Transport.start();
      setPlaying(true);
    }
  }

  function stopSynth() {
    Tone.Transport.stop();
    Tone.Transport.clear(eventID);
    index = 0;
    setPlaying(false);
  }

  function stopMedia() {
    if(recording) {
      recordStop();
    }
    stopSynth();
  }

  function repeat() {
    let step = index % 8;
    for (let i = 0; i < synthArr.length; i++) {
      let synth = synthArr[i];
      let note = notes[i];
      let row = rows[i];
      let input = row.querySelector(`input:nth-child(${step + 1})`);
      if (input.checked) synth.triggerAttackRelease(note, '8n');
    }
    index++;
  }

  function clearSequencer() {
    stopSynth();
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
    synths.forEach(synth => synth.disconnect());
    setGain(parseFloat(gain));
    const newGain = new Tone.Gain(gain);
    newGain.toMaster();
    synths.forEach(synth => synth.connect(newGain));
    setDelay(0);
  }

  function updateDelay(delay) {
    synths.forEach(synth => synth.disconnect());
    setDelay(parseFloat(delay));
    const pingPong = new Tone.PingPongDelay("4n", delay).toMaster();
    synths.forEach(synth => synth.connect(pingPong));
  }

  function resetDelay() {
    synths.forEach(synth => synth.disconnect());
    synths.forEach(synth => synth.toMaster());
    setDelay(0);
  }

  function reduceOctave() {
    if(notes[7].split('')[1] === '1') return;
    const newNotes = notes.map(note => note.split('')).map(note => note[0] + (parseInt(note[1])-1).toString());
    setNotes(newNotes);
    setCurrentNote(newNotes[7]);
  }

  function increaseOctave() {
    if(notes[7].split('')[1] === '8') return;
    const newNotes = notes.map(note => note.split('')).map(note => note[0] + (parseInt(note[1])+1).toString());
    setNotes(newNotes);
    setCurrentNote(newNotes[7]);
  }

  function onSynthSelect(synth) {
    if(synth === 'AMSynth') {
        makeSynthArr(1);
        setPlaying(false);
    } else if (synth === 'DuoSynth') {
        makeSynthArr(2);
        setPlaying(false);
    } else if (synth === 'FMSynth') {
        makeSynthArr(3);
        setPlaying(false);
    } else if (synth === 'MembraneSynth') {
        makeSynthArr(4);
        setPlaying(false);
    } else if (synth === 'MonoSynth') {
        makeSynthArr(5);
        setPlaying(false);
    } else if (synth === 'PluckSynth') {
        makeSynthArr(6);
        setPlaying(false);
    } else {
        makeSynthArr(0);
        setPlaying(false);
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
      clearSequencer();
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
      <section className="step-sequencer-controls-container">
        <div>
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
          <input id="step-row1" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
          <input id="step-row2" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
          <input id="step-row3" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
          <input id="step-row4" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
          <input id="step-row5" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
          <input id="step-row6" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
          <input id="step-row7" className="step-sequencer" type="checkbox" />
        </div>
        <div>
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
          <input id="step-row8" className="step-sequencer" type="checkbox" />
        </div>

          <div className="step-sequencer-values-border">
            <div className="step-sequencer-values-container">
              <h3 className="step-sequencer-values">{currentNote} <p className="step-sequencer-units">Note</p></h3>
              <h3 className="step-sequencer-values">{swing} <p className="step-sequencer-units">Swing</p></h3>
              <h3 className="step-sequencer-values">{delay} <p className="step-sequencer-units">Delay</p></h3>
              <h3 className="step-sequencer-values">{gain} <p className="step-sequencer-units">Gain</p></h3>
              <h3 className="step-sequencer-values">{bpm} <p className="step-sequencer-units">BPM</p></h3>
            </div>
          </div>
          <div className="step-sequencer-sliders-container">
            <div className="step-sequencer-slider-value">
              <p>BPM</p>
            </div>
            <div className="step-sequencer-slider-container">
            <Slider styleName={"bpm-slider"} min={1} max={180} step={1} value={bpm} update={updateBPM} />
            </div>
            <div className="step-sequencer-slider-value">
              <p>SWING</p>
            </div>
            <div className="step-sequencer-slider-container">
              <Slider styleName={"swing-slider"} min={0.0} max={1.0} step={0.1} value={swing} update={updateSwing} />
            </div>
            <div className="step-sequencer-slider-value">
              <p>DELAY</p>
            </div>
            <div className="step-sequencer-slider-container">
              <Slider styleName={"delay-slider"} min={0.0} max={1.0} step={0.1} value={delay} update={updateDelay} />
            </div>
            <div className="step-sequencer-slider-value">
              <p>GAIN</p>
            </div>
            <div className="step-sequencer-slider-container">
              <Slider styleName={"gain-slider"} min={0.1} max={1.0} step={0.1} value={gain} update={updateGain} />
            </div>
          </div>
          <div className="step-sequencer-media-border">
            <div className="step-sequencer-media-controls-container">
              <div className="step-sequencer-main-control">
                <button className="step-sequencer" name="play" onClick={startSynth}></button>
              </div>
                <div className="step-sequencer-sub-controls">
                <div>
                  <button className="step-sequencer" name="record" onClick={recordStart}></button>
                </div>
                <div>
                  <button className="step-sequencer" name="stop" onClick={stopMedia}></button>
                </div>
              </div>
            </div>
          </div>
          <Select styleName={"select"} choices={synthChoices} onSelect={onSynthSelect} name={"Synths"} />
          <div className="step-sequencer-oct-container">
           <button className="step-sequencer-oct-decrease-button" onClick={reduceOctave}>-</button>
           <span> OCT </span>
           <button className="step-sequencer-oct-increase-button" onClick={increaseOctave}>+</button>
         </div>
          <div>
            <button className="step-sequencer-destroy-buttons" onClick={resetDelay}>RESET DELAY</button>
            <button className="step-sequencer-destroy-buttons" onClick={clearSequencer}>CLEAR</button>
          </div>
      </section>
    </Fragment>
  )
}
