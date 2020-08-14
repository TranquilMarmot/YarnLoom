/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { setNodeColor } from "loom-common/EditorActions";

import { nodeColors } from "../index";
import { buttonBase, nodeOverlayContainer } from "../../../Styles";

const containerStyle = css`
  ${nodeOverlayContainer}

  justify-content: space-around;
`;

const buttonContainerStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const buttonStyle = css`
  width: 35px;
  height: 35px;

  :hover {
    cursor: pointer;
  }
`;

const cancelButtonStyle = css`
  ${buttonBase}

  width: 50%;
  padding: 5px;
`;

interface NodeGraphViewColorChooserProps {
  onClose: () => void;
  nodeTitle: string;
}

const NodeGraphViewColorChooser: FunctionComponent<NodeGraphViewColorChooserProps> = ({
  onClose,
  nodeTitle,
}) => {
  const onChooseColor = (colorIndex: number) => {
    window.vsCodeApi.postMessage(setNodeColor(nodeTitle, colorIndex));
    onClose();
  };

  return (
    <div css={containerStyle} data-testid="node-title-color-chooser">
      <div css={buttonContainerStyle}>
        {nodeColors.map((color, index) => (
          <button
            onClick={() => onChooseColor(index)}
            key={color}
            aria-label={`Choose color ${index}`}
            css={css`
            ${buttonStyle}
            background-color: ${color};
          `}
          >
            {" "}
          </button>
        ))}
      </div>
      <button css={cancelButtonStyle} onClick={onClose}>
        Cancel
      </button>
    </div>
  );
};

export default NodeGraphViewColorChooser;
