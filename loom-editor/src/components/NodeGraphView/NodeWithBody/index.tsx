import React, { Fragment, FunctionComponent, useState } from "react";

import { YarnNode } from "loom-common/YarnNode";

import NodeHeader from "./NodeHeader";
import NodeFooter from "./NodeFooter";
import NodeBody from "./NodeBody";
import NodeColorChooser from "./NodeColorChooser";
import NodeTagChooser from "./NodeTagChooser";

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

interface NodeWithBodyProps {
  yarnNode: YarnNode;
  nodeColor: string;
  nodeColorIsDark: boolean;
}

const NodeWithBody: FunctionComponent<NodeWithBodyProps> = ({
  yarnNode,
  nodeColor,
  nodeColorIsDark,
}) => {
  const [colorChooserOpen, setColorChooserOpen] = useState(false);
  const [tagChooserOpen, setTagChooserOpen] = useState(false);

  const { title } = yarnNode;

  return (
    <Fragment>
      <NodeHeader
        title={title}
        nodeColor={nodeColor}
        nodeColorIsDark={nodeColorIsDark}
        onOpenColorChooser={() => setColorChooserOpen(!colorChooserOpen)}
      />
      {renderBody(
        colorChooserOpen,
        () => setColorChooserOpen(false),
        tagChooserOpen,
        () => setTagChooserOpen(false),
        yarnNode
      )}
      <NodeFooter
        node={yarnNode}
        nodeColor={nodeColor}
        nodeColorIsDark={nodeColorIsDark}
        onOpenTagChooser={() => setTagChooserOpen(true)}
        data-testid="node-graph-view-tags"
      />
    </Fragment>
  );
};

export default NodeWithBody;
