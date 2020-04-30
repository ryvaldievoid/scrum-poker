import React from 'react';
import { Route, BrowserRouter, Switch, } from 'react-router-dom';
import { Login, Lobby } from './containers';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/lobby" component={Lobby} />
    </Switch>
  </BrowserRouter>
);

export default Router;