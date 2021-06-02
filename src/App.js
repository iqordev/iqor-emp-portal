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
import { useHistory } from "react-router-dom";

// providers
import { AuthProvider } from "./providers/AuthProvider";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { CustomNavigationClient } from "./utils/NavigationClient";

function App({ pca }) {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <MeetingProvider>
        <UserActivityProvider>
          <NotificationProvider>
            <NotificationGroup />
            <AuthProvider>
              <Router />
            </AuthProvider>
          </NotificationProvider>
        </UserActivityProvider>
      </MeetingProvider>
    </MsalProvider>
  );
}

export default App;
