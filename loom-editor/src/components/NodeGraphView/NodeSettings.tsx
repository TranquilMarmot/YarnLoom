/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState, Fragment } from "react";

import { buttonBase } from "../../Styles";

import NodeColorChooser from "./NodeColorChooser";
import ConfirmDeleteNode from "./ConfirmDeleteNode";

const containerStyle = css`
  position: absolute;
  left: 0px;
  top: 39px;

  height: 111px;
  width: 150px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  background: #c5c5c5d9;
`;

const buttonStyle = css`
  ${buttonBase}

  margin-left: 10px;
  margin-right: 10px;
`;

interface NodeSettingsProps {
  nodeTitle: string;
}

const NodeSettings: FunctionComponent<NodeSettingsProps> = ({ nodeTitle }) => {
  const [showingColorChooser, setShowingColorChooser] = useState(false);
  const [showingDeleteConfirm, setShowingDeleteConfirm] = useState(false);

  return (
    <div css={containerStyle}>
      {showingColorChooser && (
        <NodeColorChooser
          onClose={() => setShowingColorChooser(false)}
          nodeTitle={nodeTitle}
        />
      )}
      {showingDeleteConfirm && (
        <ConfirmDeleteNode
          onClose={() => setShowingDeleteConfirm(false)}
          nodeTitle={nodeTitle}
        />
      )}
      {!showingColorChooser && !showingDeleteConfirm && (
        <Fragment>
          <button
            css={buttonStyle}
            onClick={() => setShowingColorChooser(true)}
          >
            Change color
          </button>
          <button
            css={buttonStyle}
            onClick={() => setShowingDeleteConfirm(true)}
          >
            Delete
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default NodeSettings;
