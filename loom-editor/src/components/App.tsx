/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import "./App.css";
import NodeGraph from "./NodeGraph";
import NodeSearch from "./NodeSearch";

const appStyle = css`
  width: 100%;
  height: 100%;
`;

const App: FunctionComponent = () => (
  <div css={appStyle}>
    <NodeSearch />
    <NodeGraph />
  </div>
);

export default App;
