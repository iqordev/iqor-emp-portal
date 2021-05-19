import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Toolbar,
} from "@material-ui/core";
import { getToken } from "./api";
import { Conversations } from "@twilio/conversations/lib/data/conversations";
const Chat = require("@twilio/conversations");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginTop: 100,
  },
  inline: {
    display: "inline",
  },
}));

export default function ConversationListScreen(props) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  const classes = useStyles();

  const { location } = props;
  const { state } = location || {};
  const { email, room } = state || {};
  let token = "";

  const initialize = async () => {
    try {
      token = await getToken(email);
    } catch {
      throw new Error("unable to get token, please reload this page");
    }

    const client = await Chat.Client.create(token);
    client
      .getSubscribedConversations()
      .then((paginator) => {
        console.log(paginator.items);
        setConversations(paginator.items.reverse());
      })
      .finally(setLoading(false));
  };

  useEffect(() => {
    initialize();
  }, []);

  const navigate = (conversation) => {
    console.log(conversation.sid);
    props.history.push("chat", { room: conversation.sid, email });
  };

  return (
    <Container component="main" maxWidth="md">
      <Backdrop open={loading} style={{ zIndex: 99999 }}>
        <CircularProgress style={{ color: "white" }} />
      </Backdrop>
      <AppBar elevation={10}>
        <Toolbar>
          <Typography variant="h6">Chats</Typography>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      <List className={classes.root}>
        {conversations.map((conversation) => (
          <ListItem
            key={conversation.sid}
            alignItems="flex-start"
            onClick={() => navigate(conversation)}
          >
            <ListItemAvatar>
              <Avatar
                alt="Remy Sharp"
                src="https://picsum.photos/seed/picsum/200/300"
              />
            </ListItemAvatar>
            <ListItemText
              primary={conversation.friendlyName}
              //   secondary={
              //     <React.Fragment>
              //       <Typography
              //         component="span"
              //         variant="body2"
              //         className={classes.inline}
              //         color="textPrimary"
              //       >
              //         Ali Connors
              //       </Typography>
              //       {" — I'll be in your neighborhood doing errands this…"}
              //     </React.Fragment>
              //   }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
