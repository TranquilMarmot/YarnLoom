/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { useYarnState } from "../../../state/YarnContext";
import { searchForTag } from "../../../state/UiActions";
import UiActionType from "../../../state/UiActionType";

import { ReactComponent as AddIcon } from "../../../icons/add.svg";
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

  display: flex;
  align-items: center;
  justify-content: center;

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

interface NodeFooterProps {
  node: YarnNode;

  nodeColor: string;
  nodeColorIsDark: boolean;
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

const NodeFooter: FunctionComponent<NodeFooterProps> = ({
  node,
  nodeColor,
  nodeColorIsDark,
  onOpenTagChooser,
}) => {
  const dispatch = useYarnState()[1];

  const iconFillStyle = css`
    fill: ${nodeColorIsDark ? "white" : "black"};
  `;

  return (
    <div
      css={css`
        ${containerStyle}
        background-color: ${nodeColor}`}
    >
      <div css={tagListContainerStyle}>
        <div css={tagListStyle}>
          {node.tags && renderTags(node.tags.split(" "), dispatch)}
        </div>
        <button
          title="Manage node tags"
          css={addTagButtonStyle}
          onClick={onOpenTagChooser}
        >
          <AddIcon css={iconFillStyle} />
        </button>
      </div>
    </div>
  );
};

export default NodeFooter;
