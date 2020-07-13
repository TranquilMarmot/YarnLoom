import { mapNodesToGraphData } from "./NodeGraph";
import { YarnNode } from "loom-common/YarnNode";

describe("<NodeGraph />", () => {
  describe("mapNodesToGraphData", () => {
    it("maps nodes to graph data", () => {
      const mockNodes: YarnNode[] = [
        {
          title: "Some Node",
          body: "Some body",
          tags: "some tags",
          position: {
            x: 1234,
            y: 5678,
          },
          links: [
            "Some Other Node",

            // this gets filtered out since it's pointing to a node that does not exist
            // react-d3-graph will complain if you have a link pointing to something that doesn't exist
            "A Nonexistant Node",
          ],
        },
        {
          title: "Some Other Node",
          body: "Some other body",
          tags: "some other tags",
          position: {
            x: 5678,
            y: 1234,
          },
        },
      ];

      expect(mapNodesToGraphData(mockNodes, "Some Node")).toEqual({
        nodes: [
          {
            id: "Some Node",
            fx: 1234,
            fy: 5678,
            yarnNode: mockNodes[0],
          },

          {
            id: "Some Other Node",
            fx: 5678,
            fy: 1234,
            yarnNode: mockNodes[1],
          },
        ],
        links: [
          {
            source: "Some Node",
            target: "Some Other Node",
          },
        ],
        focusedNodeId: "Some Node",
      });
    });
  });
});
