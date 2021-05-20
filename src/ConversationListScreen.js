import React, { useState, useEffect, useMemo } from "react";
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
import { getToken, getUser } from "./api";
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
  const [user, setUser] = useState(null);

  const classes = useStyles();

  const { location } = props;
  const { state } = location || {};
  const { email, room } = state || {};
  let token = "";

  const initialize = async () => {
    try {
      token = await getToken(email);
      const currentUser = await getUser();
      setUser(currentUser);
      console.log(currentUser);
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

  const getShortConversationName2 = (friendlyName, user) => {
    const conversationName = friendlyName.split("|");
    const is1v1Conversation = conversationName.length === 2;
    const currentUser = `${user.lastName}, ${user.firstName}`;
    const [firstUser, secondUser, otherText] = conversationName;

    const displayedUser = firstUser === currentUser ? secondUser : firstUser;
    const groupTitle = `${displayedUser} ${otherText ?? ""}`;

    return is1v1Conversation ? displayedUser : groupTitle;
  };

  useEffect(() => {
    initialize();
  }, []);

  const navigate = (conversation) => {
    console.log(conversation.sid);
    props.history.push("chat", {
      room: conversation.sid,
      email,
      roomName: getShortConversationName2(conversation.friendlyName, user),
    });
  };

  const sortedConversations = useMemo(() => {
    const sortedResult =
      conversations.length > 0
        ? conversations.sort((conversationA, conversationB) => {
            const cbLastMessageTime =
              conversationB.lastMessage?.dateCreated ??
              conversationB.dateUpdated ??
              conversationB.dateCreated;

            const cALastMessageTime =
              conversationA.lastMessage?.dateCreated ??
              conversationA.dateUpdated ??
              conversationA.dateCreated;

            return cbLastMessageTime - cALastMessageTime;
          })
        : conversations;

    return sortedResult;
  }, [conversations]);

  // const getLastMessage = (conversation) => {
  //   conversation.getMessages(1).then((message) => console.log(message));
  // };

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
        {sortedConversations.map((conversation) => (
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
              primary={getShortConversationName2(
                conversation.friendlyName,
                user
              )}
              // secondary={
              //   <React.Fragment>
              //     <Typography
              //       component="span"
              //       variant="body2"
              //       className={classes.inline}
              //       color="textPrimary"
              //     >
              //       Ali Connors
              //     </Typography>
              //     {getLastMessage(conversation)}
              //     {/* {" — I'll be in your neighborhood doing errands this…"} */}
              //   </React.Fragment>
              // }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
