import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Game from './Game';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/play/:id">
        <Game />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
