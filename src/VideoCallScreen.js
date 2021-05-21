import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import {
  AppBar,
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import { CameraAlt, DesktopMac } from "@material-ui/icons";
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

    console.log(meetingId);
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
    <Container component="main" maxWidth="md">
      <AppBar elevation={10}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Meeting</Typography>
        </Toolbar>
      </AppBar>
      <CssBaseline />

      <Grid
        style={{ height: "30vh" }}
        gridGap=".25rem"
        gridAutoFlow=""
        gridTemplateColumns="100px 1fr"
        gridTemplateAreas='
    "sidebar main "
  '
      >
        <Cell gridArea="sidebar">
          <ControlBar showLabels layout="left">
            <ControlBarButton {...microphoneButtonProps} />
            <ControlBarButton {...volumeButtonProps} />
            {mode === "video" && <ControlBarButton {...cameraButtonProps} />}
            {mode === "video" && <ControlBarButton {...laptopButtonProps} />}
            <ControlBarButton {...hangUpButtonProps} />
          </ControlBar>
        </Cell>
        <Cell gridArea="main">
          <div style={{ height: "100vh" }}>
            <VideoTileGrid
              noRemoteVideoView={<div>No one is sharing his video</div>}
            />
          </div>
        </Cell>
      </Grid>
    </Container>
  );
};

const styles = {
  icon: { color: "white" },
};

export default VideoCallScreen;
