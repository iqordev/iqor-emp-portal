import React from "react";
import Router from "./Router";

import {
  lightTheme,
  darkTheme,
  MeetingProvider,
  UserActivityProvider,
} from "amazon-chime-sdk-component-library-react";
import { ThemeProvider } from "styled-components";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <UserActivityProvider>
          <Router />
        </UserActivityProvider>
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default App;
