
import React, { useContext } from "react";
import { UserContext } from "./UserProvider";
import { Redirect, Route, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const userContext = useContext(UserContext);
  const location = useLocation();
  

  return (
    <Route
      {...rest}
      render={(props) =>
        userContext.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login"/>
        )
      }
    />
  );
};

export default PrivateRoute;
