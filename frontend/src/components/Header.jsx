import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


import RestaurantIcon from "@material-ui/icons/Restaurant";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { UserContext } from "../UserProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));

export default function Header() {
  const classes = useStyles();
  const userContext = useContext(UserContext);

  return (
    <div className={classes.root}>
      <AppBar position="relative">
        <Toolbar>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            className={classes.title}
          >
            <RestaurantIcon className={classes.icon} />
            <Typography
              variant="h6"
              color="inherit"
              className={classes.title}
              noWrap
            >
              Restaurants
            </Typography>
          </Button>

          

          {userContext.userInfo ? (
            <Typography
              variant="h6"
              color="inherit"
              className={classes.title}
              noWrap
            >
              {userContext.userInfo.name}
            </Typography>
          ) : null}

{userContext.userInfo && userContext.userInfo.role == "admin" ? (
            <Button component={RouterLink} color="inherit" to="/users">
              userList
            </Button>
          ) : null}

          {!userContext.isAuthenticated ? (
            <ButtonGroup color="inherit" aria-label="text primary button group">
              <Button component={RouterLink} to="/login">
                Login
              </Button>
              <Button component={RouterLink} to="/register">
                Register
              </Button>
            </ButtonGroup>
          ) : (
            <Button
              color="inherit"
              onClick={() => {
                userContext.deleteDataInLocalStorage();
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
