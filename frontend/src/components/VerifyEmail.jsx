import React, { useContext, useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

import { UserContext } from "../UserProvider";

import MessageCard from "./MessageCard";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function VerifyEmail() {
  const userContext = useContext(UserContext);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [level, setLevel] = useState("primary");

  const verifyEmail = async () => {
    try {
      let { token } = queryString.parse(location.search);
      const response = await axios.get(
        "/auth/verify-email?token=" + token.trim()
      );
      if (response && response.data) {
        if (response.data.message) {
          setMessage(response.data.message);
          setLevel("primary");
        }
      }
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        setMessage(error.response.data.message);
        setLevel("secondary");
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        setLevel("secondary");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        setLevel("secondary");
      }
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [location]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        {message ? (
          <MessageCard
            content={message}
            handleDelete={() => {
              setMessage(null);
            }}
            level={level}
          />
        ) : null}

        <br />
        <br />

        <Grid container justify="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
