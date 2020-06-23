import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from './views/Home';
import About from './views/About';
import SelectTonk from './views/SelectTonk';
import Arpeggiator from './containers/arpeggiator/Arpeggiator';
import DrumMachine from './containers/drum_machine/DrumMachine';
import StepSequencer from './containers/step_sequencer/StepSequencer';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/select">
          <SelectTonk />
        </Route>
        <Route path="/arpeggiator">
          <Arpeggiator />
        </Route>
        <Route path="/drum_machine">
          <DrumMachine />
        </Route>
        <Route path="/step_sequencer">
          <StepSequencer />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
