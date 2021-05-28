import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Paper,
  TextField,
} from "@material-ui/core";
import {
  ChatBubbleRounded,
  PeopleRounded,
  Inbox,
  Mail,
  Menu,
  ChevronLeft,
  ChevronRight,
  BorderColorRounded,
} from "@material-ui/icons";

import { useTheme } from "styled-components";
import "./index.css";

import { getToken, getUser, searchContacts } from "./api";
import ChannelsWrapper from "./containers/channels/ChannelsWrapper";
import Messages from "./containers/messages/Messages";
import Input from "./containers/input/Input";
import ContactsWrapper from "./containers/contacts/ContactsWrapper";
import { DRAWER_TABS } from "./constants/DrawerTabs";
import { getUniqueName } from "./utils/chatConversationHelper";
import { convertName } from "./utils/nameHelper";
import Title from "./components/Title";
import * as Colors from "./styles/colors";
import { useNotificationDispatch } from "amazon-chime-sdk-component-library-react";

const Chat = require("@twilio/conversations");

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    background: Colors.PRIMARY,
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
    background: Colors.PRIMARY,
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
  mainGrid: {
    paddingBottom: theme.spacing(2),
  },
  appBarSpacer: theme.mixins.toolbar,
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  chatHeader: {
    paddingBottom: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function ConversationListScreen(props) {
  const theme = useTheme();
  const notificationDispatch = useNotificationDispatch();
  const classes = useStyles();
  const clienRef = useRef();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);

  const [isComposing, setIsComposing] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [composeUniqueName, setComposeUniqueName] = useState("");
  const [composeSelectedContacts, setComposeSelectedContacts] = useState([]);

  const [tab, setTab] = React.useState(DRAWER_TABS.CHATS);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { location } = props;
  const { state } = location || {};
  const { domainId } = state || {};
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
    clienRef.current = client;

    clienRef.current.on("tokenAboutToExpire", async () => {
      const token = await getToken(domainId);
      client.updateToken(token);
    });

    clienRef.current.on("tokenExpired", async () => {
      const token = await getToken(domainId);
      client.updateToken(token);
    });

    clienRef.current.on("conversationAdded", (conversation) => {
      if (conversation.lastMessage) {
        // TwilioService.getInstance()
        //   .parseConversationAsync(conversation)
        //   .then((newConversation) => addConversation(newConversation));
      } else {
        setConversations((oldConversation) => [
          ...oldConversation,
          conversation,
        ]);
      }
    });

    clienRef.current
      .getSubscribedConversations()
      .then((paginator) => {
        console.log(paginator.items);
        const newConversations = paginator.items.reverse();
        setConversations(newConversations);
        setActiveConversation(newConversations[0]);
      })
      .finally(setLoading(false));
  };

  const fetchContacts = async () => {
    const contacts = await searchContacts("");
    console.log("contacts", contacts);
    setContacts(contacts);
  };

  useEffect(() => {
    initialize();
    fetchContacts();
  }, []);

  const onTapContactChat = (contact) => {
    const MAX_PARTICIPANT_P2P = 2;
    const uniqueName = getUniqueName([contact.domainId], user.domainId);
    const friendlyName = `${convertName(user)}|${convertName(contact)}`;
    console.log(uniqueName, friendlyName);
    const conversation = {
      uniqueName: uniqueName,
      friendlyName: friendlyName,
      attributes: {
        members: [
          {
            domainId: contact.domainId,
            name: convertName(contact),
            email: contact.email,
          },
          {
            domainId: user.domainId,
            name: convertName(user),
            email: user.email,
          },
        ],
        memberCount: MAX_PARTICIPANT_P2P,
        isGroupChat: false,
        isFriendlyNameUpdated: false,
      },
    };

    clienRef.current
      .getConversationByUniqueName(uniqueName)
      .then((conversation) => {
        setActiveConversation(conversation);
        setTab(DRAWER_TABS.CHATS);
      })
      .catch(() => {
        clienRef.current
          .createConversation(conversation)
          .then(async (conversation) => {
            await conversation.join();
            await conversation.add(contact.domainId, {
              name: convertName(contact),
              email: contact.email,
            });
            setActiveConversation(conversation);
            setTab(DRAWER_TABS.CHATS);
          });
      });
  };

  const onTapConversation = (conversation) => {
    setActiveConversation(conversation);
    setIsComposing(false);
  };

  const onRecipientChange = (uniqueName, tags) => {
    setComposeUniqueName(uniqueName);
    console.log(uniqueName, tags, contacts);
    const selectedContacts = contacts.filter((item) =>
      tags.includes(item.domainId)
    );
    console.log(selectedContacts);

    setComposeSelectedContacts(
      selectedContacts.map((contact) => ({
        domainId: contact.domainId,
        name: convertName(contact),
        email: contact.email,
      }))
    );
  };

  const onInputFocus = () => {
    if (!isComposing || !composeUniqueName) return;

    clienRef.current
      .getConversationByUniqueName(composeUniqueName)
      .then((conversation) => {
        // console.log(conversation);
        setActiveConversation(conversation);
        setIsComposing(false);
        setComposeUniqueName("");
      })
      .catch((err) => console.error(err));
  };

  const onSubmitIsComposing = () => {
    return new Promise(function (res, rej) {
      if (!composeUniqueName) {
        notificationDispatch({
          type: 0,
          payload: {
            message: `You need to add at least one more person to start a chat.`,
            severity: "error",
          },
        });
        rej(new Error("Invalid recipient"));
      }

      const selectConversation = (conversation) => {
        setActiveConversation(conversation);
        setIsComposing(false);
        setComposeUniqueName("");
        setComposeSelectedContacts([]);
      };

      const CURRENT_USER_COUNT = 1;
      const friendlyName = `${convertName(user)}|${
        composeSelectedContacts[0].name
      }${
        composeSelectedContacts.length > 1
          ? `| + ${composeSelectedContacts.length} others`
          : ""
      }`;

      const conversation = {
        uniqueName: composeUniqueName,
        friendlyName: friendlyName,
        attributes: {
          members: [
            ...composeSelectedContacts,
            {
              domainId: user.domainId,
              name: convertName(user),
              email: user.email,
            },
          ],
          memberCount: composeSelectedContacts.length + CURRENT_USER_COUNT,
          isGroupChat: false,
          isFriendlyNameUpdated: false,
        },
      };

      clienRef.current
        .getConversationByUniqueName(composeUniqueName)
        .then((conversation) => {
          selectConversation(conversation);
          return res(conversation);
        })
        .catch(() => {
          clienRef.current
            .createConversation(conversation)
            .then(async (conversation) => {
              await conversation.join();
              composeSelectedContacts.forEach(async (tag) => {
                await conversation.add(tag.domainId, {
                  name: tag.name,
                  email: tag.email,
                });
              });
              selectConversation(conversation);
              return res(conversation);
            });
        });
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
            <Paper className={classes.paper}>
              <Grid container direction="row" className={classes.mainGrid}>
                <Grid
                  item
                  xs={2}
                  style={{
                    overflow: "auto",
                    height: "75vh",
                  }}
                >
                  <Grid container justify="space-between">
                    <Grid item>
                      <Typography
                        component="h2"
                        variant="h6"
                        color="primary"
                        className={classes.chatHeader}
                      >
                        Chats
                      </Typography>
                    </Grid>
                    <Grid item>
                      <div className={classes.chatHeader}>
                        <IconButton
                          onClick={() => {
                            setIsComposing(true);
                            setActiveConversation(null);
                          }}
                        >
                          <BorderColorRounded fontSize="small" />
                        </IconButton>
                      </div>
                    </Grid>
                  </Grid>
                  {/* SIDEPANEL CHANNELS LIST */}
                  <ChannelsWrapper
                    conversations={sortedConversations}
                    user={user}
                    activeConversation={activeConversation}
                    onTapConversation={onTapConversation}
                    isComposing={isComposing}
                  />
                </Grid>
                <Grid item xs={10}>
                  {/* MAIN CHAT CONTENT WINDOW */}
                  {activeConversation || isComposing ? (
                    <Grid
                      container
                      direction="column"
                      style={{ borderWidth: 1 }}
                    >
                      <Grid
                        item
                        style={{
                          overflow: "auto",
                          height: "75vh",
                        }}
                      >
                        <>
                          <div className="messaging-container">
                            <Messages
                              clientRef={clienRef}
                              activeConversation={activeConversation}
                              user={user}
                              contacts={contacts}
                              isComposing={isComposing}
                              onRecipientChange={onRecipientChange}
                            />
                          </div>
                        </>
                      </Grid>
                      <Grid item>
                        <Input
                          activeConversation={activeConversation}
                          onFocus={onInputFocus}
                          isComposing={isComposing}
                          onSubmitIsComposing={onSubmitIsComposing}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <div className="placeholder">Welcome</div>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <ContactsWrapper
              user={user}
              contacts={contacts}
              setActiveConversation={setActiveConversation}
              onTapContactChat={onTapContactChat}
            />
          )}
        </Container>
      </main>
    </div>
  );
}
