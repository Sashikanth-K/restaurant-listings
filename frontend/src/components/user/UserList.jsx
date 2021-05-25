import { Grid } from "@material-ui/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { UserContext } from "../../UserProvider";
import { FormControlLabel, Radio } from "@material-ui/core";
import axios from "axios";

import Button from "@material-ui/core/Button";
import { RadioGroup } from "formik-material-ui";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { TextField as MuTextField } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import UserCard from "./UserCard";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  accor: {
    zIndex: 0,
  },
}));

function UserCardSkelton() {
  return [...Array(10)].map((_, i) => {
    return (
      <div>
        <Skeleton variant="text" />
        <Skeleton variant="text" width={120} height={80} />
        <Skeleton variant="text" width={190} height={50} />
      </div>
    );
  });
}

const UserList = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const [userList, setUserList] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const getUsers = async () => {
    try {
      const params = {};

      let x = name ? (params["name"] = name) : null;
      let y = role ? (params["role"] = role) : null;
      let z = email ? (params["email"] = email) : null;

      setIsLoading(true);
      let data = await axios.get("/users", {
        params: params,
        headers: { "Content-type": "application/json" },
        withCredentials: true,
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000 * 1);
      if (data && data.data && data.data.results) {
        setUserList(data.data.results);
        setTotalResults(data.data.totalResults);
        setPage(data.data.page);
        setTotalPages(data.data.totalPages);
      } else {
        setErrorMessage(data.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const onChange = (e, page) => {
    setPage(page);
    getUsers({ page });
  };

  useEffect(() => {
    if (userContext.userInfo) {
      getUsers();
    }
  }, [userContext]);

  return (
    <div className={classes.root}>
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill the below form to create a new User
          </DialogContentText>

          <Formik
            initialValues={{
              email: "",
              password: "",
              name: "",
              role: "admin",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Required";
              } else if (
                !(
                  values.password.match(/[a-z]/g) &&
                  values.password.match(/[A-Z]/g) &&
                  values.password.match(/[0-9]/g) &&
                  values.password.match(/[^a-zA-Z\d]/g) &&
                  values.password.length >= 8
                )
              ) {
                errors.password =
                  "Password must be minimum length 8. One uppercase, One lowercase, One digit.";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              let user = await axios.post("/auth/register", values);
              //   if (user && user.data) {
              //     //userContext.setDataInLocalStorage(user.data);
              //     //history.push("/");
              //     getUsers();
              //   }
              setIsDialogOpen(false);
              getUsers();
              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  component={TextField}
                  name="name"
                  //type="name"
                  fullWidth
                  label="Name"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="2344214"
                  component={TextField}
                  name="email"
                  type="email"
                  fullWidth
                  label="Email"
                  variant="outlined"
                />
                <br />
                <br />
                <Field
                  key="293852"
                  component={TextField}
                  type="password"
                  label="Password"
                  fullWidth
                  name="password"
                  variant="outlined"
                />
                <br />
                <br />
                <Field component={RadioGroup} name="role">
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    component="p"
                  >
                    Register as :
                  </Typography>
                  <FormControlLabel
                    value="admin"
                    control={<Radio disabled={isSubmitting} />}
                    label="Admin"
                    disabled={isSubmitting}
                  />
                  <FormControlLabel
                    value="realtor"
                    control={<Radio disabled={isSubmitting} />}
                    label="Realtor"
                    disabled={isSubmitting}
                  />
                  <FormControlLabel
                    value="user"
                    control={<Radio disabled={isSubmitting} />}
                    label="User"
                    disabled={isSubmitting}
                  />
                </Field>

                <br />
                {isSubmitting && <LinearProgress />}
                <br />
                <br />

                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                  fullWidth
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
            }}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container direction="column" spacing={2}>
        {userContext.userInfo && userContext.userInfo.role == "admin" ? (
          <Grid item>
            <Grid container spacing={1}>
              <Button
                disabled={isDialogOpen}
                color="primary"
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                Create new user
              </Button>
            </Grid>
          </Grid>
        ) : null}

        <Grid item>
          <Accordion
            classes={classes.accor}
            // expanded={expanded === "panel4"}
            // onChange={handleChange("panel4")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography className={classes.heading}>Filters :- </Typography>
              <Typography className={classes.secondaryHeading}>
                Search by User, Email, Role
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justify="space-between">
                <Grid item>
                  <MuTextField
                    id="filled-basic"
                    label="Name"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item>
                  <MuTextField
                    id="filled-basic"
                    label="Email"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item>
                  <MuTextField
                    id="filled-basic"
                    label="Role"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      setRole(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    //disabled={isDialogOpen}
                    disableElevation
                    color="primary"
                    onClick={() => {
                      getUsers();
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item>
          <Grid container justify="flex-end" spacing={2} alignItems="baseline">
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                {(page - 1) * 20 + 1} - {page * 20} of {totalResults}
              </Typography>
            </Grid>
            <Grid item>
              <Pagination
                page={page}
                count={totalPages}
                onChange={onChange}
                size="small"
                boundaryCount={2}
                shape="rounded"
                color="primary"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column" spacing={0}>
            {isLoading ? (
              <UserCardSkelton></UserCardSkelton>
            ) : (
              <React.Fragment>
                {userList.map((item) => {
                  return (
                    <React.Fragment>
                      {userContext.userInfo &&
                      userContext.userInfo.id != item.id ? (
                        <Grid item key={item.id}>
                          <UserCard data={item} getUsers={getUsers} />
                        </Grid>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserList;
