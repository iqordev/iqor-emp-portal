import React, { useState, useEffect, useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
// import { TabPanel,TabContext   } from "@matereial-ui/lab";
import {
  Tabs,
  Tab,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  Avatar,
  Grid,
  Container,
} from "@material-ui/core";
import {
  ChatBubbleRounded,
  PeopleRounded,
  Inbox,
  Mail,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "@material-ui/icons";

import { useTheme } from "styled-components";
import "./index.css";

import { getToken, getUser } from "./api";
import ChannelsWrapper from "./containers/channels/ChannelsWrapper";
import Messages from "./containers/messages/Messages";
import Input from "./containers/input/Input";
import ContactsWrapper from "./containers/contacts/ContactsWrapper";
import { DRAWER_TABS } from "./constants/DrawerTabs";
const Chat = require("@twilio/conversations");

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    padding: 0,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,
}));

export default function ConversationListScreen(props) {
  const theme = useTheme();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);

  const [tab, setTab] = React.useState(DRAWER_TABS.CHATS);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { location } = props;
  const { state } = location || {};
  const { domainId, conversationId } = state || {};
  let token = "";

  const initialize = async () => {
    try {
      token = await getToken(domainId);
      const currentUser = await getUser();
      setUser(currentUser);
      console.log(currentUser);
    } catch {
      throw new Error("unable to get token, please reload this page");
    }

    const client = await Chat.Client.create(token);

    client.on("tokenAboutToExpire", async () => {
      const token = await getToken(domainId);
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await getToken(domainId);
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
  //     conversationId: conversation.sid,
  //     domainId,
  //     friendlyName: getShortConversationName2(conversation.friendlyName, user),
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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            Chat App
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => setTab(DRAWER_TABS.CHATS)}
            selected={tab === DRAWER_TABS.CHATS}
          >
            <ListItemIcon>
              <ChatBubbleRounded />
            </ListItemIcon>
            <ListItemText primary={DRAWER_TABS.CHATS} />
          </ListItem>
          <ListItem
            button
            onClick={() => setTab(DRAWER_TABS.CONTACTS)}
            selected={tab === DRAWER_TABS.CONTACTS}
          >
            <ListItemIcon>
              <PeopleRounded />
            </ListItemIcon>
            <ListItemText primary={DRAWER_TABS.CONTACTS} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          {tab === DRAWER_TABS.CHATS ? (
            <Grid container direction="row">
              <Grid
                item
                style={{
                  overflow: "auto",
                  height: "70vh",
                }}
              >
                {/* SIDEPANEL CHANNELS LIST */}
                <ChannelsWrapper
                  conversations={sortedConversations}
                  user={user}
                  activeConversation={activeConversation}
                  setActiveConversation={setActiveConversation}
                />
              </Grid>
              <Grid item xs>
                {/* MAIN CHAT CONTENT WINDOW */}
                {activeConversation ? (
                  <Grid container direction="column" style={{ borderWidth: 1 }}>
                    <Grid item style={{ overflow: "auto", height: "70vh" }}>
                      <>
                        <div className="messaging-container">
                          <Messages
                            activeConversation={activeConversation}
                            user={user}
                          />
                        </div>
                      </>
                    </Grid>
                    <Grid item style={{}}>
                      <Input
                        style={{
                          borderTop: `solid 1px ${theme.colors.greys.grey40}`,
                        }}
                        activeConversation={activeConversation}
                        member={user}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <div className="placeholder">Welcome</div>
                )}
              </Grid>
            </Grid>
          ) : (
            <ContactsWrapper
              user={user}
              setActiveConversation={setActiveConversation}
            />
          )}
        </Container>
      </main>
    </div>
  );
}
