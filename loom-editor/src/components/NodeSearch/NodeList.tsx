/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { getNodes } from "../../state/Selectors";
import { useYarnState } from "../../state/YarnContext";

import { titleColors } from "../NodeGraphView";
import { setFocusedNode } from "loom-common/EditorActions";

const nodeButtonStyle = css`
  display: flex;

  color: var(--vscode-menu-foreground);

  width: 100%;
  height: 40px;

  background: none;
  border: none;
  outline: none !important;

  text-align: left;

  :hover {
    cursor: pointer;
    background-color: var(--vscode-list-inactiveSelectionBackground);
  }

  :focus {
    background-color: var(--vscode-list-focusBackground);
  }
`;

const colorBlockStyle = css`
  width: 15px;
  height: 15px;

  margin-right: 5px;
`;

const NodeList: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();

  const nodes = getNodes(state);

  return (
    <div>
      {nodes.map((node) => (
        <button
          key={`node-list-${node.title}`}
          css={nodeButtonStyle}
          onClick={() => dispatch(setFocusedNode(node.title))}
        >
          <div
            css={css`${colorBlockStyle} background-color: ${
              titleColors[node.colorID || 0]
            };`}
          >
            {" "}
          </div>
          {node.title}
        </button>
      ))}
    </div>
  );
};

export default NodeList;
