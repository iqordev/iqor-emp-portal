import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useAuthContext } from "./AuthProvider";
import useWebSocket, { ReadyState } from "react-use-websocket";

const iMenuContext = createContext();

const ImenuProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuthContext();

  const AppUniqueID = "a19913e4-ab9f-4985-8d60-08d9f080d2dc";
  const [socketUrl, setSocketUrl] = useState("wss://echo.websocket.org");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [connectionId, setConnectionId] = useState("");

  const handleClickSendMessage = useCallback(
    (obj) => sendMessage(obj),
    [sendMessage]
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    if (!isAuthenticated) return;
    setSocketUrl("ws://127.0.0.1:5011");
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // console.log("useWebSocket", connectionStatus, lastMessage);
    const currentData = lastMessage ? JSON.parse(lastMessage.data) : null;
    console.log("useWebSocket ", lastMessage, currentData);
    if (!connectionId && currentData) {
      setConnectionId(currentData.ConnectionID);
    }

    if (!currentData) return;

    if (currentData.Information.toLowerCase().includes("initial")) {
      const payload = {
        AppUniqueID: AppUniqueID,
        ConnectionID: connectionId,
        IPAddress: "",
        SMEDomainID: user.domainId,
        AgentDomainID: "",
        Action: "Status",
      };
      console.log("sending payload", payload);
      sendMessage(payload);
    }
  }, [
    lastMessage,
    connectionStatus,
    connectionId,
    isAuthenticated,
    user,
    sendMessage,
  ]);

  const imenuFullfiller = {
    handleClickSendMessage,
    lastMessage,
    connectionStatus,
    connectionId,
  };

  return (
    <iMenuContext.Provider value={imenuFullfiller}>
      {children}
    </iMenuContext.Provider>
  );
};

const useImenuContext = () => {
  const context = useContext(iMenuContext);

  if (!context) {
    throw new Error("useImenuContext must be used within iMenuProvider");
  }

  return context;
};

export { ImenuProvider, useImenuContext };
