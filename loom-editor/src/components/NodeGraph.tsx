/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useCallback, useState } from "react";
import {
  Graph,
  GraphData,
  GraphNode,
  GraphLink,
  GraphConfiguration,
} from "react-d3-graph";

import { YarnNode } from "loom-common/YarnNode";
import { getNodeByTitle } from "loom-common/YarnNode";
import { openNode, setNodePosition } from "loom-common/EditorActions";

import { useYarnState } from "../state/YarnContext";
import NodeGraphView, { NodeSizePx } from "./NodeGraphView";
import NodeSearch from "./NodeSearch";
import { getNodes, getFocusedNode } from "../state/Selectors";
import { setFocusedNode } from "../state/UiActions";

const containerStyle = css`
  width: 100%;
  height: 100%;
`;

export type YarnGraphNode = GraphNode & { yarnNode: YarnNode };

/**
 * Given a list of nodes, will map them to nodes for react-d3-graph to render
 * @param nodes List of all nodes
 */
export const mapNodesToGraphData = (
  nodes: YarnNode[],
  focusedNodeId?: string
): GraphData<YarnGraphNode, GraphLink> => {
  return {
    nodes: nodes.map((node) => ({
      id: node.title,
      fx: node.position?.x,
      fy: node.position?.y,
      yarnNode: node,
    })),
    links: nodes.flatMap((node) =>
      (node.links || [])
        .map((link) => ({
          source: node.title,
          target: link,
        }))

        // filter out any links that aren't actually attached to a node (yet)
        .filter((link) => getNodeByTitle(nodes, link.target))
    ),
    focusedNodeId,
  };
};

/** Base config to use for react-d3-graph */
const graphConfig: Partial<GraphConfiguration<GraphNode, GraphLink>> = {
  nodeHighlightBehavior: true,
  directed: true,
  node: {
    size: NodeSizePx * 10, // for some reason, react-d3-graph has this *10
    fontSize: 1,
    renderLabel: false,
    highlightStrokeColor: "blue",
    mouseCursor: "grab",
    symbolType: "square",
    viewGenerator: (node) => (
      <NodeGraphView node={(node as unknown) as YarnGraphNode} />
    ),
    strokeWidth: 3.0,
  },
  link: {
    highlightColor: "lightblue",
  },
};

/**
 * Given the title of a node that was clicked, this will send a message
 * back to the extension to open the node up in the text editor.
 * @param nodeId ID (title) of the node that was clicked
 */
const onNodeDoubleClicked = (nodeId: string) =>
  window.vsCodeApi.postMessage(openNode(nodeId));

/**
 * Given the title and position of a node that was moved, this will send a message
 * back to the extension to change the node's position in the backing text document.
 * @param nodeId ID (title) of the node that was moved
 * @param x New X position of node
 * @param y New Y position of node
 */
const onNodePositionChange = (nodeId: string, x: number, y: number) =>
  window.vsCodeApi.postMessage(setNodePosition(nodeId, x, y));

const NodeGraph: FunctionComponent = () => {
  // state from the reducer
  const [state, dispatch] = useYarnState();

  // the size of the graph; this will actually be the width of the wrapper container
  // the defaults are what it initially renders with and just have to be "big enough"
  const [graphSize, setGraphSize] = useState({
    width: 2000,
    height: 2000,
  });

  const graphRef = useCallback((node) => {
    if (node) {
      // react-d3-graph doesn't properly place the arrow markers in the right spot,
      // so once the graph is mounted we select all the markers and manually override their `refX` value
      // to place them a little higher up on the line... this isn't perfect but it works!
      const markerDomNodes = document.querySelectorAll("marker");
      markerDomNodes.forEach((markerNode: SVGMarkerElement) =>
        markerNode.setAttribute("refX", "200")
      );
    }
  }, []);

  const containerRef = useCallback((containerNode) => {
    // this callback will set the graph size to the wrapper div's size
    // and also add a ResizeObserver that will listen for the wrapper resizing
    if (containerNode) {
      setGraphSize({
        width: containerNode.offsetWidth,
        height: containerNode.offsetHeight,
      });

      // @ts-ignore https://github.com/Microsoft/TypeScript/issues/28502
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.contentRect) {
            setGraphSize({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          }
        }
      });

      resizeObserver.observe(containerNode);
    }
  }, []);

  const nodes = getNodes(state);
  const focusedNode = getFocusedNode(state);

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} css={containerStyle}>
      <Graph
        ref={graphRef}
        id="yarn-node-graph"
        data={mapNodesToGraphData(nodes, focusedNode)}
        config={{ ...graphConfig, ...graphSize }}
        onDoubleClickNode={onNodeDoubleClicked}
        onNodePositionChange={onNodePositionChange}
        onClickGraph={() => dispatch(setFocusedNode(undefined))}
      />
      <NodeSearch />
    </div>
  );
};

export default NodeGraph;
