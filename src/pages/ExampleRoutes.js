import React from "react";
import { Switch, Route } from "react-router-dom";
import PolygonAnimationGeometry from "./examples/PolygonAnimationGeometry";
import PolygonAnimationGeometry1 from "./examples/PolygonAnimationGeometry1";
import UniverseAnimationLights from "./examples/UniverseAnimationLights";
import TextAnimationLights from "./examples/TextAnimationLights";
import RenderToTexture from "./examples/RenderToTexture";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <Route path="/examples/polygon-animation-geometry" component={PolygonAnimationGeometry} />
      <Route path="/examples/polygon-animation1-geometry" component={PolygonAnimationGeometry1} />
      <Route path="/examples/universe-animation-lights" component={UniverseAnimationLights} />
      <Route path="/examples/text-animation-geometry" component={TextAnimationLights} />
      <Route path="/examples/render-to-texture" component={RenderToTexture} />
    </Switch>
  </main>
);

export default Main;
