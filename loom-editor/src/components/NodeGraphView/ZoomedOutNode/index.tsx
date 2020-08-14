/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { YarnNode } from "loom-common/YarnNode";

// NOTE: This is also defined in NodeGraphView, but it cannot be imported because
// something funny happens when the package is built and it gets erased 💥
export const NodeSizePx = 200;

const containerStyle = css`
  grid-row: 1 / 3; /* fills the whole container */

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: ${NodeSizePx}px;
`;

const titleStyle = css`
  font-size: 32px;
  font-weight: 500;
  word-wrap: break-word;
  display: inline-block;
  width: ${NodeSizePx}px;
`;

const tagsContainerStyle = css`
  width: ${NodeSizePx}px;
  font-size: 22px;
  margin-top: 15px;

  display: flex;
  flex-wrap: wrap;
`;

const tagStyle = css`
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);

  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;

  margin: 2px;
`;

interface ZoomedOutNodeProps {
  yarnNode: YarnNode;
  nodeColor: string;
  nodeColorIsDark: boolean;
}

const ZoomedOutNode: FunctionComponent<ZoomedOutNodeProps> = ({
  yarnNode,
  nodeColor,
  nodeColorIsDark,
}) => {
  const fontColor = nodeColorIsDark ? "white" : "black";

  return (
    <div
      css={css`
        ${containerStyle}
        background-color: ${nodeColor};
        color: ${fontColor};
      `}
    >
      <div css={titleStyle}>{yarnNode.title}</div>
      <div css={tagsContainerStyle}>
        {yarnNode.tags.split(" ").map(
          (tag) =>
            tag.length !== 0 && (
              <div key={`${yarnNode.title}-zoomed-${tag}`} css={tagStyle}>
                {tag}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ZoomedOutNode;
