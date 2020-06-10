/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";
import { YarnGraphNode } from "./NodeGraph";

const titleColors = [
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
`;

const bodyStyle = css`
  font-size: 10px;
  overflow: scroll;
  width: 147px;
  height: 111px;
  padding-left: 3px;

  ::-webkit-scrollbar-corner {
    background-color: white;
  }
`;

interface NodeGraphViewProps {
  node: YarnGraphNode;
}

const NodeGraphView: FunctionComponent<NodeGraphViewProps> = ({ node }) => {
  return (
    <div css={containerStyle}>
      <div
        css={css`
        ${titleStyle}
        background-color: ${titleColors[node.yarnNode.colorID || 0]} 
      `}
      >
        {node.yarnNode.title}
      </div>
      <div css={bodyStyle}>
        {node.yarnNode.body.split("\n").map((line) => (
          <div>{line.replace(/ /g, "\u00a0")}</div>
        ))}
      </div>
    </div>
  );
};

export default NodeGraphView;
