import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Home from './views/Home';
import About from './views/About';
import SelectWeapon from './views/SelectWeapon';
import Arpeggiator from './containers/Arpeggiator';
import './App.css';

function App() {
  return (
    <Router>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/select">Select Weapon</Link>
      <Link to="/arpeggiator">Arpeggiator</Link>

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
