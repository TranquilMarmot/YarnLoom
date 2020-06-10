import React, { FunctionComponent } from "react";
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

const graphConfig: Partial<GraphConfiguration<GraphNode, GraphLink>> = {
  nodeHighlightBehavior: true,
  directed: true,
  width: 5000,
  height: 5000,
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

const onNodeDoubleClicked = (nodeId: string) =>
  window.vsCodeApi.postMessage(openNode(nodeId));

const NodeGraph: FunctionComponent = () => {
  const [state] = useYarnState();

  if (!state?.nodes || state.nodes.length === 0) {
    return null;
  }

  return (
    <Graph
      id="yarn-node-graph"
      data={mapNodesToGraphData(state.nodes)}
      config={graphConfig}
      onDoubleClickNode={onNodeDoubleClicked}
    />
  );
};

export default NodeGraph;
