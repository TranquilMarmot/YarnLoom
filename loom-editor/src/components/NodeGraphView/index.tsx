/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import { YarnGraphNode } from "../NodeGraph";
import NodeSettings from "./NodeSettings";
import NodeTags from "./NodeTags";
import NodeBody from "./NodeBody";

/** CSS colors to cycle through for the "colorID" of a yarn node */
export const titleColors = [
  "#EBEBEB",
  "#6EA5E0",
  "#9EDE74",
  "#FFE374",
  "#F7A666",
  "#C47862",
  "#97E1E9",
  "#576574",
  "#000000",
];

const containerStyle = css`
  background: white;
  color: black;
  width: 100%;
  height: 100%;
`;

const titleStyle = css`
  padding: 10px;
  border: 1px solid grey;

  display: flex;
  justify-content: space-between;
`;
const settingsButtonStyle = css`
  background: none;
  border: none;

  padding-top: 0;
  padding-bottom: 0;

  :hover {
    cursor: pointer;
  }
`;

interface NodeGraphViewProps {
  node: YarnGraphNode;
}

const NodeGraphView: FunctionComponent<NodeGraphViewProps> = ({
  node: {
    yarnNode: { colorID, title, body, tags },
  },
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div css={containerStyle}>
      <div
        css={css`
        ${titleStyle}
        background-color: ${titleColors[colorID || 0]} 
      `}
      >
        <div>{title}</div>
        <button
          css={settingsButtonStyle}
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <span role="img" aria-label="Node Settings">
            ⚙️
          </span>
        </button>
      </div>
      <NodeBody body={body} tags={tags} />
      {tags && <NodeTags tags={tags} colorId={colorID} />}

      {settingsOpen && <NodeSettings nodeTitle={title} />}
    </div>
  );
};

export default NodeGraphView;
