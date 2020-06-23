export default function formatChords(chords) {
  let chord = chords.split(' ');
  let newChordArr = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < chord.length; j++) {
      let noteValue = chord[j].split('');
      let note = noteValue[0];
      let octave = (noteValue[1] === '0') ? i + 3 : i + 4;
      note += octave;
      newChordArr.push(note);
    }
  }
  return newChordArr;
}
