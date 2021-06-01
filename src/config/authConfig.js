import { LogLevel } from "@azure/msal-browser";
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: "9e3a159c-c531-4ded-8d39-b6efb6c986e7",
    authority:
      "https://login.microsoftonline.com/64d057c4-c04c-46f9-9cdf-1d2ba46b5074",
    redirectUri: "http://localhost:3000",
    postLogoutRedirectUri: "/",
    // additionalParameters: { prompt: "select_account" },
  },
  cache: {
    storeAuthStateInCookie: isIE || isEdge || isFirefox,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: [
    "openid",
    "profile",
    "email",
    "offline_access",
    "User.Read",
    "User.ReadBasic.All",
  ],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me",
};
