import React, { createContext, useState, useContext, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useNotificationDispatch } from "amazon-chime-sdk-component-library-react";
import { deviceDetect } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

import { loginRequest } from "../config/authConfig";

import {
  signIn,
  getUser,
  getToken,
  signInAlternate,
  getTokenuser,
} from "../api";

const internalIp = require("internal-ip");

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // const notificationDispatch = useNotificationDispatch();

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatToken, setChatToken] = useState("");
  const [ip, setIp] = useState(null);
  const [user, setUser] = useState(null);
  const { instance, accounts, inProgress } = useMsal();

  const userSignIn = async () => {
    try {
      const response = await instance.loginPopup();
      localStorage.setItem("@accessToken", response.idToken);

      const device = deviceDetect();
      const deviceId = localStorage.getItem("@deviceId") ?? uuidv4();
      const { chatToken } = await signIn({
        device: {
          id: deviceId,
          ...device,
        },
      });
      // setChatToken(chatToken);

      localStorage.setItem("@deviceId", deviceId);
      const user = await getUser();
      setUser(user);

      const token = await getToken(user.domainId);
      setChatToken(token);

      const currentIp = await internalIp.v4();
      const currentIpv6 = await internalIp.v6();
      console.log("currentIp", currentIp, currentIpv6);
      setIp(currentIp);

      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      // notificationDispatch({
      //   type: 0,
      //   payload: {
      //     message: error,
      //     severity: "error",
      //   },
      // });
    }
  };

  const userSignInAlternnate = async (domainId) => {
    try {
      const response = await getTokenuser(domainId);
      localStorage.setItem("@accessToken", response.token);

      const device = deviceDetect();
      const deviceId = localStorage.getItem("@deviceId") ?? uuidv4();
      const { chatToken } = await signInAlternate({
        device: {
          id: deviceId,
          ...device,
        },
      });
      // setChatToken(chatToken);

      localStorage.setItem("@deviceId", deviceId);
      const user = await getUser();
      setUser(user);

      const token = await getToken(user.domainId);
      setChatToken(token);

      const currentIp = await internalIp.v4();
      const currentIpv6 = await internalIp.v6();
      console.log("currentIp", currentIp, currentIpv6);
      setIp(currentIp);

      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      // notificationDispatch({
      //   type: 0,
      //   payload: {
      //     message: error,
      //     severity: "error",
      //   },
      // });
    }
  };

  useEffect(() => {
    const trySignInAuto = async () => {
      try {
        console.log("trySignInAuto", inProgress, accounts.length);
        if (inProgress === "none" && accounts.length > 0) {
          // Retrieve an access token
          const response = await instance.acquireTokenSilent({
            account: accounts[0],
            ...loginRequest,
          });
          setIsAuthenticated(true);

          localStorage.setItem("@accessToken", response.idToken);

          const device = deviceDetect();
          const deviceId = localStorage.getItem("@deviceId") ?? uuidv4();
          const { chatToken } = await signIn({
            device: {
              id: deviceId,
              ...device,
            },
          });
          // setChatToken(chatToken);

          localStorage.setItem("@deviceId", deviceId);
          const user = await getUser();
          setUser(user);

          const token = await getToken(user.domainId);
          setChatToken(token);

          const currentIp = await internalIp.v4();
          const currentIpv6 = await internalIp.v6();
          console.log("currentIp", currentIp, currentIpv6);
          setIp(currentIp);
        }
      } catch (error) {
        console.error(error);
      }
    };

    trySignInAuto();
  }, [inProgress, accounts, instance]);

  const authFulfiller = {
    ip,
    user,
    chatToken,
    isAuthenticated,
    userSignIn,
    userSignInAlternnate,
  };

  return (
    <AuthContext.Provider value={authFulfiller}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuthContext };
