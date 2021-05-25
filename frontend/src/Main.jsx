import Header from "./components/Header";
import Footer from "./components/Footer";
import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
//import RestaurantList from "./components/RestaurantList";
import PrivateRoute from "./PrivateRoute";
import AuthRoute from "./AuthRoute";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import ApartmentForm from "./components/apartment/ApartmentForm";
import ApartmentList from "./components/apartment/ApartmentList";
import ApartmentView from "./components/apartment/ApartmentView";
import UserList from "./components/user/UserList";
//import RestaurantView from "./components/RestaurantView";
//import UserList from "./components/UserList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <Header></Header>
      </div>

      <Container>
        <Switch>
          <PrivateRoute
            component={ApartmentView}
            path="/apartments/:apartmentId"
          />
          <PrivateRoute component={ApartmentForm} path="/create-apartment" />
          <PrivateRoute component={UserList} path="/users/" />
          <PrivateRoute exact component={ApartmentList} path="/" />
        </Switch>
      </Container>

      <div className={classes.footer}>
        <Footer></Footer>
      </div>
    </div>
  );
}
