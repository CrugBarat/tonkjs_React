import stepSequencer from '../assets/images/step.png';
import drumMachine from '../assets/images/drum.png';
import arpeggiator from '../assets/images/arpeggy.png';

let imgs = {
    stepSequencer,
    drumMachine,
    arpeggiator
};

function getImage(key) {
    return imgs[key];
}

export default getImage;
