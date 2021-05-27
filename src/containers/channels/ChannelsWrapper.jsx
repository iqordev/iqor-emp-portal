/* eslint-disable no-console */
// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
  },
}));

const ChannelsWrapper = ({
  conversations,
  user,
  activeConversation,
  setActiveConversation,
}) => {
  const classes = useStyles();

  return (
    <>
      <div className="channel-list-wrapper">
        {/* <div className="channel-list-header">
          <div className="channel-list-header-title">Chat</div>
        </div> */}
        <List className={classes.root}>
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.sid}
              selected={conversation.sid === activeConversation?.sid}
              onClick={(e) => {
                setActiveConversation(conversation);
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
                primary={getShortConversationName(
                  conversation.friendlyName,
                  user
                )}
                // secondary="Jan 9, 2014"
              />
            </ListItem>
          ))}
        </List>
      </div>
    </>
  );
};

export default ChannelsWrapper;
