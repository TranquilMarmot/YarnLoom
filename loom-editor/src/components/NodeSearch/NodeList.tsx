/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { createNewNode } from "loom-common/EditorActions";

import { getNodes } from "../../state/Selectors";
import { useYarnState } from "../../state/YarnContext";
import { setFocusedNode } from "../../state/UiActions";

import { nodeColors } from "../NodeGraphView";

import { ReactComponent as NewFile } from "../../icons/new-file.svg";
import { listItemBase } from "../../Styles";

const containerStyle = css`
  max-height: 320px;
  overflow-y: auto;
`;

const colorBlockStyle = css`
  width: 15px;
  height: 15px;

  margin-right: 5px;
`;

const newNodeIconStyle = css`
  margin-right: 4px;
`;

const NodeList: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();

  const nodes = getNodes(state);

  return (
    <div css={containerStyle} data-testid="node-search-node-list">
      {nodes.map((node) => (
        <button
          key={`node-list-${node.title}`}
          css={listItemBase}
          onClick={() => dispatch(setFocusedNode(node.title))}
          data-testid="node-search-node-button"
        >
          <div
            css={css`${colorBlockStyle} background-color: ${
              nodeColors[node.colorID || 0]
            };`}
          >
            {" "}
          </div>
          {node.title}
        </button>
      ))}
      <button
        css={listItemBase}
        onClick={() => window.vsCodeApi.postMessage(createNewNode())}
      >
        <NewFile css={newNodeIconStyle} /> Add new node
      </button>
    </div>
  );
};

export default NodeList;
