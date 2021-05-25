import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            {/* <RestaurantIcon className={classes.icon} /> */}
            <Typography
              variant="h6"
              color="inherit"
              className={classes.title}
              noWrap
            >
              Rentzz
            </Typography>
          </Button>

          {userContext.isAuthenticated && userContext.userInfo ? (
            <React.Fragment>
              <Button
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                {userContext.userInfo.name}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>{userContext.userInfo.role}</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>

                {userContext.userInfo &&
                userContext.userInfo.role == "admin" ? (
                  <MenuItem component={RouterLink} color="inherit" to="/users">
                    Users List
                  </MenuItem>
                ) : null}

                {userContext.userInfo &&
                (userContext.userInfo.role == "admin" ||
                  userContext.userInfo.role == "realtor") ? (
                  <MenuItem
                    component={RouterLink}
                    color="inherit"
                    to="/create-apartment"
                  >
                    Create Apartment
                  </MenuItem>
                ) : null}
                <MenuItem
                  onClick={() => {
                    userContext.deleteDataInLocalStorage();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
}
