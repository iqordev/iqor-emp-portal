import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WelcomeScreen from "./WelcomeScreen";
import ChatScreen from "./ChatScreen";
import ConversationListScreen from "./ConversationListScreen";
import VideoCallScreen from './VideoCallScreen'

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/videocall" component={VideoCallScreen} />
        <Route exact path="/chat" component={ChatScreen} />
        <Route exact path="/home" component={ConversationListScreen} />
        <Route path="/" component={WelcomeScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
