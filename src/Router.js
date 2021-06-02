import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WelcomeScreen from "./WelcomeScreen";
import ConversationListScreen from "./ConversationListScreen";
import VideoCallScreen from "./VideoCallScreen";
import Authenticated from './components/Authenticated';

function Router() {
  return (
    <BrowserRouter>
      <Authenticated />
      <Switch>
        <Route exact path="/videocall" component={VideoCallScreen} />
        <Route exact path="/home" component={ConversationListScreen} />
        <Route path="/" component={WelcomeScreen} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
