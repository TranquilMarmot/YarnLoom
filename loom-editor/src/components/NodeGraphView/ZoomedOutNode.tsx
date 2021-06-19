/** @jsxImportSource @emotion/react */
import { css } from "@emotion/core";
import { FunctionComponent } from "react";

import { YarnNode } from "loom-common/YarnNode";

// NOTE: This is also defined in NodeGraphView, but it cannot be imported because
// something funny happens when the package is built and it gets erased 💥
export const NodeSizePx = 200;

/** The zoom distance at which to switch to "real big' fonts */
const ExtraZoomedOutNodeDistance = 0.2;

const containerStyle = css`
  grid-row: 1 / 3; /* fills the whole container */

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: ${NodeSizePx}px;
`;

const titleStyle = css`
  font-size: 32px;
  font-weight: 500;

  word-wrap: break-word;
  display: inline-block;

  width: ${NodeSizePx}px;
  max-height: 147px;
`;

/** Used when we're "extra" zoomed out and only showing the title (not the tags) */
const extraZoomedOutTitleStyle = css`
  ${titleStyle}

  max-height: 100%;
`;

const tagsContainerStyle = css`
  width: ${NodeSizePx}px;
  font-size: 22px;
  margin-top: 15px;

  display: flex;
  flex-wrap: wrap;
`;

const tagStyle = css`
  background-color: var(--vscode-button-background);
  color: var(--vscode-button-foreground);

  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 5px;
  padding-right: 5px;

  margin: 2px;
`;

interface ZoomedOutNodeProps {
  yarnNode: YarnNode;
  nodeColor: string;
  nodeColorIsDark: boolean;
  currentZoom: number;
}

/**
 * This is a bad approximation of the correct font-size for when showing the
 * "extra zoomed out" node. This isn't pretty but it works Good Enough™.
 *
 * @param titleLength Length of title
 */
const getFontSizePxForExtraZoomedOutTitle = (titleLength: number): number => {
  if (titleLength > 40) {
    return 36;
  }

  if (titleLength > 30) {
    return 45;
  }

  if (titleLength >= 15) {
    return 50;
  }

  if (titleLength >= 12) {
    return 70;
  }

  return 75;
};

/**
 * Get the style to use for the title string.
 *
 * @param extraZoomedOut Whether or not we're currently "extra" zoomed out
 * @param nodeTitleLength The length of the title string
 */
const getTitleStyle = (extraZoomedOut: boolean, nodeTitleLength: number) => {
  // not extra zoomed out; return the regular style
  if (!extraZoomedOut) {
    return titleStyle;
  }

  // calculate our font size for the extra-zoomed-out title
  return css`
    ${extraZoomedOutTitleStyle}
    font-size: ${getFontSizePxForExtraZoomedOutTitle(nodeTitleLength)}px;
  `;
};

/**
 * This is rendered instead of NodeWithBody when the graph is sufficiently zoomed out.
 * By default, this shows tags. When zoomed out even further, it hides the tags.
 */
const ZoomedOutNode: FunctionComponent<ZoomedOutNodeProps> = ({
  yarnNode,
  nodeColor,
  nodeColorIsDark,
  currentZoom,
}) => {
  const fontColor = nodeColorIsDark ? "white" : "black";

  const extraZoomedOut = currentZoom <= ExtraZoomedOutNodeDistance;

  return (
    <div
      css={css`
        ${containerStyle}
        background-color: ${nodeColor};
        color: ${fontColor};
      `}
      data-testid="zoomed-out-node"
    >
      <div css={getTitleStyle(extraZoomedOut, yarnNode.title.length)}>
        {yarnNode.title}
      </div>

      {/* Don't show tags if we're zoomed out far enough */}
      {!extraZoomedOut && (
        <div css={tagsContainerStyle}>
          {yarnNode.tags.split(" ").map(
            (tag) =>
              tag.length !== 0 && (
                <div
                  key={`${yarnNode.title}-zoomed-${tag}`}
                  css={tagStyle}
                  data-testid="zoomed-out-node-tag"
                >
                  {tag}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default ZoomedOutNode;
