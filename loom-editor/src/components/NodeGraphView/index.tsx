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
import NodeColorChooser from "./NodeColorChooser";
import NodeTitle from "./NodeTitle";
import NodeTags from "./NodeTags";
import NodeBody from "./NodeBody";

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
  width: ${NodeSizePx}px;
  height: ${NodeSizePx}px;

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

const NodeGraphView: FunctionComponent<NodeGraphViewProps> = ({
  node: {
    yarnNode: { colorID, title, body, tags },
  },
}) => {
  const [state] = useYarnState();
  const [colorChooserOpen, setColorChooserOpen] = useState(false);

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
    <div css={css`${containerStyle}${!searched && dimmedStyle}`}>
      <NodeTitle title={title} colorID={colorID} />
      <NodeBody body={body} tags={tags} />
      {tags && <NodeTags tags={tags} colorId={colorID} />}

      {colorChooserOpen && (
        <NodeColorChooser
          nodeTitle={title}
          onClose={() => setColorChooserOpen(false)}
        />
      )}
    </div>
  );
};

export default NodeGraphView;
