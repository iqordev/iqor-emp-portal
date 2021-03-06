/* eslint-disable no-use-before-define */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

import {
  PopOverItem,
  PopOverSeparator,
  IconButton,
  Dots,
  useNotificationDispatch,
  ChannelList,
  ChannelItem,
} from "amazon-chime-sdk-component-library-react";
import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PersonRounded, PeopleRounded } from "@material-ui/icons";

import "./ChannelsWrapper.css";
import { getShortConversationName } from "../../utils/simplifyConversationName";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    padding: 0,
  },
}));

const ChannelsWrapper = ({
  conversations,
  user,
  isComposing,
  activeConversation,
  onTapConversation,
}) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {isComposing && (
        <ListItem key={1} selected={isComposing}>
          <ListItemAvatar>
            <Avatar>
              <PersonRounded />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={"New Chat"}
            // secondary="Jan 9, 2014"
          />
        </ListItem>
      )}
      {conversations.map((conversation) => (
        <ListItem
          key={conversation.sid}
          selected={conversation.sid === activeConversation?.sid}
          onClick={(e) => {
            console.log(conversation);
            onTapConversation(conversation);
          }}
        >
          <ListItemAvatar>
            <Avatar>
              {conversation.attributes.isGroupChat ? (
                <PeopleRounded />
              ) : (
                <PersonRounded />
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={getShortConversationName(conversation.friendlyName, user)}
            // secondary="Jan 9, 2014"
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ChannelsWrapper;
