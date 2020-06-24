<img src="https://github.com/CrugBarat/my_files/blob/master/tonk/tonk1.png" width="300"> <img src="https://github.com/CrugBarat/my_files/blob/master/tonk/tonk2.png" width="300"> <img src="https://github.com/CrugBarat/my_files/blob/master/tonk/tonk3.png" width="300"> <img src="https://github.com/CrugBarat/my_files/blob/master/tonk/tonk4.png" width="300"> <img src="https://github.com/CrugBarat/my_files/blob/master/tonk/tonk5.png" width="300">


# TONK.js

A front-end music app built using:

**Programming Language**: JavaScript

**Front-end Web Framework**: React

**Library**: [Tone.js](https://tonejs.github.io/)

**Markup/Styling**: HTML5/CSS3

The desktop browser app has 3 instrument types: step sequencer, drum machine and arpeggiator. Each instrument uses a selection of pads that once triggered play a specific sound. Other features include:

- Effect manipulation
- Multiple synths/kit presets
- Record & download

This was a solo exercise, completed over 5 days. It was tasked to me by CodeClan, Glasgow, where I studied towards a PDA Level 8 in Professional Software Development.

---

# Instruments

**Step Sequencer**:

Sequences steps in a beat at varying speeds, octaves and with dynamic effects, such as bpm, phase, delay and gain. Once a a specific pad is selected, a note is triggered in sequence. The sequencer can load one of six synth types: AMSynth, DuoSynth, FMSynth, MembraneSynth, PluckSynth and PolySynth.

**Drum Machine**:

Imitates the sound of electronic drums using patterns over 4 bars. Each row corresponds to a different sound: kick, snare, tom and hat. The drum machine can dynamically change bpm, distortion, delay and gain. It can also load one of five kits: 808, Electro, Acoustic, Techno and FX.

**Arpeggiator**:

Cycles through a series of notes according to clock rate and note division. The rate, note order, bpm, chorus and gain can be changed dynamically. The arpeggiator can load one of seven synth types: AMSynth, DuoSynth, FMSynth, MembraneSynth, PluckSynth, PolySynth and default Synth.

**Each instrument can record and download the sound being created. The resulting file is in WMA format and can be played in certain audio players. Otherwise, it can be converted to .WAV, .MP3 etc using a media converter**

---

# Setup

- Download the files

- Navigate to project folder and run:

```
npm i
```
```
npm start
```

---

# Acknowledgements

Assets:

- [iconsdb](https://www.iconsdb.com/)
- [MusicRadar](https://www.musicradar.com/)

Special Thanks:

- CodeClan instructors: Ally, Anna, Colin & Jennifer
- Jake Albaugh for his excellent Tone.js tutorial
- Tone.js for a fantastic and easy to use framework with great docs
