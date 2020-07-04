import { createNodeText, parseNodeText, getNodeByTitle } from "./YarnNode";
import type { YarnNode } from "./YarnNode";

describe("YarnNode", () => {
  // this should match `exampleNodeText` below
  const exampleNode: YarnNode = {
    title: "Cool Title",
    tags: "some tags",
    body: "Some text.\nIn the body.\nOf the node.",
    position: {
      x: 1234,
      y: 5678,
    },
    colorID: 3,
  };

  // this should match `exampleNode` above
  const exampleNodeText = `title: Cool Title
tags: some tags
position: 1234,5678
colorID: 3
---
Some text.
In the body.
Of the node.
===`;

  describe("createNodeText", () => {
    it("creates node text", () => {
      const nodeText = createNodeText(exampleNode);
      expect(nodeText).toEqual(exampleNodeText);
    });
  });

  describe("parseNodeText", () => {
    it("parses node text", () => {
      const parsedNode = parseNodeText(exampleNodeText);
      expect(parsedNode).toEqual(exampleNode);
    });
  });

  describe("getNodeByTitle", () => {
    it("gets a node by title", () => {
      const firstNode: YarnNode = {
        title: "Title 1",
        tags: "",
        body: "Body",
      };

      const secondNode: YarnNode = {
        title: "Title 2",
        tags: "",
        body: "Body",
      };
      const nodes: YarnNode[] = [firstNode, secondNode];

      expect(getNodeByTitle(nodes, firstNode.title)).toEqual(firstNode);
      expect(getNodeByTitle(nodes, secondNode.title)).toEqual(secondNode);
    });
  });
});
