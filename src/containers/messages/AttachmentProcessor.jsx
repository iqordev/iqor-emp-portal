// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from "react";
import { MessageAttachment } from "amazon-chime-sdk-component-library-react";
import formatBytes from "../../utils/formatBytes";

export const AttachmentProcessor = (media) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    async function getUrl() {
      const data = await media.media.getContentTemporaryUrl();
      setUrl(data);
    }
    getUrl();
  }, []);
  // sid, filename, size = 0, contentType
  return (
    <MessageAttachment
      name={media.media.filename ?? `${url.substring(0, 25)}...`}
      downloadUrl={url}
      size={formatBytes(media.media.size)}
    />
  );
};

export default AttachmentProcessor;
