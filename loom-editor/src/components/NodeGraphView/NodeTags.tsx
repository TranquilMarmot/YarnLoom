/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { titleColors } from "../NodeGraphView";
import { useYarnState } from "../../state/YarnContext";
import { searchForTag } from "../../state/UiActions";
import UiActionType from "../../state/UiActionType";

import { ReactComponent as AddIcon } from "../../icons/add.svg";
import { YarnNode } from "loom-common/YarnNode";

const containerStyle = css`
  grid-row: 3 / 4;
`;

const tagListStyle = css`
  display: flex;
  flex-wrap: wrap;
`;

const tagListContainerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const addTagButtonStyle = css`
  background: none;
  border: none;

  :hover {
    cursor: pointer;
  }
`;

const tagStyle = css`
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);

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
  node: YarnNode;

  colorId?: number;
  onOpenTagChooser: () => void;
}

const renderTags = (tags: string[], dispatch: (action: UiActionType) => void) =>
  tags.map((tag) => (
    <button
      css={tagStyle}
      key={tag}
      onClick={() => dispatch(searchForTag(tag))}
      data-testid="node-tag-button"
    >
      {tag}
    </button>
  ));

const NodeTags: FunctionComponent<NodeTagsProps> = ({
  node,
  colorId,
  onOpenTagChooser,
}) => {
  const dispatch = useYarnState()[1];

  return (
    <div
      css={css`
        ${containerStyle}
        background-color: ${titleColors[colorId || 0]}`}
    >
      <div css={tagListContainerStyle}>
        <div css={tagListStyle}>
          {node.tags && renderTags(node.tags.split(" "), dispatch)}
        </div>
        <button
          aria-label="Add tags to node"
          css={addTagButtonStyle}
          onClick={onOpenTagChooser}
        >
          <AddIcon />
        </button>
      </div>
    </div>
  );
};

export default NodeTags;
