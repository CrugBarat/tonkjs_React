import React, {Fragment, useState, useEffect} from 'react';
import Tone from 'tone';
import mapChords from '../../helpers/arpeggiator/mapChords';
import SynthChoices from '../../config/arpeggiator/SynthChoices';
import DurationChoices from '../../config/arpeggiator/DurationChoices';
import Select from '../../components/Select';
import Slider from '../../components/Slider';
import NavButton from '../../components/NavButton';
import './Arpeggiator.css';
import rewind from '../../assets/images/rewind.png';
import forward from '../../assets/images/forward.png';

export default function Arpeggiator() {
  const [synth, setSynth] = useState(new Tone.Synth());
  const [chordIndex, setChordIndex] = useState(-1);
  const [formattedChords] = useState(mapChords);
  const [playing, setPlaying] = useState(true);
  const [duration, setDuration] = useState('16n');
  const [synthChoices] = useState(SynthChoices);
  const [durationChoices] = useState(DurationChoices);
  const [eventID, setEventID] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [chorus, setChorus] = useState(0.0);
  const [gain, setGain] = useState(1.0);
  const [recDest] = useState(Tone.context.createMediaStreamDestination());
  const [recorder, setRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [order, setOrder] = useState('UP');

  let step = 0;

  useEffect(() => {
      startSynth();
  }, [chordIndex]);

  function handleChord(value) {
    setChordIndex(parseInt(value) - 1);
    getOrder(parseInt(value) - 1);
    stopSynth();
  }

  function repeat(time) {
    let chord = formattedChords[chordIndex];
    let note = chord[step % chord.length];
    synth.triggerAttackRelease(note, duration, time);
    step++;
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
        stopSynth();
    } else if (synth === 'DuoSynth') {
        setSynth(new Tone.DuoSynth());
        setPlaying(false);
        stopSynth();
    } else if (synth === 'FMSynth') {
        setSynth(new Tone.FMSynth());
        setPlaying(false);
        stopSynth();
    } else if (synth === 'MembraneSynth') {
        setSynth(new Tone.MembraneSynth());
        setPlaying(false);
        stopSynth();
    } else if (synth === 'PluckSynth') {
        setSynth(new Tone.PluckSynth());
        setPlaying(false);
        stopSynth();
    } else if (synth === 'PolySynth') {
        setSynth(new Tone.PolySynth());
        setPlaying(false);
        stopSynth();
    } else {
        setSynth(new Tone.Synth());
        setPlaying(false);
        stopSynth();
    }
  }

  function onDurationSelect(duration) {
    if(duration === '4n') {
        setDuration('4n');
        setPlaying(false);
        stopSynth();
    } else if (duration === '8n') {
        setDuration('8n');
        setPlaying(false);
        stopSynth();
    } else if (duration === '16n') {
        setDuration('16n');
        setPlaying(false);
        stopSynth();
    } else {
        setDuration('32n');
        setPlaying(false);
        stopSynth();
    }
  }

  function updateBPM(bpm) {
    setBpm(parseInt(bpm));
    Tone.Transport.bpm.value = bpm;
  }

  function updateChorus(chorus) {
    synth.disconnect();
    setChorus(parseFloat(chorus));
    const chor = new Tone.Chorus(1.5, 3.5, chorus).toMaster();
    synth.connect(chor);
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
        link.innerHTML = '&nbsp; DOWNLOAD &nbsp;';
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
    <NavButton name="back" link={"/select"} image={rewind} styleName={"back-button"}/>
    <NavButton name="forward" link={"/step_sequencer"} image={forward} styleName={"forward-button"} />
    <section className="arpeggiator-controls-container">
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
        <div className="arpeggiator-values-border">
          <div className="arpeggiator-values-container">
            <h3 className="arpeggiator-values">{bpm} <p className="arpeggiator-units">BPM</p></h3>
            <h3 className="arpeggiator-values">{order} <p className="arpeggiator-units">ORDER</p></h3>
            <h3 className="arpeggiator-values">{chorus} <p className="arpeggiator-units">Chorus</p></h3>
            <h3 className="arpeggiator-values">{gain} <p className="arpeggiator-units">Gain</p></h3>
          </div>
        </div>
        <div className="arpeggiator-sliders-container">
            <div className="arpeggiator-slider-value">
              <p>BPM</p>
            </div>
            <div className="arpeggiator-slider-container">
              <Slider styleName={"bpm-slider"} min={1} max={180} step={1} value={bpm} update={updateBPM} />
            </div>
            <div className="arpeggiator-slider-value">
              <p>CHOR</p>
            </div>
            <div className="arpeggiator-slider-container">
              <Slider styleName={"swing-slider"} min={0.0} max={1.0} step={0.1} value={chorus} update={updateChorus} />
            </div>
            <div className="arpeggiator-slider-value">
              <p>GAIN</p>
            </div>
            <div className="arpeggiator-slider-container">
              <Slider styleName={"gain-slider"} min={0.1} max={1.0} step={0.1} value={gain} update={updateGain} />
            </div>
          </div>
          <div className="arpeggiator-media-border">
            <div className="arpeggiator-media-controls-container">
              <div className="arpeggiator-sub-controls">
                <div>
                  <button className="arpeggiator" name="record" onClick={recordStart}></button>
                </div>
                <div>
                  <button className="arpeggiator" name="stop" onClick={stopMedia}></button>
                </div>
              </div>
            </div>
          </div>
        <Select styleName={"select"} choices={synthChoices} onSelect={onSynthSelect} name={"Synths"} />
        <Select styleName={"select"} choices={durationChoices} onSelect={onDurationSelect} name={"Rate"} />
    </section>
    </Fragment>
  )
}
