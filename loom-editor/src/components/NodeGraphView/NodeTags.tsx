/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { titleColors } from "../NodeGraphView";

const containerStyle = css`
  grid-row: 3 / 4;
  display: flex;
`;

const tagStyle = css`
  background: #e0d6c5;

  border-radius: 25%;

  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;

  margin: 2px;
`;

interface NodeTagsProps {
  /** List of tags for the node */
  tags?: string;

  colorId?: number;
}

const renderTags = (tags: string[]) =>
  tags.map((tag) => (
    <div css={tagStyle} key={tag}>
      {tag}
    </div>
  ));

const NodeTags: FunctionComponent<NodeTagsProps> = ({ tags, colorId }) => {
  return (
    <div
      css={css`
        ${containerStyle}
        background-color: ${titleColors[colorId || 0]}`}
    >
      {tags && renderTags(tags.split(" "))}
    </div>
  );
};

export default NodeTags;
