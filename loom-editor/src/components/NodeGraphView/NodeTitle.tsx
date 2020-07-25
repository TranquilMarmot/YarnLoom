/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { deleteNode, renameNode } from "loom-common/EditorActions";

import { ReactComponent as RenameIcon } from "../../icons/rename.svg";
import { ReactComponent as TrashIcon } from "../../icons/trash.svg";
import { ReactComponent as ColorIcon } from "../../icons/symbol-color.svg";
import { isDark } from "../../Util";

import { titleColors } from "./";

const titleStyle = css`
  padding: 10px;

  grid-row: 1 / 2;

  display: flex;
  justify-content: space-between;
`;

const titleLabelStyle = css`
  flex: 1;
`;

const settingsButtonStyle = css`
  background: none;
  border: none;

  padding-top: 0;
  padding-bottom: 0;

  :hover {
    cursor: pointer;
  }
`;

interface NodeTitleProps {
  title: string;
  colorID?: number;
  onOpenColorChooser: () => void;
}

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  title,
  colorID,
  onOpenColorChooser,
}) => {
  // grab the color by its ID and determine if it is dark or not
  const color = titleColors[colorID || 0];
  const fontColor = isDark(color) ? "white" : "black";

  const fontStyle = css`
    color: ${fontColor};
  `;

  const iconStyle = css`
    fill: ${fontColor};
  `;

  return (
    <div
      css={css`
        ${titleStyle}
        ${fontStyle}
        background-color: ${color}
      `}
    >
      <div css={css`${titleLabelStyle}${fontStyle}`}>{title}</div>
      <button
        css={settingsButtonStyle}
        onClick={() => window.vsCodeApi.postMessage(renameNode(title))}
        aria-label="Rename node"
      >
        <RenameIcon css={iconStyle} />
      </button>
      <button
        css={settingsButtonStyle}
        onClick={onOpenColorChooser}
        aria-label="Change node color"
      >
        <ColorIcon css={iconStyle} />
      </button>
      <button
        css={settingsButtonStyle}
        onClick={() => window.vsCodeApi.postMessage(deleteNode(title))}
        aria-label="Delete node"
      >
        <TrashIcon css={iconStyle} />
      </button>
    </div>
  );
};

export default NodeTitle;
