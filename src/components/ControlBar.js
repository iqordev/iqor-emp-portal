import React, { useState } from "react";
import {
  ControlBar as ChimeControlBar,
  ControlBarButton,
  Phone,
  Attendees,
  AudioInputControl,
  AudioOutputControl,
  ContentShareControl,
  VideoInputControl,
} from "amazon-chime-sdk-component-library-react";

const ControlBar = ({ mode, onHangup, onParticipantPress }) => {
  const hangUpButtonProps = {
    icon: <Phone />,
    onClick: onHangup,
    label: "End",
  };

  const participantButtonProps = {
    icon: <Attendees />,
    onClick: onParticipantPress,
    label: "Attendees",
  };

  return (
    <ChimeControlBar showLabels layout="bottom">
      <AudioInputControl />
      <AudioOutputControl />
      {mode === "video" && <VideoInputControl />}
      {mode === "video" && <ContentShareControl />}
      <ControlBarButton {...participantButtonProps} />
      <ControlBarButton {...hangUpButtonProps} />
    </ChimeControlBar>
  );
};

export default ControlBar;
