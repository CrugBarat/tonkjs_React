import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from './views/Home';
import About from './views/About';
import SelectWeapon from './views/SelectWeapon';
import Arpeggiator from './containers/Arpeggiator';
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
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
