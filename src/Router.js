import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignInScreen from "./views/SignInScreen";
import HomeScreen from "./views/HomeScreen";
import VideoCallScreen from "./views/VideoCallScreen";
import Authenticated from "./components/Authenticated";

function Router() {
  return (
    <BrowserRouter>
      <Authenticated />
      <Switch>
        <Route exact path="/videocall" component={VideoCallScreen} />
        <Route exact path="/home" component={HomeScreen} />
        <Route path="/" component={SignInScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
