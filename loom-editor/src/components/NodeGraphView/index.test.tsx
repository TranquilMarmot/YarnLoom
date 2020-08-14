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

  describe("searching", () => {
    it("renders searched when nothing is being searched for", () => {
      // this renders as "searched" because it should show as active
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: false,
          searchingBody: false,
          searchingTags: false,
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
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
          caseSensitivityEnabled: false,
          regexEnabled: false,
          searchString: "Some",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders searched when searching by regex", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: true,
          searchingTags: true,
          caseSensitivityEnabled: false,
          regexEnabled: true,
          searchString: "mock.*node",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders searched when searching by case sensitive regex", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: true,
          searchingTags: true,
          caseSensitivityEnabled: true,
          regexEnabled: true,
          searchString: "Mock.*Node",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders NOT searched when searching by case sensitive regex", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: true,
          searchingTags: true,
          caseSensitivityEnabled: true,
          regexEnabled: true,
          searchString: "mock.*node",
        },
      });

      screen.getByTestId("node-graph-view-not-searched");
    });

    it("renders searched when searching with case sensitivity on", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: true,
          searchingTags: true,
          caseSensitivityEnabled: true,
          regexEnabled: false,
          searchString: "Mock Node",
        },
      });

      screen.getByTestId("node-graph-view-searched");
    });

    it("renders NOT searched when searching with case sensitivity on", () => {
      renderWithProvider(<NodeGraphView node={mockNode} />, {
        nodes: [],
        search: {
          searchingTitle: true,
          searchingBody: true,
          searchingTags: true,
          caseSensitivityEnabled: true,
          regexEnabled: false,
          searchString: "mock node",
        },
      });

      screen.getByTestId("node-graph-view-not-searched");
    });
  });
});
