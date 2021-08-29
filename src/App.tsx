import React from "react";
import { Switch, Route } from "react-router-dom";
import loadable from "@loadable/component";

const HomePage = loadable(() => import("./home-page"));
const LoadablePage = loadable(() => import("./loadable-page"));

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/loadable-page" exact component={LoadablePage} />
    </Switch>
  );
};

export default App;
