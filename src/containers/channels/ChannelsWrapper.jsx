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

import "./ChannelsWrapper.css";
import { getShortConversationName } from "../../utils/simplifyConversationName";

const ChannelsWrapper = ({
  conversations,
  user,
  activeConversation,
  setActiveConversation,
}) => {
  return (
    <>
      <div className="channel-list-wrapper">
        <div className="channel-list-header">
          <div className="channel-list-header-title">Chat</div>
          {/* <IconButton
            className="create-channel-button channel-options"
            // onClick={() => setModal("NewChannel")}
            icon={<Dots width="1.5rem" height="1.5rem" />}
          /> */}
        </div>
        <ChannelList
          style={{
            padding: "8px",
          }}
        >
          {conversations.map((conversation) => (
            <ChannelItem
              key={conversation.sid}
              name={getShortConversationName(conversation.friendlyName, user)}
              isSelected={conversation.sid === activeConversation?.sid}
              onClick={(e) => {
                e.stopPropagation();
                setActiveConversation(conversation);
              }}
            />
          ))}
        </ChannelList>
      </div>
    </>
  );
};

export default ChannelsWrapper;
