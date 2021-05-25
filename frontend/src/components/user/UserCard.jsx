import { Grid } from "@material-ui/core";
import React, { Component, useState, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";
import { UserContext } from "../../UserProvider";
import Button from "@material-ui/core/Button";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import userEvent from "@testing-library/user-event";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  icon: {
    marginLeft: theme.spacing(1),
  },
  link: {
    textDecoration: "none",
  },
}));

const UserCard = (props) => {
  const classes = useStyles();
  const { restaurantId } = useParams();
  const userContext = useContext(UserContext);

  const [rating, setRating] = useState(props.data.rating);

  const [ownerReply, setownerReply] = useState("");

  const handleDeleteUser = async () => {
    try {
      let data = await axios.delete(`/users/${props.data.id}`);

      props.getUsers();
    } catch (error) {
      props.getUsers();
    }
  };

  return (
    <Paper className={classes.root} elevation={0}>
      <Grid container spacing={0} justify="space-between" alignItems="center">
        <Grid item xs={10}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              {<props className="data by"></props> ? (
                <Typography variant="caption" color="textSecondary">
                  {props.data.email}
                </Typography>
              ) : null}
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-between"
                spacing={1}
              >
                <Grid item>
                  <Typography variant="h6" color="textSecondary">
                    {props.data.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Typography variant="subtitle1" color="textSecondary">
                      {props.data.role}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {userContext.userInfo.role == "admin" ? (
          <Grid item>
            <Grid container direction="column">
              <Button onClick={handleDeleteUser}>Edit</Button>
              <Button onClick={handleDeleteUser}>delete</Button>
            </Grid>
          </Grid>
        ) : null}
      </Grid>
    </Paper>
  );
};

export default UserCard;
