/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";
import { YarnGraphNode } from "../NodeGraph";
import NodeSettings from "./NodeSettings";
import NodeTags from "./NodeTags";

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

const bodyStyle = css`
  font-size: 10px;
  overflow: scroll;
  width: 147px;
  padding-left: 3px;

  ::-webkit-scrollbar-corner {
    background-color: white;
  }
`;

const noTagsBodyStyle = css`
  height: 111px;
`;

const withTagsBodyStyle = css`
  height: 85px;
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
      <div css={css`${bodyStyle}${tags ? withTagsBodyStyle : noTagsBodyStyle}`}>
        {body.split("\n").map((line) => (
          <div>{line.replace(/ /g, "\u00a0")}</div>
        ))}
      </div>
      {tags && <NodeTags tags={tags} colorId={colorID} />}

      {settingsOpen && <NodeSettings nodeTitle={title} />}
    </div>
  );
};

export default NodeGraphView;
