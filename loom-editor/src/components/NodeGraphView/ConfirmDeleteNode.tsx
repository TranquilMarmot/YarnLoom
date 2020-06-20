/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { buttonBase } from "../../Styles";

interface ConfirmDeleteNodeProps {
  onClose: () => void;
}

const containerStyle = css`
  text-align: center;
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: space-around;

  margin-top: 10px;
`;

const buttonStyle = css`
  ${buttonBase}
  padding-left: 10px;
  padding-right: 10px;
`;

const ConfirmDeleteNode: FunctionComponent<ConfirmDeleteNodeProps> = ({
  onClose,
}) => {
  const onDeleteNode = () => {
    // TODO dispatch action to delete node
    onClose();
  };

  return (
    <div css={containerStyle}>
      <div>Delete node?</div>
      <div css={buttonContainerStyle}>
        <button css={buttonStyle} onClick={onDeleteNode}>
          <span role="img" aria-label="Confirm delete">
            ✔
          </span>{" "}
          Yes
        </button>
        <button css={buttonStyle} onClick={onClose}>
          <span role="img" aria-label="Cancel delete">
            ❌
          </span>{" "}
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteNode;
