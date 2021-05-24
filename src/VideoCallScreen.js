import React, { useEffect, useState, useCallback } from "react";

import {
  VideoTileGrid,
  LocalVideo,
  useMeetingManager,
  useLocalVideo,
  useContentShareControls,
  ControlBar,
  ControlBarButton,
  Microphone,
  Phone,
  Dialer,
  Camera,
  Sound,
  Laptop,
  Grid,
  Cell,
  useToggleLocalMute,
  useLocalAudioOutput,
} from "amazon-chime-sdk-component-library-react";
import { ThemeProvider } from "styled-components";
import { createMeetingRequest, endMeetingRequest, startCall } from "./api";
import { v4 as uuidv4 } from "uuid";
import Attendees from "./components/Attendees";

const VideoCallScreen = (props) => {
  const meetingManager = useMeetingManager();
  const { isVideoEnabled, toggleVideo } = useLocalVideo();
  const { toggleContentShare } = useContentShareControls();
  const [cameraActive, setCameraActive] = useState(false);

  const { muted, toggleMute } = useToggleLocalMute();
  const { isAudioOn, toggleAudio } = useLocalAudioOutput();

  const { location } = props;
  const { state } = location || {};
  const { email, room, mode } = state || {};

  useEffect(() => {
    const meetingId = `${uuidv4()}:${room}`;

    createMeetingRequest(meetingId, email).then(async (meetingResponse) => {
      const joinData = {
        meetingInfo: meetingResponse.JoinInfo.Meeting.Meeting,
        attendeeInfo: meetingResponse.JoinInfo.Attendee.Attendee,
      };

      await meetingManager.join(joinData);

      // At this point you can let users setup their devices, or start the session immediately
      await meetingManager.start();

      await startCall(meetingId, mode);
    });

    return async () => {
      await meetingManager.leave();
    };
  }, []);

  const microphoneButtonProps = {
    icon: muted ? <Microphone muted /> : <Microphone />,
    onClick: toggleMute,
    label: "Mute",
  };

  const cameraButtonProps = {
    icon: cameraActive ? <Camera disabled /> : <Camera />,
    onClick: () => {
      setCameraActive(!cameraActive);
      toggleVideo();
    },
    label: "Camera",
  };

  const hangUpButtonProps = {
    icon: <Phone />,
    onClick: async () => {
      await meetingManager.leave();
      props.history.goBack();
    },
    label: "End",
  };

  const volumeButtonProps = {
    icon: isAudioOn ? <Sound /> : <Sound disabled />,
    onClick: toggleAudio,
    label: "Volume",
  };

  const laptopButtonProps = {
    icon: <Laptop />,
    onClick: toggleContentShare,
    label: "Screen",
  };

  return (
    <Grid
      style={{ height: "30vh" }}
      gridAutoFlow=""
      gridTemplateColumns="1fr 3fr"
      gridTemplateRows="90vh 80px"
      gridTemplateAreas='
    "sidebar main"
    "footer footer"
  '
    >
      <Cell gridArea="sidebar">
        <Attendees />
      </Cell>
      <Cell gridArea="main">
        <VideoTileGrid />
      </Cell>
      <Cell gridArea="footer">
        <ControlBar showLabels layout="bottom">
          <ControlBarButton {...microphoneButtonProps} />
          <ControlBarButton {...volumeButtonProps} />
          {mode === "video" && <ControlBarButton {...cameraButtonProps} />}
          {mode === "video" && <ControlBarButton {...laptopButtonProps} />}
          <ControlBarButton {...hangUpButtonProps} />
        </ControlBar>
      </Cell>
    </Grid>
  );
};

const styles = {
  icon: { color: "white" },
};

export default VideoCallScreen;
