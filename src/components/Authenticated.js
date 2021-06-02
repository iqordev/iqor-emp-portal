import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
// import routes from "../constants/routes";
import { useAuthContext } from "../providers/AuthProvider";

const Authenticated = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  // const notificationDispatch = useNotificationDispatch();
  const history = useHistory();

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
      //Cleanup notifications
      // notificationDispatch({
      //   type: 2, // REMOVE_ALL
      //   payload: {}
      // });
      history.push("home");
    } else {
      history.push("/");
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default Authenticated;
