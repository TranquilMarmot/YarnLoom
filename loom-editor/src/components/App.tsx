/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import "./App.css";
import NodeGraph from "./NodeGraph";

const appStyle = css`
  width: 100%;
  height: 100%;
`;

const App: FunctionComponent = () => (
  <div css={appStyle}>
    Loom Editor
    <NodeGraph />
  </div>
);

export default App;
