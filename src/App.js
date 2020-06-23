import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from './views/Home';
import About from './views/About';
import SelectWeapon from './views/SelectWeapon';
import Arpeggiator from './containers/arpeggiator/Arpeggiator';
import DrumMachine from './containers/drum_machine/DrumMachine';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/select">
          <SelectWeapon />
        </Route>
        <Route path="/arpeggiator">
          <Arpeggiator />
        </Route>
        <Route path="/drum_machine">
          <DrumMachine />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
