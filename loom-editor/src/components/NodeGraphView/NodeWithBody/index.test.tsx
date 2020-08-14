import React from "react";
import { renderWithProvider } from "../../../utils/test-utils";
import { screen, fireEvent } from "@testing-library/react";

import { YarnNode } from "loom-common/YarnNode";

import NodeWithBody from "./";

describe("<NodeWithBody />", () => {
  const mockNode: YarnNode = {
    title: "Mock Node",
    body: "Some body",
    tags: "cool tags",
  };

  const mockNodeColor = "blue";
  const mockNodeColorIsDark = true;

  it("renders", () => {
    renderWithProvider(
      <NodeWithBody
        yarnNode={mockNode}
        nodeColor={mockNodeColor}
        nodeColorIsDark={mockNodeColorIsDark}
      />
    );
  });

  it("renders no tags if there are none", () => {
    const nodeWithNoTags = {
      ...mockNode,
      tags: "",
    };
    renderWithProvider(
      <NodeWithBody
        yarnNode={nodeWithNoTags}
        nodeColor={mockNodeColor}
        nodeColorIsDark={mockNodeColorIsDark}
      />
    );
    expect(screen.queryByTestId("node-graph-view-tags")).toBeNull();
  });

  it("opens the color chooser", () => {
    renderWithProvider(
      <NodeWithBody
        yarnNode={mockNode}
        nodeColor={mockNodeColor}
        nodeColorIsDark={mockNodeColorIsDark}
      />
    );

    expect(screen.queryByTestId("node-title-color-chooser")).toBeNull();

    fireEvent.click(screen.getByTitle("Change node color"));

    expect(screen.queryByTestId("node-title-color-chooser")).not.toBeNull();
  });

  it("opens the tag chooser", () => {
    renderWithProvider(
      <NodeWithBody
        yarnNode={mockNode}
        nodeColor={mockNodeColor}
        nodeColorIsDark={mockNodeColorIsDark}
      />
    );

    expect(screen.queryByTestId("node-tag-chooser")).toBeNull();

    fireEvent.click(screen.getByTitle("Manage node tags"));

    expect(screen.queryByTestId("node-tag-chooser")).not.toBeNull();
  });
});
