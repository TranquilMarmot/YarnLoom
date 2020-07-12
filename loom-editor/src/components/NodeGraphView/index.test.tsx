import React from "react";
import { renderWithProvider } from "../../utils/test-utils";
import { screen } from "@testing-library/react";

import NodeGraphView from "./";
import { YarnGraphNode } from "../NodeGraph";

describe("<NodeGraphView />", () => {
  const mockNode: YarnGraphNode = {
    id: "Mock Node",
    yarnNode: {
      title: "Mock Node",
      body: "Some body",
      tags: "cool tags",
    },
  };

  it("renders", () => {
    renderWithProvider(<NodeGraphView node={mockNode} />);
  });

  it("renders no tags if there are none", () => {
    const nodeWithNoTags = {
      ...mockNode,
      yarnNode: {
        ...mockNode.yarnNode,
        tags: "",
      },
    };
    renderWithProvider(<NodeGraphView node={nodeWithNoTags} />);
    expect(screen.queryByTestId("node-graph-view-tags")).toBeNull();
  });

  describe("searching", () => {
    it("renders searched when nothing is being searched for", () => {
      // this renders as "searched" because it should show as active
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: false,
          searchingBody: false,
          searchingTags: false,
          searchString: "",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders searched when searching for part of the title", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: false,
          searchingTags: false,
          searchString: "Mock",
        },
      });
      screen.getByTestId("node-graph-view-searched");
    });

    it("renders NOT searched when searching for a different title", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: false,
          searchingTags: false,
          searchString: "A different title",
        },
      });

      screen.getByTestId("node-graph-view-not-searched");
    });

    it("renders searched when searching for part of the body", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: false,
          searchingBody: true,
          searchingTags: false,
          searchString: "body",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders NOT searched when searching for a different body", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: false,
          searchingBody: true,
          searchingTags: false,
          searchString: "A different body",
        },
      });

      screen.getByTestId("node-graph-view-not-searched");
    });

    it("renders searched when searching for part of the tags", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: false,
          searchingBody: false,
          searchingTags: true,
          searchString: "tags",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders NOT searched when searching for different tags", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: false,
          searchingBody: true,
          searchingTags: false,
          searchString: "other-tags",
        },
      });

      screen.getByTestId("node-graph-view-not-searched");
    });

    it("renders searched when searching for everything and something matches", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: true,
          searchingTags: true,
          searchString: "Some",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });
  });
});
