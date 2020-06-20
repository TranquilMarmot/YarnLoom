import React, { FunctionComponent, useCallback } from "react";
import {
  Graph,
  GraphData,
  GraphNode,
  GraphLink,
  GraphConfiguration,
} from "react-d3-graph";

import { YarnNode } from "loom-common/YarnNode";
import { getNodeByTitle } from "loom-common/YarnNode";
import { openNode } from "loom-common/EditorActions";

import { useYarnState } from "../state/YarnContext";
import NodeGraphView from "./NodeGraphView";

export type YarnGraphNode = GraphNode & { yarnNode: YarnNode };

/**
 * Given a list of nodes, will map them to nodes for react-d3-graph to render
 * @param nodes List of all nodes
 */
const mapNodesToGraphData = (
  nodes: YarnNode[]
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
  };
};

/** Base config to use for react-d3-graph */
const graphConfig: Partial<GraphConfiguration<GraphNode, GraphLink>> = {
  nodeHighlightBehavior: true,
  directed: true,
  width: 5000,
  height: 5000,
  collapsible: true,
  node: {
    size: 1500,
    fontSize: 1,
    renderLabel: false,
    highlightStrokeColor: "blue",
    viewGenerator: (node) => (
      <NodeGraphView node={(node as unknown) as YarnGraphNode} />
    ),
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

const NodeGraph: FunctionComponent = () => {
  const [state] = useYarnState();

  const graphRef = useCallback((node) => {
    if (node) {
      // react-d3-graph doesn't properly place the arrow markers in the right spot,
      // so once the graph is mounted we select all the markers and manually override their `refX` value
      // to place them a little higher up on the line... this isn't perfect but it works!
      const markerDomNodes = document.querySelectorAll("marker");
      markerDomNodes.forEach((markerNode: SVGMarkerElement) =>
        markerNode.setAttribute("refX", "125")
      );
    }
  }, []);

  if (!state?.nodes || state.nodes.length === 0) {
    return null;
  }

  return (
    <Graph
      ref={graphRef}
      id="yarn-node-graph"
      data={mapNodesToGraphData(state.nodes)}
      config={graphConfig}
      onDoubleClickNode={onNodeDoubleClicked}
    />
  );
};

export default NodeGraph;
