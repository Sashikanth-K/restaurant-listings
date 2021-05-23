import React from "react";
import Main from "./Main";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./PrivateRoute";
import AuthRoute from "./AuthRoute";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import RestaurantView from "./components/RestaurantView";
function App() {
  return (
    <div className="App">
      <Switch>
        <AuthRoute component={Login} path="/login" />
        <AuthRoute component={Register} path="/register" />
        <PrivateRoute component={Main} path="/" />
      </Switch>
    </div>
  );
}

export default App;
