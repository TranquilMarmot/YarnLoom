import React from "react";
import { render, screen } from "@testing-library/react";

import { YarnNode } from "loom-common/YarnNode";

import ZoomedOutNode from "./ZoomedOutNode";

describe("<ZoomedOutNode />", () => {
  const mockNode: YarnNode = {
    title: "Mock Node",
    body: "Some body",
    tags: "cool tags",
  };

  it("renders", () => {
    render(
      <ZoomedOutNode
        yarnNode={mockNode}
        nodeColor={"blue"}
        nodeColorIsDark={true}
        currentZoom={0.5}
      />
    );
  });

  it("shows tags when not super zoomed out", () => {
    render(
      <ZoomedOutNode
        yarnNode={mockNode}
        nodeColor={"blue"}
        nodeColorIsDark={true}
        currentZoom={0.5}
      />
    );

    // 2 because we have "cool tags" in our mock node
    expect(screen.queryAllByTestId("zoomed-out-node-tag")).toHaveLength(2);
  });

  it("hides tags when really zoomed out", () => {
    render(
      <ZoomedOutNode
        yarnNode={mockNode}
        nodeColor={"blue"}
        nodeColorIsDark={true}
        currentZoom={0.005}
      />
    );

    // these don't render if we're REALLY zoomed out
    expect(screen.queryAllByTestId("zoomed-out-node-tag")).toHaveLength(0);
  });
});
