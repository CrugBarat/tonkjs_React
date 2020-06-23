import React, {Fragment, useState} from 'react';
import Tone from 'tone';
import mapChords from '../helpers/MapChords';
import SynthChoices from '../config/SynthChoices';
import DurationChoices from '../config/DurationChoices';
import Select from '../components/Select';
import Slider from '../components/Slider';
import './Arpeggiator.css';

export default function Arpeggiator() {
  const [synth, setSynth] = useState(new Tone.Synth());
  const [chordIndex, setChordIndex] = useState(0);
  const [formattedChords] = useState(mapChords);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState('16n');
  const [synthChoices] = useState(SynthChoices);
  const [durationChoices] = useState(DurationChoices);
  const [eventID, setEventID] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [swing, setSwing] = useState(0.0);
  const [gain, setGain] = useState(1.0);
  const [recDest] = useState(Tone.context.createMediaStreamDestination());
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [order, setOrder] = useState('UP');

  function handleChord(value) {
    setChordIndex(parseInt(value) - 1);
    getOrder(parseInt(value) - 1);
  }

  function repeat(time) {
    let chord = formattedChords[chordIndex];
    let note = chord[step % chord.length];
    synth.triggerAttackRelease(note, duration, time);
    setStep(step + 1);
  }

  function startSynth() {
    if(playing) return;
    stopSynth();
    setPlaying(true);
    synth.connect(recDest);
    synth.toMaster();
    const eventID = Tone.Transport.scheduleRepeat(repeat, duration);
    setEventID(eventID);
    Tone.Transport.start();
  }

  function stopSynth() {
    Tone.Transport.stop();
    Tone.Transport.clear(eventID);
    setPlaying(false);
  }

  function onSynthSelect(synth) {
    if(synth === 'AMSynth') {
        setSynth(new Tone.AMSynth());
        setPlaying(false);
    } else if (synth === 'DuoSynth') {
        setSynth(new Tone.DuoSynth());
        setPlaying(false);
    } else if (synth === 'FMSynth') {
        setSynth(new Tone.FMSynth());
        setPlaying(false);
    } else if (synth === 'MembraneSynth') {
        setSynth(new Tone.MembraneSynth());
        setPlaying(false);
    } else if (synth === 'MonoSynth') {
        setSynth(new Tone.MonoSynth());
        setPlaying(false);
    } else if (synth === 'PluckSynth') {
        setSynth(new Tone.PluckSynth());
        setPlaying(false);
    } else if (synth === 'PolySynth') {
        setSynth(new Tone.PolySynth());
        setPlaying(false);
    } else {
        setSynth(new Tone.Synth());
        setPlaying(false);
    }
  }

  function onDurationSelect(duration) {
    if(duration === '4n') {
        setDuration('4n');
        setPlaying(false);
    } else if (duration === '8n') {
        setDuration('8n');
        setPlaying(false);
    } else if (duration === '16n') {
        setDuration('16n');
        setPlaying(false);
    } else {
        setDuration('32n');
        setPlaying(false);
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
    synth.disconnect();
    setGain(parseFloat(gain));
    const newGain = new Tone.Gain(gain);
    newGain.toMaster();
    synth.connect(newGain);
  }

  function recordStart() {
    const recorder = new MediaRecorder(recDest.stream, {'type': 'audio/wav'});
    setRecorder(recorder);
    setRecording(true);
    recorder.start();
  }

  function recordStop() {
    if(recorder != null) {
      setRecording(false)
      recorder.stop();
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

  function stopMedia() {
    if(recording) {
      recordStop();
    }
      stopSynth();
    }

  function getOrder(value) {
    if(value <= 4) {
      setOrder('UP');
    } else if (value > 4 && value <= 9) {
      setOrder('DN');
    } else {
      setOrder('IN');
    }
  }

    return (
      <Fragment>
      <section className="controls-container">
          <div>
            <input id="c1" value="1" type="radio" name="chord" />
            <label onClick={() => handleChord(1)} className="c1" htmlFor="c1"></label>
            <input id="c2" value="2" type="radio" name="chord" />
            <label onClick={() => handleChord(2)} className="c2" htmlFor="c2"></label>
            <input id="c3" value="3" type="radio" name="chord" />
            <label onClick={() => handleChord(3)} className="c3" htmlFor="c3"></label>
            <input id="c4" value="4" type="radio" name="chord" />
            <label onClick={() => handleChord(4)} className="c4" htmlFor="c4"></label>
            <input id="c5" value="5" type="radio" name="chord" />
            <label onClick={() => handleChord(5)} className="c5" htmlFor="c5"></label>
          </div>
          <div>
            <input id="c6" value="6" type="radio" name="chord" />
            <label onClick={() => handleChord(6)} className="c6" htmlFor="c6"></label>
            <input id="c7" value="7" type="radio" name="chord" />
            <label onClick={() => handleChord(7)} className="c7" htmlFor="c7"></label>
            <input id="c8" value="8" type="radio" name="chord" />
            <label onClick={() => handleChord(8)} className="c8" htmlFor="c8"></label>
            <input id="c9" value="9" type="radio" name="chord" />
            <label onClick={() => handleChord(9)} className="c9" htmlFor="c9"></label>
            <input id="c10" value="10" type="radio" name="chord" />
            <label onClick={() => handleChord(10)} className="c10" htmlFor="c10"></label>
          </div>
          <div>
            <input id="c11" value="11" type="radio" name="chord" />
            <label onClick={() => handleChord(11)} className="c11" htmlFor="c11"></label>
            <input id="c12" value="12" type="radio" name="chord" />
            <label onClick={() => handleChord(12)} className="c12" htmlFor="c12"></label>
            <input id="c13" value="13" type="radio" name="chord" />
            <label onClick={() => handleChord(13)} className="c13" htmlFor="c13"></label>
            <input id="c14" value="14" type="radio" name="chord" />
            <label onClick={() => handleChord(14)} className="c14" htmlFor="c14"></label>
            <input id="c15" value="15" type="radio" name="chord" />
            <label onClick={() => handleChord(15)} className="c15" htmlFor="c15"></label>
          </div>
          <div className="values-border">
            <div className="values-container">
              <h3 className="values">{bpm} <p className="units">BPM</p></h3>
              <h3 className="values">{order} <p className="units">ORDER</p></h3>
              <h3 className="values">{swing} <p className="units">Swing</p></h3>
              <h3 className="values">{gain} <p className="units">Gain</p></h3>
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
                <p>GAIN</p>
              </div>
              <div className="slider-container">
                <Slider styleName={"gain-slider"} min={0.1} max={1.0} step={0.1} value={gain} update={updateGain} />
              </div>
            </div>
            <div className="media-border">
              <div className="media-controls-container">
                <div className="main-control">
                  <button name="play" onClick={startSynth}></button>
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
          <Select choices={synthChoices} onSelect={onSynthSelect} name={"Synths"} />
          <Select choices={durationChoices} onSelect={onDurationSelect} name={"Rate"} />
      </section>
      </Fragment>
    )
}
