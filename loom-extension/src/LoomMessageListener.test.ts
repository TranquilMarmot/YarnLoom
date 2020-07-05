import { openNodeInTemporaryFileEditor } from "./LoomMessageListener";
import { YarnNode } from "loom-common/YarnNode";
import LoomEditorProvider from "./LoomEditorProvider";

const vscodeMock = require("../__mocks__/vscode");

jest.mock("./TemporaryFiles", () => ({
  createTemporaryFileForNode: jest
    .fn()
    .mockImplementation((node: YarnNode, editor: LoomEditorProvider) => ({
      path: `${node.title}.yarn.node`,
    })),
}));
import { createTemporaryFileForNode } from "./TemporaryFiles";

describe("LoomMessageListener", () => {
  const mockNodes: YarnNode[] = [
    {
      title: "Example Node",
      tags: "",
      body: "",
    },
  ];

  const mockEditor: LoomEditorProvider = ({
    nodes: mockNodes,
    webviewPanel: {}, // needs to be defined or errors are thrown
  } as unknown) as LoomEditorProvider;

  describe("openNodeInTemporaryFileEditor", () => {
    it("opens nodes in an editor", () => {
      openNodeInTemporaryFileEditor("Example Node", mockEditor);

      expect(createTemporaryFileForNode).toHaveBeenNthCalledWith(
        1,
        mockEditor.nodes[0],
        mockEditor
      );

      expect(vscodeMock.workspace.openTextDocument).toHaveBeenNthCalledWith(
        1,
        "Example Node.yarn.node"
      );

      expect(vscodeMock.window.showTextDocument).toHaveBeenCalledTimes(1);
    });
  });
});
