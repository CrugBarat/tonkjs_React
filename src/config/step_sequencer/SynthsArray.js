import Tone from 'tone';

const SynthsArray = [
                      new Tone.PolySynth(),
                      new Tone.AMSynth(),
                      new Tone.DuoSynth(),
                      new Tone.FMSynth(),
                      new Tone.MembraneSynth(),
                      new Tone.MonoSynth(),
                      new Tone.PluckSynth()
                    ]

export default SynthsArray;
