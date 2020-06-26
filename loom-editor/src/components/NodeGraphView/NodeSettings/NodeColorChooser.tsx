/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { titleColors } from "../index";
import { buttonBase } from "../../../Styles";
import { setNodeColor } from "loom-common/EditorActions";

const containerStyle = css`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
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
    <div css={containerStyle}>
      <div css={buttonContainerStyle}>
        {titleColors.map((color, index) => (
          <button
            onClick={() => onChooseColor(index)}
            key={color}
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
