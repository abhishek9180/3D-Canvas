import React from "react";
import { Switch, Route } from "react-router-dom";
import AnimateCube from "./examples/AnimateCube";
import AnimateCube1 from "./examples/AnimateCube1";
import AnimateUniverse from "./examples/AnimateUniverse";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route path="/examples/animate-cube" component={AnimateCube} />
      <Route path="/examples/animate-cube1" component={AnimateCube1} />
      <Route path="/examples/animate-universe" component={AnimateUniverse} />
    </Switch>
  </main>
);

export default Main;
