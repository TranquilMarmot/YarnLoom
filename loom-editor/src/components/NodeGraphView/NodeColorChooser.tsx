/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { titleColors } from "./index";

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
}

const NodeGraphViewColorChooser: FunctionComponent<NodeGraphViewColorChooserProps> = ({
  onClose,
}) => {
  const onChooseColor = () => {
    // TODO dispatch color change
    onClose();
  };

  return (
    <div css={containerStyle}>
      {titleColors.map((color) => (
        <button
          onClick={onChooseColor}
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
