import React from "react";
import {
  Grid,
  TextField,
  Card,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import * as Colors from "./styles/colors";
import { getToken } from "./api";

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      domainId: "",
    };
  }

  login = () => {
    const { domainId } = this.state;
    if (domainId) {
      getToken(domainId).then(() => {
        this.props.history.push("home", { domainId });
      });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { domainId } = this.state;
    return (
      <>
        <AppBar style={styles.header} elevation={10}>
          <Toolbar>
            <Typography variant="h6">Chat App</Typography>
          </Toolbar>
        </AppBar>
        <Grid
          style={styles.grid}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Card style={styles.card} elevation={10}>
            <Grid item style={styles.gridItem}>
              <TextField
                name="domainId"
                required
                style={styles.textField}
                label="Domain ID"
                placeholder="Enter Domain ID"
                variant="outlined"
                type="domainId"
                value={domainId}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item style={styles.gridItem}>
              <Button
                color="primary"
                variant="contained"
                style={styles.button}
                onClick={this.login}
              >
                Login
              </Button>
            </Grid>
          </Card>
        </Grid>
      </>
    );
  }
}

const styles = {
  header: {
    background: Colors.PRIMARY,
  },
  grid: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: { padding: 40 },
  textField: { width: 300 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  button: { width: 300 },
};

export default WelcomeScreen;
