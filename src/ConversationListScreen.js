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
import { Heading, Grid, Cell } from "amazon-chime-sdk-component-library-react";
import { useTheme } from "styled-components";
import "./index.css";

import { getToken, getUser } from "./api";
import { Conversations } from "@twilio/conversations/lib/data/conversations";
import ChannelsWrapper from "./containers/channels/ChannelsWrapper";
import Messages from "./containers/messages/Messages";
import Input from "./containers/input/Input";
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
  const currentTheme = useTheme();
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);

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

    client.on("tokenAboutToExpire", async () => {
      const token = await this.getToken(email);
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await this.getToken(email);
      client.updateToken(token);
    });

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

  // const navigate = (conversation) => {
  //   console.log(conversation.sid);
  //   props.history.push("chat", {
  //     room: conversation.sid,
  //     email,
  //     roomName: getShortConversationName2(conversation.friendlyName, user),
  //   });
  // };

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
    <Grid
      gridTemplateColumns="1fr 10fr"
      gridTemplateRows="3rem 101%"
      style={{ width: "100vw", height: "100vh" }}
      gridTemplateAreas='
        "heading heading"
        "side main"      
        '
    >
      <Cell gridArea="heading">
        {/* HEADING */}
        <Heading
          level={5}
          style={{
            backgroundColor: "#ee3a43",
            height: "3rem",
            paddingLeft: "1rem",
            color: "white",
          }}
          className="app-heading"
        >
          Chat App
          <div className="user-block">
            <a className="user-info" href="#">
              {email || "Unknown"}
            </a>

            <a href="#" onClick={() => {}}>
              Log out
            </a>
          </div>
        </Heading>
      </Cell>
      <Cell gridArea="side" style={{ height: "calc(100vh - 3rem)" }}>
        <div
          style={{
            backgroundColor: currentTheme.colors.greys.grey10,
            height: "100%",
            borderRight: `solid 1px ${currentTheme.colors.greys.grey30}`,
          }}
        >
          {/* SIDEPANEL CHANNELS LIST */}
          <ChannelsWrapper
            conversations={sortedConversations}
            user={user}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
          />
        </div>
      </Cell>
      <Cell gridArea="main" style={{ height: "calc(100vh - 3rem)" }}>
        {/* MAIN CHAT CONTENT WINDOW */}
        {activeConversation ? (
          <>
            <div className="messaging-container">
              <Messages activeConversation={activeConversation} user={user} />
              <Input
                style={{
                  borderTop: `solid 1px ${currentTheme.colors.greys.grey40}`,
                }}
                activeConversation={activeConversation}
                member={user}
              />
            </div>
          </>
        ) : (
          <div className="placeholder">Welcome</div>
        )}
      </Cell>
    </Grid>
  );
}
