import React from "react";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Send, Videocam, Phone } from "@material-ui/icons";
import axios from "axios";
import ChatItem from "./ChatItem";
import { v4 as uuidv4 } from "uuid";
const Chat = require("@twilio/conversations");

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      messages: [],
      loading: false,
      channel: null,
    };

    this.scrollDiv = React.createRef();
  }

  getToken = async (email) => {
    const response = await axios.get(
      `https://iqormobpushnotif-development.azurewebsites.net/api/twilio/token/${email}`
    );
    const { data } = response;
    console.log(data);
    return data.jwt;
  };

  componentDidMount = async () => {
    const { location } = this.props;
    const { state } = location || {};
    const { email, room } = state || {};
    let token = "";

    if (!email || !room) {
      this.props.history.replace("/");
    }

    this.setState({ loading: true });

    try {
      token = await this.getToken(email);
    } catch {
      throw new Error("unable to get token, please reload this page");
    }

    const client = await Chat.Client.create(token);

    client.on("tokenAboutToExpire", async () => {
      const token = await this.getToken(email);
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await this.getToken(email);
      client.updateToken(token);
    });

    // client.on("channelJoined", async (channel) => {
    //   // getting list of all messages since this is an existing channel
    //   const messages = await channel.getMessages();
    //   this.setState({ messages: messages.items || [] });
    //   this.scrollToBottom();
    // });

    try {
      const channel = await client.getConversationByUniqueName(room);
      await this.joinChannel(channel);
      this.setState({ channel, loading: false });
    } catch {
      // try {
      //   const channel = await client.createChannel({
      //     uniqueName: room,
      //     friendlyName: room,
      //   });
      //   await this.joinChannel(channel);
      //   this.setState({ channel, loading: false });
      // } catch {
      //   throw new Error("unable to create channel, please reload this page");
      // }
    }
  };

  joinChannel = async (channel) => {
    if (channel.channelState.status !== "joined") {
      await channel.join();
    }

    channel.getMessages().then((paginator) => {
      console.log(paginator.items);
      this.setState(
        {
          messages: paginator.items,
        },
        this.scrollToBottom
      );
    });
    channel.on("messageAdded", this.handleMessageAdded);
  };

  handleMessageAdded = (message) => {
    const { messages } = this.state;
    this.setState(
      {
        messages: !!messages ? [...messages, message] : [message],
      },
      this.scrollToBottom
    );
  };

  scrollToBottom = () => {
    const scrollHeight = this.scrollDiv.current.scrollHeight;
    const height = this.scrollDiv.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  sendMessage = () => {
    const { text, channel } = this.state;
    if (text && String(text).trim()) {
      this.setState({ loading: true });
      channel && channel.sendMessage(text, { giftedId: uuidv4() });
      this.setState({ text: "", loading: false });
    }
  };

  render() {
    const { loading, text, messages, channel } = this.state;
    const { location } = this.props;
    const { state } = location || {};
    const { email, room, roomName } = state || {};

    return (
      <Container component="main" maxWidth="md">
        <Backdrop open={loading} style={{ zIndex: 99999 }}>
          <CircularProgress style={{ color: "white" }} />
        </Backdrop>
        <AppBar elevation={10}>
          <Toolbar style={{ justifyContent: "space-between" }}>
            <Typography variant="h6">{`${roomName}`}</Typography>
            <div>
              <IconButton
                onClick={() => {
                  this.props.history.push("videocall", {
                    room,
                    email,
                    mode: "call",
                  });
                }}
              >
                <Phone style={styles.sendIcon} />
              </IconButton>
              <IconButton
                onClick={() => {
                  this.props.history.push("videocall", {
                    room,
                    email,
                    mode: "video",
                  });
                }}
              >
                <Videocam style={styles.sendIcon} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <CssBaseline />
        <Grid container direction="column" style={styles.mainGrid}>
          <Grid item style={styles.gridItemChatList} ref={this.scrollDiv}>
            <List dense={true}>
              {messages &&
                messages.map((message) => (
                  <ChatItem
                    key={message.index}
                    message={message}
                    email={email}
                  />
                ))}
            </List>
          </Grid>
          <Grid item style={styles.gridItemMessage}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item style={styles.textFieldContainer}>
                <TextField
                  required
                  style={styles.textField}
                  placeholder="Enter message"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={text}
                  disabled={!channel}
                  onChange={(event) =>
                    this.setState({ text: event.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <IconButton
                  style={styles.sendButton}
                  onClick={this.sendMessage}
                  disabled={!channel || !text}
                >
                  <Send style={styles.sendIcon} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

const styles = {
  textField: { width: "100%", borderWidth: 0, borderColor: "transparent" },
  textFieldContainer: { flex: 1, marginRight: 12 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  gridItemChatList: { overflow: "auto", height: "70vh" },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  sendButton: { backgroundColor: "#3f51b5" },
  sendIcon: { color: "white" },
  mainGrid: { paddingTop: 100, borderWidth: 1 },
};

export default ChatScreen;
