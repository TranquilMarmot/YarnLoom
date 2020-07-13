import {
  parseYarnFile,
  getLinkedNodesFromNodeBody,
  buildLinksFromNodes,
} from "./YarnParser";
import type { YarnNode } from "./YarnNode";

describe("YarnParser", () => {
  const exampleYarnFile = `title: Start
tags: 
colorID: 0
position: 592,181
---
A: Hey, I'm a character in a script!
B: And I am too! You are talking to me!
-> What's going on
    A: Why this is a demo of the script system!
    B: And you're in it!
-> Um ok
A: How delightful!
B: What would you prefer to do next?
[[Leave|Leave]]
[[Learn more|LearnMore]]
===
title: Leave
tags: 
colorID: 0
position: 387,487
---
A: Oh, goodbye!
B: You'll be back soon!
===
title: LearnMore
tags: rawText
colorID: 0
position: 763,472
---
A: HAHAHA
===
`;

  const exampleNode0: YarnNode = {
    title: "Start",
    tags: "",
    colorID: 0,
    position: {
      x: 592,
      y: 181,
    },
    body: `A: Hey, I'm a character in a script!
B: And I am too! You are talking to me!
-> What's going on
    A: Why this is a demo of the script system!
    B: And you're in it!
-> Um ok
A: How delightful!
B: What would you prefer to do next?
[[Leave|Leave]]
[[Learn more|LearnMore]]
`,
    links: ["Leave", "LearnMore"],
  };

  const exampleNode1: YarnNode = {
    title: "Leave",
    tags: "",
    colorID: 0,
    position: {
      x: 387,
      y: 487,
    },
    body: `A: Oh, goodbye!
B: You'll be back soon!
`,
  };

  const exampleNode2: YarnNode = {
    title: "LearnMore",
    tags: "rawText",
    colorID: 0,
    position: {
      x: 763,
      y: 472,
    },
    body: `A: HAHAHA
`,
  };

  describe("parseYarnFile", () => {
    it("parses all nodes", () => {
      const parsed = parseYarnFile(exampleYarnFile);

      expect(parsed).toHaveLength(3);
      expect(parsed[0]).toEqual(exampleNode0);
      expect(parsed[1]).toEqual(exampleNode1);
      expect(parsed[2]).toEqual(exampleNode2);
    });
  });

  describe("getLinkedNodesFromBody", () => {
    it("gets links from a node body", () => {
      const links = getLinkedNodesFromNodeBody(exampleNode0.body);

      expect(links).toHaveLength(2);
      expect(links![0]).toEqual("Leave");
      expect(links![1]).toEqual("LearnMore");
    });

    it("gets un-names links", () => {
      const exampleBody = "[[Test]]";

      const links = getLinkedNodesFromNodeBody(exampleBody);

      expect(links).toHaveLength(1);
      expect(links![0]).toEqual("Test");
    });

    it("only counts unique links", () => {
      const exampleBody = `[[Test]]
[[Test]]
[[Test]]`;

      const links = getLinkedNodesFromNodeBody(exampleBody);

      expect(links).toHaveLength(1);
      expect(links![0]).toEqual("Test");
    });
  });

  describe("buildLinksFromNodes", () => {
    it("builds links", () => {
      // blank out the links we already have defined
      const exampleNode0WithoutLinks = {
        ...exampleNode0,
        links: undefined,
      };

      const exampleNodes = [
        exampleNode0WithoutLinks,
        exampleNode1,
        exampleNode2,
      ];

      // re-build all the links; this changes the object passed in :(
      buildLinksFromNodes(exampleNodes, true);

      // the example node should now have all the links
      expect(exampleNodes[0]).toEqual(exampleNode0);

      // these two should have been un-touched
      expect(exampleNodes[1]).toEqual(exampleNode1);
      expect(exampleNodes[2]).toEqual(exampleNode2);
    });

    it("auto-creates and returns new nodes if told to", () => {
      // exampleNode0 has two links out, so this should create two new nodes
      const exampleNodes = [exampleNode0];

      const newNodes = buildLinksFromNodes(exampleNodes, true);

      // two added nodes
      expect(exampleNodes).toHaveLength(3);

      expect(exampleNodes[0]).toEqual(exampleNode0);

      const blankNode1: YarnNode = {
        title: "Leave",
        tags: "",
        body: "\n",
      };

      const blankNode2: YarnNode = {
        title: "LearnMore",
        tags: "",
        body: "\n",
      };

      // should be the two added nodes
      expect([blankNode1, blankNode2]).toEqual(newNodes);

      // ... which should also be added to our node list
      expect(exampleNodes[1]).toEqual(blankNode1);
      expect(exampleNodes[2]).toEqual(blankNode2);
    });

    it("does not auto-create nodes if not told to", () => {
      // exampleNode0 has two links out
      const exampleNodes = [exampleNode0];

      const newNodes = buildLinksFromNodes(exampleNodes, false);

      expect(newNodes).toHaveLength(0);

      // no new nodes!
      expect(exampleNodes).toHaveLength(1);
    });
  });
});
