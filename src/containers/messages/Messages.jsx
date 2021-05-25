/* eslint-disable react/no-children-prop */
/* eslint-disable no-console */
// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useCallback } from "react";
import {
  InfiniteList,
  ChatBubble,
  ChatBubbleContainer,
  formatTime,
} from "amazon-chime-sdk-component-library-react";

import { IconButton, Avatar } from "@material-ui/core";
import { Videocam, Phone } from "@material-ui/icons";
import { useHistory } from "react-router";

import "./Messages.css";
import { getShortConversationName } from "../../utils/simplifyConversationName";
import AttachmentProcessor from "./AttachmentProcessor";
import { getAttendeeImage } from "../../utils/ImageHelper";

const Messages = ({ user, activeConversation }) => {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleMessageAdded = useCallback(
    (message) => {
      if (message.conversation.sid === activeConversation.sid) {
        setMessages((prevMessage) => [...prevMessage, message]);
      }
    },
    [activeConversation.sid]
  );

  useEffect(() => {
    activeConversation
      .getMessages()
      .then((paginator) => {
        console.log(paginator.items);
        setMessages(paginator.items);
      })
      .finally(() => setIsLoading(false));

    activeConversation.on("messageAdded", handleMessageAdded);

    return () => {
      activeConversation.removeAllListeners();
    };
  }, [activeConversation, handleMessageAdded]);

  const handleScrollTop = async () => {
    setIsLoading(true);

    activeConversation
      .getMessages()
      .then((paginator) => {
        console.log(paginator.items);
        setMessages(paginator.items);
      })
      .finally(() => setIsLoading(false));
  };

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

    let imageUrl = getAttendeeImage(m.author, 'alternate');
    return (
      <div className="message">
        <Avatar
          alt="Remy Sharp"
          src={imageUrl}
          style={{ alignSelf: "flex-end" }}
        />
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

  return (
    <div className="message-list-container">
      <div className="message-list-header">
        {getShortConversationName(activeConversation.friendlyName, user)}

        <IconButton
          style={{
            textAlign: "right",
          }}
          onClick={() => {
            history.push("videocall", {
              room: activeConversation.sid,
              email: user.domainId,
              mode: "call",
            });
          }}
        >
          <Phone />
        </IconButton>
        <IconButton
          style={{
            textAlign: "right",
          }}
          onClick={() => {
            history.push("videocall", {
              room: activeConversation.sid,
              email: user.domainId,
              mode: "video",
            });
          }}
        >
          <Videocam />
        </IconButton>
      </div>
      <InfiniteList
        style={{ display: "flex", flexGrow: "1" }}
        items={messageList}
        onLoad={handleScrollTop}
        isLoading={isLoading}
        className="chat-message-list"
      />
    </div>
  );
};
export default Messages;
