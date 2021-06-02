import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  Card,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  FormControlLabel,
  Avatar,
  Checkbox,
  Link,
  Box,
  CssBaseline,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { LockOutlined as LockOutlinedIcon } from "@material-ui/icons";
import { SiMicrosoftazure } from "react-icons/si";
import * as Colors from "../styles/colors";

import { getToken } from "../api";
import { useMsal } from "@azure/msal-react";
import { useHistory } from "react-router-dom";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";

import { deviceDetect } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";
import { getUser, searchContacts, signIn } from "../api";

import { useAuthContext } from "../providers/AuthProvider";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    width: 300,
  },
  header: {
    background: Colors.PRIMARY,
  },
  grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: { padding: 40 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
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
  appBarSpacer: theme.mixins.toolbar,
}));

const SignInScreen = () => {
  const classes = useStyles();
  const { userSignIn } = useAuthContext();

  const [loading, setLoading] = useState(false);
  // const [domainId, setDomainId] = useState("");
  // const [password, setPassword] = useState("");

  // const handleIdChange = (event) => {
  //   setDomainId(event.target.value);
  // };

  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   setLoading(true);
  //   alert("A name was submitted: " + domainId + password);

  //   if (domainId && password === "testpassword") {
  //   }

  //   setLoading(false);
  // };

  const loginPopup = () => {
    setLoading(true);
    userSignIn();
    setLoading(false);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 99999 }}>
        <CircularProgress style={{ color: "white" }} />
      </Backdrop>
      <AppBar className={classes.header} elevation={10}>
        <Toolbar>
          <Typography variant="h6">Chat App</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.appBarSpacer} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submit}
            endIcon={<SiMicrosoftazure />}
            onClick={loginPopup}
          >
            Sign in with Azure
          </Button>

          {/* <Typography component="h1" variant="h6">
            or
          </Typography>

          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="domainId"
              label="Domain ID"
              name="domainId"
              autoComplete="domainId"
              autoFocus
              value={domainId}
              onChange={handleIdChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> 
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
             <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> 
          </form> */}
        </div>
      </Container>
    </>
  );
};

export default SignInScreen;
