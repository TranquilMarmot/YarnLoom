/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";
import { YarnGraphNode } from "./NodeGraph";

const containerStyle = css`
  background: white;
  color: black;
  width: 100%;
  height: 100%;
  overflow: scroll;
`;

const bodyStyle = css`
  font-size: 8px;
`;

interface NodeGraphViewProps {
  node: YarnGraphNode;
}

const NodeGraphView: FunctionComponent<NodeGraphViewProps> = ({ node }) => {
  return (
    <div css={containerStyle}>
      <div>{node.yarnNode.title}</div>
      <div css={bodyStyle}>
        {node.yarnNode.body.split("\n").map((line) => (
          <div>{line.replace(/ /g, "\u00a0")}</div>
        ))}
      </div>
    </div>
  );
};

export default NodeGraphView;
