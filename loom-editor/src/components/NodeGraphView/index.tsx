/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import { useYarnState } from "../../state/YarnContext";
import {
  getSearchingTitle,
  getSearchingBody,
  getSearchingTags,
  getSearchString,
} from "../../state/Selectors";

import { YarnGraphNode } from "../NodeGraph";
import NodeTitle from "./NodeTitle";
import NodeTags from "./NodeTags";
import NodeBody from "./NodeBody";
import NodeColorChooser from "./NodeColorChooser";
import { YarnNode } from "loom-common/YarnNode";
import NodeTagChooser from "./NodeTagChooser";

/** CSS colors to cycle through for the "colorID" of a yarn node */
export const titleColors = [
  "#EBEBEB",
  "#6EA5E0",
  "#9EDE74",
  "#FFE374",
  "#F7A666",
  "#C47862",
  "#97E1E9",
  "#576574",
  "#000000",
];

/** The width and height of the node's wrapper container */
export const NodeSizePx = 200;

const containerStyle = css`
  background: white;
  color: black;

  /* Subtract 2 here to compensate for the 1px of border on each side */
  width: ${NodeSizePx - 2}px;
  height: ${NodeSizePx - 2}px;

  border: 1px solid var(--vscode-panelSection-border);

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto;
`;

/** This style is used if the user is searching and this node does NOT match the current search criteria */
const dimmedStyle = css`
  > * {
    background-color: rgba(1, 1, 1, 0.5) !important;
    color: rgba(1, 1, 1, 0.6) !important;
  }
`;

interface NodeGraphViewProps {
  node: YarnGraphNode;
}

/**
 * Render tha body of the node.
 * If the color or tag chooser are open, those are rendered instead.
 * (because of rendering bugs on Ubuntu, we have to render them instead of the body...)
 *
 * @param colorChooserOpen Whether or not the color chooser is open
 * @param closeColorChooser Function to call to open the color chooser
 * @param tagChooserOpen Whether or not the tag chooser is open
 * @param closeTagChooser Function to call to close the tag chooser
 * @param node Node to render body for
 */
const renderBody = (
  colorChooserOpen: boolean,
  closeColorChooser: () => void,
  tagChooserOpen: boolean,
  closeTagChooser: () => void,
  node: YarnNode
) => {
  const { title, body } = node;

  if (colorChooserOpen) {
    return <NodeColorChooser onClose={closeColorChooser} nodeTitle={title} />;
  }

  if (tagChooserOpen) {
    return <NodeTagChooser onClose={closeTagChooser} node={node} />;
  }

  return <NodeBody body={body} />;
};

const NodeGraphView: FunctionComponent<NodeGraphViewProps> = ({
  node: { yarnNode },
}) => {
  const [state] = useYarnState();
  const [colorChooserOpen, setColorChooserOpen] = useState(false);
  const [tagChooserOpen, setTagChooserOpen] = useState(false);

  const { colorID, title, body, tags } = yarnNode;

  if (!state) {
    return null;
  }

  const searchingTitle = getSearchingTitle(state);
  const searchingBody = getSearchingBody(state);
  const searchingTags = getSearchingTags(state);
  const searchString = getSearchString(state);

  // if we're searching for something, and this node matches that something,
  // then this will be true... if this is false, the node is rendered as "dimmed"
  const searched =
    (!searchingTitle && !searchingBody && !searchingTags) || // no search active
    (searchingTitle && title.includes(searchString)) ||
    (searchingBody && body.includes(searchString)) ||
    (searchingTags && tags.includes(searchString));

  return (
    <div
      css={css`${containerStyle}${!searched && dimmedStyle}`}
      data-testid={
        searched ? "node-graph-view-searched" : "node-graph-view-not-searched"
      }
    >
      <NodeTitle
        title={title}
        colorID={colorID}
        onOpenColorChooser={() => setColorChooserOpen(!colorChooserOpen)}
      />
      {renderBody(
        colorChooserOpen,
        () => setColorChooserOpen(false),
        tagChooserOpen,
        () => setTagChooserOpen(false),
        yarnNode
      )}
      <NodeTags
        node={yarnNode}
        colorId={colorID}
        onOpenTagChooser={() => setTagChooserOpen(true)}
        data-testid="node-graph-view-tags"
      />
    </div>
  );
};

export default NodeGraphView;
