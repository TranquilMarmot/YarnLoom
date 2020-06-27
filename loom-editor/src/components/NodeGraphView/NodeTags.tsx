/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { titleColors } from "../NodeGraphView";
import { useYarnState } from "../../state/YarnContext";
import { searchForTag } from "../../state/UiActions";
import UiActionType from "../../state/UiActionType";

const containerStyle = css`
  grid-row: 3 / 4;
  display: flex;
  flex-wrap: wrap;
`;

const tagStyle = css`
  background-color: var(--vscode-inputOption-activeBackground);
  color: var(--vscode-inputOption-activeForeground);

  border: none;

  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;

  margin: 2px;

  :hover {
    cursor: pointer;
  }
`;

interface NodeTagsProps {
  /** List of tags for the node */
  tags?: string;

  colorId?: number;
}

const renderTags = (tags: string[], dispatch: (action: UiActionType) => void) =>
  tags.map((tag) => (
    <button
      css={tagStyle}
      key={tag}
      onClick={() => dispatch(searchForTag(tag))}
    >
      {tag}
    </button>
  ));

const NodeTags: FunctionComponent<NodeTagsProps> = ({ tags, colorId }) => {
  const [state, dispatch] = useYarnState();

  return (
    <div
      css={css`
        ${containerStyle}
        background-color: ${titleColors[colorId || 0]}`}
    >
      {tags && renderTags(tags.split(" "), dispatch)}
    </div>
  );
};

export default NodeTags;
