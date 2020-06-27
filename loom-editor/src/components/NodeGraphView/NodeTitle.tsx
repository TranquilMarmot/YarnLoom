/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import { deleteNode } from "loom-common/EditorActions";

import { ReactComponent as TrashIcon } from "../../icons/trash.svg";
import { ReactComponent as ColorIcon } from "../../icons/symbol-color.svg";

import NodeColorChooser from "./NodeColorChooser";

import { titleColors } from "./";

const titleStyle = css`
  padding: 10px;
  border: 1px solid grey;

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

/**
 * Given a color, determines if it is dark or light.
 * This can be used to change i.e. font color to be readable against different backgrounds.
 *
 * @param colorString String of color to determine darkness of; accepts both rgb(a) and hex
 * @returns true if the color is dark, false if it is light
 */
const isDark = (colorString: string): boolean => {
  // adapted from https://awik.io/determine-color-bright-dark-using-javascript/

  let r: number;
  let g: number;
  let b: number;

  // Check the format of the color, HEX or RGB?
  if (colorString.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    const parsed = colorString.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = Number.parseFloat(parsed![1]);
    g = Number.parseFloat(parsed![2]);
    b = Number.parseFloat(parsed![3]);
  } else {
    // from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      colorString
    );
    r = Number.parseInt(result![1], 16);
    g = Number.parseInt(result![2], 16);
    b = Number.parseInt(result![3], 16);
  }

  // HSP equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  return hsp <= 127.5;
};

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
