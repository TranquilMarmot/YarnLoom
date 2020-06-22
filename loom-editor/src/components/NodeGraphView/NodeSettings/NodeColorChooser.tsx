/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { titleColors } from "../index";
import { setNodeColor } from "loom-common/EditorActions";

const containerStyle = css`
  display: flex;
  flex-wrap: wrap;
`;

const buttonStyle = css`
  width: 35px;
  height: 35px;

  :hover {
    cursor: pointer;
  }
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
  );
};

export default NodeGraphViewColorChooser;
