/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { YarnNode } from "loom-common/YarnNode";

import { getNodes } from "../../state/Selectors";
import { useYarnState } from "../../state/YarnContext";

import { ReactComponent as PlusIcon } from "../../icons/add.svg";
import { ReactComponent as CheckIcon } from "../../icons/check.svg";

import { listItemBase, nodeOverlayContainer } from "../../Styles";

import { toggleTagOnNode, promptForNewTags } from "loom-common/EditorActions";

const tagButtonContainerStyle = css`
  max-height: 120px;
  overflow-x: auto;
  width: 100%;
`;

const bottomButtonContainerStyle = css`
  display: flex;
  width: 100%;
`;

const bottomButtonsStyle = css`
  ${listItemBase}

  justify-content: center;
`;

const newTagIconStyle = css`
  margin-right: 4px;
`;

const tagButtonContentStyle = css`
  display: flex;
  justify-content: space-between;

  width: 100%;
`;

/**
 * From the list of all nodes get all unique tag names
 * @param nodes List of all nodes
 */
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

  return Array.from(tags).sort();
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
    <div css={tagButtonContentStyle}>
      <div>{tag}</div>
      {nodeTags.includes(tag) && <CheckIcon />}
    </div>
  </button>
);

const NodeTagChooser: FunctionComponent<NodeTagChooserProps> = ({
  node,
  onClose,
}) => {
  const [state] = useYarnState();

  const nodes = getNodes(state);

  const nodeTags = node.tags.split(" ");

  const onTagClick = (tag: string) =>
    window.vsCodeApi.postMessage(toggleTagOnNode(node.title, tag));

  return (
    <div css={nodeOverlayContainer}>
      <div css={tagButtonContainerStyle}>
        {getTagList(nodes).map((tag) => renderTag(tag, nodeTags, onTagClick))}
      </div>
      <div css={bottomButtonContainerStyle}>
        <button css={bottomButtonsStyle} onClick={onClose}>
          Close
        </button>
        <button
          css={bottomButtonsStyle}
          onClick={() =>
            window.vsCodeApi.postMessage(promptForNewTags(node.title))
          }
        >
          <PlusIcon css={newTagIconStyle} /> New tag
        </button>
      </div>
    </div>
  );
};

export default NodeTagChooser;
