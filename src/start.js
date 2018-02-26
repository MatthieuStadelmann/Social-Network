import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, Redirect } from 'react-router';
import { Welcome } from './welcome';
import { App } from './App';
import Register from './register';
import Login from './login';
import { Profile } from './Profile';
import { Otherprofiles } from './Otherprofiles';
import { FriendsStatus } from './FriendsStatus';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';
import Friends from './Friends';
import Online from './online';
import Chat from './Chat';
import * as io from 'socket.io-client';

let router;

//First router notLoggedIn======================================================
const notLoggedInRouter = (<Router history={hashHistory}>
  <Route path="/" component={Welcome}>
    <Route path="/login" component={Login}/>
    <IndexRoute component={Register}/>
  </Route>
</Router>);
//Second router LogedIn=========================================================
export const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

const LogedInRouter = (<Provider store={store}>
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/users/:userid" component={Otherprofiles}/>
      <Route path="/friends/" component={Friends}/>
      <Route path="/online/" component={Online}/>
      <Route path="/chat/" component={Chat}/>
      <IndexRoute component={Profile}/>
      <Redirect from="*" to='/'/>
    </Route>
  </Router>
</Provider>);
// Which router we're gonna use=================================================
if (location.pathname === '/welcome/') {
  router = notLoggedInRouter
} else {
  router = LogedInRouter
}
console.log("router", router == LogedInRouter)

ReactDOM.render(router, document.querySelector('main'));
