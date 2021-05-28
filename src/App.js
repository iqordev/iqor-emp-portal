import React from "react";
import Router from "./Router";

import {
  lightTheme,
  darkTheme,
  MeetingProvider,
  UserActivityProvider,
  NotificationProvider,
  NotificationGroup,
} from "amazon-chime-sdk-component-library-react";
import { ThemeProvider } from "styled-components";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <UserActivityProvider>
          <NotificationProvider>
            <NotificationGroup />
            <Router />
          </NotificationProvider>
        </UserActivityProvider>
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default App;
