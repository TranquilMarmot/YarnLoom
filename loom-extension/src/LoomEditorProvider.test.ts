import LoomEditorProvider from "./LoomEditorProvider";
import * as vscode from "vscode";
import { YarnNode, createNodeText } from "loom-common/YarnNode";
import { parseYarnFile } from "loom-common/YarnParser";

// for asserting functions are called properly
const vscodeMock = require("../__mocks__/vscode");

describe("LoomEditorProvider", () => {
  const mockContext: vscode.ExtensionContext = ({
    extensionPath: "some-extension-path",
  } as unknown) as vscode.ExtensionContext;

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

  let provider: LoomEditorProvider;

  beforeEach(() => {
    provider = new LoomEditorProvider(mockContext);

    provider.document = ({
      getText: () => exampleYarnFile,
      uri: "some-document-uri",
    } as unknown) as vscode.TextDocument;

    provider.webviewPanel = ({
      webview: {
        postMessage: jest.fn(),
      } as any,
    } as unknown) as vscode.WebviewPanel;

    provider.nodes = parseYarnFile(exampleYarnFile);
  });

  describe("getRangeForNode", () => {
    it("gets the proper range", () => {
      // NOTE: this returns a new "Range" object, which we have mocked out in `__mocks__/vscode.ts`
      // which is why we're asserting what it does in a pretty weird way
      provider.getRangeForNode("Start");
      provider.getRangeForNode("Leave");
      provider.getRangeForNode("LearnMore");

      expect(vscodeMock.Range).toHaveBeenNthCalledWith(1, 0, 0, 15, 3);
      expect(vscodeMock.Range).toHaveBeenNthCalledWith(2, 16, 0, 23, 3);
      expect(vscodeMock.Range).toHaveBeenNthCalledWith(3, 24, 0, 30, 3);
    });
  });

  describe("updateNode", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("updates the node", () => {
      const updatedNode: YarnNode = {
        title: "Start",
        body: "New Body",
        tags: "new tags",
      };

      provider.updateNode("Start", updatedNode);

      // underlying nodes should have been updated
      expect(provider.nodes[0]).toEqual(updatedNode);

      // no new nodes should have been added
      expect(provider.nodes).toHaveLength(3);

      // and a workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);
      expect(workspaceEditReplaceMock).toHaveBeenCalledWith(
        provider.document?.uri,
        provider.getRangeForNode("Start"),
        createNodeText(updatedNode)
      );

      // since we didn't add any new nodes, this should not have been called
      const workspaceEditInsertMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.insert;
      expect(workspaceEditInsertMock).toHaveBeenCalledTimes(0);
    });

    it("changes titles", () => {
      const updatedNode: YarnNode = {
        title: "New Title for Start Node",
        body: "New Body",
        tags: "new tags",
      };

      // we're calling with the original "Start" but updating its title
      provider.updateNode("Start", updatedNode);

      // underlying nodes should have been updated
      expect(provider.nodes[0]).toEqual(updatedNode);

      // no new nodes should have been added
      expect(provider.nodes).toHaveLength(3);

      // and a workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);
      expect(workspaceEditReplaceMock).toHaveBeenCalledWith(
        provider.document?.uri,
        provider.getRangeForNode("Start"),
        createNodeText(updatedNode)
      );

      // since we didn't add any new nodes, this should not have been called
      const workspaceEditInsertMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.insert;
      expect(workspaceEditInsertMock).toHaveBeenCalledTimes(0);
    });

    it("adds new nodes when there are new links", () => {
      // this node links out to "New Node" which should be created
      const updatedNode: YarnNode = {
        title: "Start",
        body: "New Body\n[[With a new Link|New Node]]",
        tags: "new tags",
      };

      // update the node to pick up the new text
      provider.updateNode("Start", updatedNode);

      // underlying nodes should have been updated
      expect(provider.nodes[0]).toEqual(updatedNode);

      // new node was added! originally we had 3
      expect(provider.nodes).toHaveLength(4);

      // and a workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);
      expect(workspaceEditReplaceMock).toHaveBeenCalledWith(
        provider.document?.uri,
        provider.getRangeForNode("Start"),
        createNodeText(updatedNode)
      );

      // since we didn't add any new nodes, this should not have been called
      const workspaceEditInsertMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.insert;
      expect(workspaceEditInsertMock).toHaveBeenCalledTimes(1);
      expect(workspaceEditInsertMock).toHaveBeenCalledWith(
        provider.document?.uri,
        {},
        `${createNodeText({
          title: "New Node",
          body: "",
          tags: "",
        })}\n`
      );
    });

    it("adds new nodes by title", () => {
      const newNodeTitle = "A Whole New Node";

      provider.addNewNode(newNodeTitle);

      // new node was added! originally we had 3
      expect(provider.nodes).toHaveLength(4);

      // and a workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      // this should have been called once to add the new node
      const workspaceEditInsertMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.insert;
      expect(workspaceEditInsertMock).toHaveBeenCalledTimes(1);
      expect(workspaceEditInsertMock).toHaveBeenCalledWith(
        provider.document?.uri,
        {},
        `${createNodeText({
          title: newNodeTitle,
          body: "\n",
          tags: "",
        })}\n`
      );
    });
  });

  describe("renameNode", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("renames a node and updates any links to it", () => {
      const newNodeTitle = "New Name";

      provider.renameNode("LearnMore", newNodeTitle);

      // a new workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      // this should have been called twice; once to rename the node and once to update the link to it
      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(2);

      // renaming LearnMore -> A Whole New Node
      expect(workspaceEditReplaceMock).toHaveBeenNthCalledWith(
        1,
        provider.document?.uri,
        {},
        `${createNodeText({
          title: newNodeTitle,
          body: "A: HAHAHA",
          tags: "rawText",
          position: {
            x: 763,
            y: 472,
          },
        })}`
      );

      // updating the link from the Start node
      expect(workspaceEditReplaceMock).toHaveBeenNthCalledWith(
        2,
        provider.document?.uri,
        {},
        `${createNodeText({
          title: "Start",
          body: `A: Hey, I'm a character in a script!
B: And I am too! You are talking to me!
-> What's going on
    A: Why this is a demo of the script system!
    B: And you're in it!
-> Um ok
A: How delightful!
B: What would you prefer to do next?
[[Leave|Leave]]
[[Learn more|${newNodeTitle}]]`,
          tags: "",
          position: {
            x: 592,
            y: 181,
          },
        })}`
      );
    });
  });

  describe("addTagsToNode", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("adds tags to a node", () => {
      provider.addTagsToNode("LearnMore", "some cool tags");

      // a new workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      // this should have been called twice; once to rename the node and once to update the link to it
      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);

      // renaming LearnMore -> A Whole New Node
      expect(workspaceEditReplaceMock).toHaveBeenNthCalledWith(
        1,
        provider.document?.uri,
        {},
        `${createNodeText({
          title: "LearnMore",
          body: "A: HAHAHA",
          tags: "rawText some cool tags",
          position: {
            x: 763,
            y: 472,
          },
        })}`
      );
    });

    it("only adds tags that the node doesn't already have", () => {
      provider.addTagsToNode("LearnMore", "some rawText rawText rawText");

      // a new workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      // this should have been called twice; once to rename the node and once to update the link to it
      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);

      // renaming LearnMore -> A Whole New Node
      expect(workspaceEditReplaceMock).toHaveBeenNthCalledWith(
        1,
        provider.document?.uri,
        {},
        `${createNodeText({
          title: "LearnMore",
          body: "A: HAHAHA",
          tags: "rawText some",
          position: {
            x: 763,
            y: 472,
          },
        })}`
      );
    });
  });

  describe("toggleTagsOnNode", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("adds tags if they don't already exist on the node", () => {
      provider.toggleTagsOnNode("LearnMore", "tag");

      // a new workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      // this should have been called twice; once to rename the node and once to update the link to it
      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);

      // renaming LearnMore -> A Whole New Node
      expect(workspaceEditReplaceMock).toHaveBeenNthCalledWith(
        1,
        provider.document?.uri,
        {},
        `${createNodeText({
          title: "LearnMore",
          body: "A: HAHAHA",
          tags: "rawText tag",
          position: {
            x: 763,
            y: 472,
          },
        })}`
      );
    });

    it("removes tag if they already exist on the node", () => {
      provider.toggleTagsOnNode("LearnMore", "rawText");

      // a new workspace edit should have been created and applied
      expect(vscodeMock.WorkspaceEdit).toHaveBeenCalledTimes(1);

      // this should have been called twice; once to rename the node and once to update the link to it
      const workspaceEditReplaceMock =
        vscodeMock.WorkspaceEdit.mock.results[0].value.replace;
      expect(workspaceEditReplaceMock).toHaveBeenCalledTimes(1);

      // renaming LearnMore -> A Whole New Node
      expect(workspaceEditReplaceMock).toHaveBeenNthCalledWith(
        1,
        provider.document?.uri,
        {},
        `${createNodeText({
          title: "LearnMore",
          body: "A: HAHAHA",
          tags: "",
          position: {
            x: 763,
            y: 472,
          },
        })}`
      );
    });
  });
});
