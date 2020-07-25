/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { YarnNode } from "loom-common/YarnNode";

import { getNodes } from "../../state/Selectors";
import { useYarnState } from "../../state/YarnContext";

import { ReactComponent as PlusIcon } from "../../icons/add.svg";
import { ReactComponent as CheckIcon } from "../../icons/check.svg";

import { listItemBase } from "../../Styles";

import { toggleTagOnNode, addNewTag } from "loom-common/EditorActions";

const containerStyle = css`
  position: absolute;
  left: 0px;
  top: 39px;

  /* Ideally, these would be calculated but for now we'll leave them as magic numbers... */
  height: 161px;
  width: 200px;

  background: var(--vscode-sideBar-background);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const newTagIconStyle = css`
  margin-right: 4px;
`;

const tagButtonStyle = css`
  display: flex;
  justify-content: space-around;
`;

const getTagList = (nodes: YarnNode[]) => {
  const tags = new Set<string>();

  nodes.forEach((node) => {
    // tags are separated by spaces
    node.tags.split(" ").forEach((tag) => {
      // ignore empty tags
      if (tag.trim().length > 0) {
        tags.add(tag);
      }
    });
  });

  return Array.from(tags);
};

interface NodeTagChooserProps {
  node: YarnNode;
  onClose: () => void;
}

const renderTag = (
  tag: string,
  nodeTags: string[],
  onClick: (tag: string) => void
) => (
  <button css={listItemBase} onClick={() => onClick(tag)}>
    <div css={tagButtonStyle}>
      {tag}
      {nodeTags.includes(tag) && <CheckIcon />}
    </div>
  </button>
);

const NodeTagChooser: FunctionComponent<NodeTagChooserProps> = ({
  node,
  onClose,
}) => {
  const [state, dispatch] = useYarnState();

  const nodes = getNodes(state);

  const nodeTags = node.tags.split(" ");

  const onTagClick = (tag: string) =>
    dispatch(toggleTagOnNode(node.title, tag));

  return (
    <div css={containerStyle}>
      {getTagList(nodes).map((tag) => renderTag(tag, nodeTags, onTagClick))}
      <button
        css={listItemBase}
        onClick={() => dispatch(addNewTag(node.title))}
      >
        <PlusIcon css={newTagIconStyle} /> New tag
      </button>
      <button css={listItemBase} onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default NodeTagChooser;
