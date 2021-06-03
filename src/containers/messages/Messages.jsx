import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  InfiniteList,
  ChatBubble,
  ChatBubbleContainer,
  formatTime,
} from "amazon-chime-sdk-component-library-react";

import {
  IconButton,
  Avatar,
  Grid,
  Typography,
  makeStyles,
  TextField,
  Popover,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Videocam, Phone, People } from "@material-ui/icons";
import { useHistory } from "react-router";

import "./Messages.css";
import { getShortConversationName } from "../../utils/simplifyConversationName";
import AttachmentProcessor from "./AttachmentProcessor";
import { getAttendeeImage } from "../../utils/ImageHelper";
import { getUniqueName } from "../../utils/chatConversationHelper";
import { useContactContext } from "../../providers/ContactsProvider";
import { useAuthContext } from "../../providers/AuthProvider";

const useStyles = makeStyles((theme) => ({
  conversationName: {
    padding: theme.spacing(2),
  },
  grid: {
    borderBottom: "1px solid grey",
  },
  options: {
    padding: theme.spacing(1),
  },
  to: {
    padding: theme.spacing(1),
    borderBottom: "1px solid grey",
  },
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const Messages = ({
  clientRef,
  activeConversation,
  isComposing,
  onRecipientChange,
}) => {
  const history = useHistory();
  const classes = useStyles();

  const { contacts } = useContactContext();
  const { user } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleMessageAdded = useCallback(
    (message) => {
      if (message.conversation.sid === activeConversation.sid) {
        setMessages((prevMessage) => [...prevMessage, message]);
      }
    },
    [activeConversation?.sid]
  );

  useEffect(() => {
    if (!activeConversation) return;

    activeConversation
      .getMessages()
      .then((paginator) => {
        setMessages(paginator.items);
      })
      .then(() => activeConversation.getParticipants())
      .then((participants) => setParticipants(participants))
      .then(() => activeConversation.on("messageAdded", handleMessageAdded))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));

    return () => {
      activeConversation.removeAllListeners();
    };
  }, [activeConversation, handleMessageAdded]);

  useEffect(() => {
    if (isComposing) {
      setMessages([]);
    }
    return () => {
      // cleanup;
    };
  }, [isComposing]);

  // const handleScrollTop = async () => {
  //   if (!activeConversation) {
  //     setMessages([]);
  //     return;
  //   }

  //   setIsLoading(true);

  //   activeConversation
  //     .getMessages()
  //     .then((paginator) => {
  //       setMessages(paginator.items);
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  const messageList = messages.map((m, i, self) => {
    // if (!m.content) {
    //   return m;
    // }

    const variant = user.domainId === m.author ? "outgoing" : "incoming";

    const prevMessageSender = self[i - 1]?.author;
    const currMessageSender = m.author;
    const nextMessageSender = self[i + 1]?.author;

    let showTail = true;
    if (
      currMessageSender && // it is a message
      nextMessageSender && // the item after is a message
      currMessageSender === nextMessageSender // the item after is from the same sender
    ) {
      showTail = false;
    }
    let showName = true;
    if (
      currMessageSender && // it is a message
      prevMessageSender && // the item before is a message
      currMessageSender === prevMessageSender // the message before is from the same sender
    ) {
      showName = false;
    }

    let imageUrl = getAttendeeImage(m.author, "alternate");
    return (
      <div className="message">
        <Avatar src={imageUrl} style={{ alignSelf: "flex-end" }} />
        <ChatBubbleContainer
          timestamp={formatTime(m.dateCreated)}
          key={`message${i.toString()}`}
          css="margin: 1rem; margin-bottom: 0"
        >
          <ChatBubble
            variant={variant}
            senderName={m.author}
            showName={showName}
            showTail={showTail}
          >
            <div>{m.body}</div>
            {/* (m?.attributes.giftedId === self[i + 1]?.attributes.giftedId &&
              self[i + 1]?.type === "media") */}
            {m.type === "media" ? (
              <div style={{ marginTop: "10px" }}>
                <AttachmentProcessor
                  media={m.type === "media" ? m.media : self[i + 1]?.media}
                />
              </div>
            ) : null}
          </ChatBubble>
        </ChatBubbleContainer>
      </div>
    );
  });

  const hasIntalledContacts = useMemo(() => {
    return contacts.filter((c) => c.hasAppInstalled);
  }, [contacts]);

  const onToChange = (tags) => {
    const uniqueName =
      tags.length > 0 ? getUniqueName(tags, user.domainId) : null;
    onRecipientChange(uniqueName, tags);
    clientRef.current
      .getConversationByUniqueName(uniqueName)
      .then((conversation) => {
        conversation.getMessages().then((paginator) => {
          setMessages(paginator.items);
        });
      })
      .catch((err) => {
        setMessages([]);
        console.error("onToChange no conversation found", err);
      });
  };

  return (
    <div className="message-list-container">
      {isComposing ? (
        <div className={classes.to}>
          <Autocomplete
            multiple
            id="tags-standard"
            options={hasIntalledContacts.map((option) => option.domainId)}
            onChange={(event, value) => {
              console.log(value);
              onToChange(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="To:" placeholder="Contacts" />
            )}
          />
        </div>
      ) : (
        <Grid container justify="space-between" className={classes.grid}>
          <Grid item>
            <Typography
              variant="h5"
              align="center"
              className={classes.conversationName}
            >
              {getShortConversationName(activeConversation.friendlyName, user)}
            </Typography>
          </Grid>
          <Grid item>
            <div className={classes.options}>
              <IconButton
                onClick={() => {
                  history.push("videocall", {
                    conversationId: activeConversation.sid,
                    domainId: user.domainId,
                    mode: "call",
                  });
                }}
              >
                <Phone />
              </IconButton>
              <IconButton
                onClick={() => {
                  history.push("videocall", {
                    conversationId: activeConversation.sid,
                    domainId: user.domainId,
                    mode: "video",
                  });
                }}
              >
                <Videocam />
              </IconButton>

              <IconButton
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                <People />
                <Popover
                  id="mouse-over-popover"
                  className={classes.popover}
                  classes={{
                    paper: classes.paper,
                  }}
                  open={open}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  {participants.map((participant) => {
                    let imageUrl = getAttendeeImage(
                      participant.identity,
                      "alternate"
                    );
                    return (
                      <Typography key={participant.identity}>
                        {participant.identity}
                      </Typography>
                    );
                  })}
                </Popover>
              </IconButton>
            </div>
          </Grid>
        </Grid>
      )}
      <InfiniteList
        style={{ display: "flex", flexGrow: "1" }}
        items={messageList}
        // onLoad={handleScrollTop}
        isLoading={isLoading}
        className="chat-message-list"
      />
    </div>
  );
};
export default Messages;
