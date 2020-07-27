/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { deleteNode, renameNode } from "loom-common/EditorActions";

import { ReactComponent as RenameIcon } from "../../icons/rename.svg";
import { ReactComponent as TrashIcon } from "../../icons/trash.svg";
import { ReactComponent as ColorIcon } from "../../icons/symbol-color.svg";

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

  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`;

interface NodeTitleProps {
  title: string;
  nodeColor: string;
  nodeColorIsDark: boolean;
  onOpenColorChooser: () => void;
}

const NodeTitle: FunctionComponent<NodeTitleProps> = ({
  title,
  nodeColor,
  nodeColorIsDark,
  onOpenColorChooser,
}) => {
  const fontColor = nodeColorIsDark ? "white" : "black";

  const fontStyle = css`
    color: ${fontColor};
  `;

  const iconFillStyle = css`
    fill: ${fontColor};
  `;

  const iconStrokeStyle = css`
    stroke: ${fontColor};
  `;

  return (
    <div
      css={css`
        ${titleStyle}
        ${fontStyle}
        background-color: ${nodeColor}
      `}
    >
      <div css={css`${titleLabelStyle}${fontStyle}`}>{title}</div>
      <button
        css={settingsButtonStyle}
        onClick={() => window.vsCodeApi.postMessage(renameNode(title))}
        aria-label="Rename node"
      >
        <RenameIcon css={iconStrokeStyle} />
      </button>
      <button
        css={settingsButtonStyle}
        onClick={onOpenColorChooser}
        aria-label="Change node color"
      >
        <ColorIcon css={iconFillStyle} />
      </button>
      <button
        css={settingsButtonStyle}
        onClick={() => window.vsCodeApi.postMessage(deleteNode(title))}
        aria-label="Delete node"
      >
        <TrashIcon css={iconFillStyle} />
      </button>
    </div>
  );
};

export default NodeTitle;
