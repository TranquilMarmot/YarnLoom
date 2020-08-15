/** @jsx jsx */
import { jsx, css } from "@emotion/core";
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

const extraZoomedOutContainerStyle = css`
  /* To make the node title render with the  */
  justify-content: start;
`;

const titleStyle = css`
  font-size: 32px;
  font-weight: 500;

  word-wrap: break-word;
  display: inline-block;

  width: ${NodeSizePx}px;
  max-height: 147px;
`;

const extraZoomedOutTitleStyle = css`
  ${titleStyle}

  font-size: 75px;
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
 * This is rendered instead of NodeWithBody when the graph is sufficiently zoomed out
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
    >
      <div
        css={
          extraZoomedOut
            ? css`
                ${extraZoomedOutTitleStyle}
                font-size: ${getFontSizePxForExtraZoomedOutTitle(
                  yarnNode.title.length
                )}px;
              `
            : titleStyle
        }
      >
        {yarnNode.title}
      </div>
      {!extraZoomedOut && (
        <div css={tagsContainerStyle}>
          {yarnNode.tags.split(" ").map(
            (tag) =>
              tag.length !== 0 && (
                <div key={`${yarnNode.title}-zoomed-${tag}`} css={tagStyle}>
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
