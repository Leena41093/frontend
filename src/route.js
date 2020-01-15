import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";

import { App } from './components/app';
import Login from './components/auth/login';
import Invitation from '../src/components/common/invitation';
import ForgotPassword from './components/auth/forgotPassword';
import CreateNewPassword from './components/auth/createNewPassword';
const Routes = () => (

	  <BrowserRouter  basename={'/'}>
      <div>
        <Route exact path="/invitation" component={Invitation} />
        <Route exact path="/" component={Login} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/newpassword" component={CreateNewPassword} />
        <Route path="/app" component={App} />
      </div>
    </BrowserRouter>
)

export default Routes
