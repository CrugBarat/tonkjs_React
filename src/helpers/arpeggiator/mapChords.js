import formatChords from './formatChords';
import ChordArray from '../config/arpeggiator/ChordArray';

export default function mapChords() {
  return ChordArray.map( chords => formatChords(chords));
}
