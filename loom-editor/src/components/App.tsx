/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import "./App.css";
import NodeGraph from "./NodeGraph";
import NodeSearch from "./NodeSearch";
import { createNewNode } from "loom-common/EditorActions";

const appStyle = css`
  width: 100%;
  height: 100%;
`;

const App: FunctionComponent = () => {
  // shift and plus key add a new node (note that = is used since shift modifies it to be plus)
  useHotkeys("shift+=", () => window.vsCodeApi.postMessage(createNewNode()));

  return (
    <div css={appStyle}>
      <NodeSearch />
      <NodeGraph />
    </div>
  );
};

export default App;
