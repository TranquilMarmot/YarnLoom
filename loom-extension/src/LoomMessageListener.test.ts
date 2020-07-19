import * as LoomMessageListener from "./LoomMessageListener";

// used to assert certain functions are called
const vscodeMock = require("../__mocks__/vscode");
import { WebviewPanel } from "vscode";

import LoomEditorProvider from "./LoomEditorProvider";

import { YarnNode } from "loom-common/YarnNode";
import * as EditorActionCreators from "loom-common/EditorActions";
import EditorActions from "loom-common/EditorActionType";

jest.mock("./TemporaryFiles", () => ({
  createTemporaryFileForNode: jest
    .fn()
    .mockImplementation((node: YarnNode) => ({
      // we just mock _some_ value here so that it seems like an actual file is being created
      path: `${node.title}.yarn.node`,
    })),
}));
import { createTemporaryFileForNode } from "./TemporaryFiles";

describe("LoomMessageListener", () => {
  const mockNodeTitle = "Example Node";
  const mockNodes: YarnNode[] = [
    {
      title: mockNodeTitle,
      tags: "",
      body: "",
    },
  ];

  let mockEditor: LoomEditorProvider;

  beforeEach(() => {
    // we re-create this before each test since the tests can end up mutating it
    mockEditor = ({
      nodes: mockNodes,
      webviewPanel: {}, // needs to be defined or errors are thrown
      updateNode: jest.fn(),
      deleteNode: jest.fn(),
    } as unknown) as LoomEditorProvider;
  });

  describe("openNodeInTemporaryFileEditor", () => {
    it("opens nodes in an editor", () => {
      LoomMessageListener.openNodeInTemporaryFileEditor(
        mockNodeTitle,
        mockEditor
      );

      expect(createTemporaryFileForNode).toHaveBeenCalledTimes(1);
      expect(createTemporaryFileForNode).toHaveBeenNthCalledWith(
        1,
        mockEditor.nodes[0],
        mockEditor
      );

      expect(vscodeMock.workspace.openTextDocument).toHaveBeenCalledTimes(1);
      expect(vscodeMock.workspace.openTextDocument).toHaveBeenNthCalledWith(
        1,
        `${mockNodeTitle}.yarn.node` // in reality, this is usually a fully qualified path, but we mocked this above
      );

      expect(vscodeMock.window.showTextDocument).toHaveBeenCalledTimes(1);
    });
  });

  describe("setNodeColor", () => {
    it("sets the node color", () => {
      const colorID = 5;
      LoomMessageListener.setNodeColor(mockNodeTitle, colorID, mockEditor);

      expect(mockEditor.updateNode).toHaveBeenCalledTimes(1);
      expect(mockEditor.updateNode).toHaveBeenNthCalledWith(1, mockNodeTitle, {
        ...mockNodes[0],
        colorID,
      });
    });
  });

  describe("setNodePosition", () => {
    it("sets the node position", () => {
      const newPosition = { x: 1234, y: 5678 };

      LoomMessageListener.setNodePosition(
        mockNodeTitle,
        newPosition.x,
        newPosition.y,
        mockEditor
      );

      expect(mockEditor.updateNode).toHaveBeenCalledTimes(1);
      expect(mockEditor.updateNode).toHaveBeenNthCalledWith(1, mockNodeTitle, {
        ...mockNodes[0],
        position: newPosition,
      });
    });
  });

  describe("confirmAndDeleteNode", () => {
    it("deletes if the value chosen is Yes", () => {
      // this will mock the information response immediately returning "Yes"
      const mockedSetInformationMessage = vscodeMock.__setInformationMessageResponse(
        "Yes"
      );

      LoomMessageListener.confirmAndDeleteNode(mockNodeTitle, mockEditor);

      expect(mockedSetInformationMessage).toHaveBeenCalledTimes(1);

      // actually called once with the node title
      expect(mockEditor.deleteNode).toHaveBeenCalledTimes(1);
      expect(mockEditor.deleteNode).toHaveBeenCalledWith(mockNodeTitle);
    });

    it("does not delete if the value chosen is not Yes", () => {
      // this will mock the information response immediately returning "No"
      const mockedSetInformationMessage = vscodeMock.__setInformationMessageResponse(
        "No"
      );

      LoomMessageListener.confirmAndDeleteNode(mockNodeTitle, mockEditor);

      expect(mockedSetInformationMessage).toHaveBeenCalledTimes(1);

      // not called since the user would have decided not to delete it
      expect(mockEditor.deleteNode).toHaveBeenCalledTimes(0);
    });
  });

  describe("listenForMessages", () => {
    /**
     * Given an EditorActions message, this will return a mock WebviewPanel
     * that, when `onDidReceiveMessage` is called, will immediately pass the given message
     * on to the function passed in to it by `listenForMessages`.
     */
    const createMockWebviewWithMessage = (message: EditorActions) => {
      const mockWebviewPanel: WebviewPanel = ({
        webview: {
          onDidReceiveMessage: (fn: (message: EditorActions) => void) => {
            fn(message);
          },
        } as any,
      } as unknown) as WebviewPanel;

      return mockWebviewPanel;
    };

    it("Listens for YarnEditorMessageTypes.OpenNode", () => {
      const mockWebviewPanel = createMockWebviewWithMessage(
        EditorActionCreators.openNode(mockNodeTitle)
      );

      const openNodeInTemporaryFileEditorMock = jest.spyOn(
        LoomMessageListener,
        "openNodeInTemporaryFileEditor"
      );
      openNodeInTemporaryFileEditorMock.mockImplementationOnce(() => {});

      LoomMessageListener.listenForMessages(mockWebviewPanel, mockEditor);

      expect(openNodeInTemporaryFileEditorMock).toHaveBeenCalledTimes(1);
      expect(openNodeInTemporaryFileEditorMock).toHaveBeenCalledWith(
        mockNodeTitle,
        mockEditor
      );

      openNodeInTemporaryFileEditorMock.mockRestore();
    });

    it("Listens for YarnEditorMessageTypes.DeleteNode", () => {
      const mockWebviewPanel = createMockWebviewWithMessage(
        EditorActionCreators.deleteNode(mockNodeTitle)
      );

      const confirmAndDeleteNodeMock = jest.spyOn(
        LoomMessageListener,
        "confirmAndDeleteNode"
      );
      confirmAndDeleteNodeMock.mockImplementationOnce(() => {});

      LoomMessageListener.listenForMessages(mockWebviewPanel, mockEditor);

      expect(confirmAndDeleteNodeMock).toHaveBeenCalledTimes(1);
      expect(confirmAndDeleteNodeMock).toHaveBeenCalledWith(
        mockNodeTitle,
        mockEditor
      );

      confirmAndDeleteNodeMock.mockRestore();
    });

    it("listens for YarnEditorMessageTypes.CreateNewNode", () => {
      const mockWebviewPanel = createMockWebviewWithMessage(
        EditorActionCreators.createNewNode()
      );

      const askForNameAndAddNewNodeMock = jest.spyOn(
        LoomMessageListener,
        "askForNameAndAddNewNode"
      );
      askForNameAndAddNewNodeMock.mockImplementationOnce(() => {});

      LoomMessageListener.listenForMessages(mockWebviewPanel, mockEditor);

      expect(askForNameAndAddNewNodeMock).toHaveBeenCalledTimes(1);
      expect(askForNameAndAddNewNodeMock).toHaveBeenCalledWith(mockEditor);

      askForNameAndAddNewNodeMock.mockRestore();
    });

    it("Listens for YarnEditorMessageTypes.SetNodeColor", () => {
      const nodeColorID = 5;

      const mockWebviewPanel = createMockWebviewWithMessage(
        EditorActionCreators.setNodeColor(mockNodeTitle, nodeColorID)
      );

      const setNodeColorMock = jest.spyOn(LoomMessageListener, "setNodeColor");
      setNodeColorMock.mockImplementationOnce(() => {});

      LoomMessageListener.listenForMessages(mockWebviewPanel, mockEditor);

      expect(setNodeColorMock).toHaveBeenCalledTimes(1);
      expect(setNodeColorMock).toHaveBeenCalledWith(
        mockNodeTitle,
        nodeColorID,
        mockEditor
      );

      setNodeColorMock.mockRestore();
    });

    it("Listens for YarnEditorMessageTypes.SetNodePosition", () => {
      const nodeX = 1234;
      const nodeY = 5678;

      const mockWebviewPanel = createMockWebviewWithMessage(
        EditorActionCreators.setNodePosition(mockNodeTitle, nodeX, nodeY)
      );

      const setNodePositionMock = jest.spyOn(
        LoomMessageListener,
        "setNodePosition"
      );
      setNodePositionMock.mockImplementationOnce(() => {});

      LoomMessageListener.listenForMessages(mockWebviewPanel, mockEditor);

      expect(setNodePositionMock).toHaveBeenCalledTimes(1);
      expect(setNodePositionMock).toHaveBeenCalledWith(
        mockNodeTitle,
        nodeX,
        nodeY,
        mockEditor
      );

      setNodePositionMock.mockRestore();
    });
  });
});
