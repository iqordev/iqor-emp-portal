import React, { useEffect } from "react";
import { VideoTileGrid } from "amazon-chime-sdk-component-library-react";
import { createMeetingRequest } from "./api";
import { v4 as uuidv4 } from "uuid";

const VideoCallScreen = (props) => {
  useEffect(() => {
    createMeetingRequest(
      `${uuidv4()}:${props.history.room}`,
      props.history.email
    );
  }, []);

  return <VideoTileGrid></VideoTileGrid>;
};

export default VideoCallScreen;
