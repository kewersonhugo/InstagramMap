import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ModalContainer, ModalRoute } from 'react-router-modal';
import 'react-router-modal/css/react-router-modal.css';
import App from './components/App';
import User from './components/User';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <ModalRoute path="/:user_id/:lat/:lng" component={User} parentPath="/" />
      <ModalContainer />
    </Switch>
  </Router>,
  document.getElementById('root'),
);
