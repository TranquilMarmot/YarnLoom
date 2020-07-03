/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import { deleteNode } from "loom-common/EditorActions";

import { ReactComponent as TrashIcon } from "../../icons/trash.svg";
import { ReactComponent as ColorIcon } from "../../icons/symbol-color.svg";
import { isDark } from "../../Util";

import NodeColorChooser from "./NodeColorChooser";

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
}

const NodeTitle: FunctionComponent<NodeTitleProps> = ({ title, colorID }) => {
  const [colorChooserOpen, setColorChooserOpen] = useState(false);

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
        onClick={() => setColorChooserOpen(!colorChooserOpen)}
      >
        <ColorIcon css={iconStyle} />
      </button>
      <button
        css={settingsButtonStyle}
        onClick={() => window.vsCodeApi.postMessage(deleteNode(title))}
      >
        <TrashIcon css={iconStyle} />
      </button>

      {colorChooserOpen && (
        <NodeColorChooser
          nodeTitle={title}
          onClose={() => setColorChooserOpen(false)}
        />
      )}
    </div>
  );
};

export default NodeTitle;
