import React, { useEffect, useState, useCallback } from "react";

import {
  Heading,
  VideoTileGrid,
  Grid,
  Cell,
  useMeetingManager,
  useUserActivityState,
} from "amazon-chime-sdk-component-library-react";
import { createMeetingRequest, startCall } from "./api";
import { v4 as uuidv4 } from "uuid";
import Attendees from "./components/Attendees";
import ControlBar from "./components/ControlBar";

const VideoCallScreen = (props) => {
  const meetingManager = useMeetingManager();
  const { isUserActive } = useUserActivityState();

  const [isAttendeesTabOpen, setisAttendeesTabOpen] = useState(false);
  const toggleAttendeesButton = () => setisAttendeesTabOpen((prev) => !prev);

  const { location } = props;
  const { state } = location || {};
  const { domainId, conversationId, mode, notifiedIds } = state || {};

  useEffect(() => {
    const isConversationBase = conversationId ? true : false;
    const meetingId = isConversationBase
      ? `${uuidv4()}:${conversationId}`
      : uuidv4();

    console.log(
      "isConversationBase",
      isConversationBase,
      `conversationId: ${conversationId}`,
      `notifiedIds: ${notifiedIds}`
    );

    createMeetingRequest(meetingId, domainId).then(async (meetingResponse) => {
      const joinData = {
        meetingInfo: meetingResponse.JoinInfo.Meeting.Meeting,
        attendeeInfo: meetingResponse.JoinInfo.Attendee.Attendee,
      };

      await meetingManager.join(joinData);

      // At this point you can let users setup their devices, or start the session immediately
      await meetingManager.start();

      await startCall(
        meetingId,
        mode,
        !isConversationBase ? notifiedIds : null
      );
    });

    return async () => {
      await meetingManager.leave();
    };
  }, []);

  const onHangup = async () => {
    await meetingManager.leave();
    props.history.goBack();
  };

  return (
    <Grid
      style={{ height: "30vh" }}
      gridAutoFlow=""
      gridTemplateColumns="1fr 3fr"
      gridTemplateRows="90vh 80px"
      gridTemplateAreas='
    "sidebar main"
    "footer footer"'
    >
      <Cell gridArea="sidebar">
        {isAttendeesTabOpen ? <Attendees /> : null}
      </Cell>
      <Cell gridArea="main">
        <VideoTileGrid
          noRemoteVideoView={
            <Heading level={3} tag="p">
              No one is sharing their screen.
            </Heading>
          }
        />
      </Cell>
      <Cell gridArea="footer">
        {isUserActive ? (
          <ControlBar
            onHangup={onHangup}
            onParticipantPress={toggleAttendeesButton}
            mode={mode}
          />
        ) : null}
      </Cell>
    </Grid>
  );
};

const styles = {
  icon: { color: "white" },
};

export default VideoCallScreen;
