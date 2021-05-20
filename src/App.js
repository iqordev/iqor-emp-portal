import React from "react";
import Router from "./Router";

import {
  lightTheme,
  MeetingProvider,
} from "amazon-chime-sdk-component-library-react";
import { ThemeProvider } from "styled-components";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <Router />
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default App;
