import {
  WebviewPanel,
  workspace,
  window,
  ConfigurationChangeEvent,
  ViewColumn,
} from "vscode";

import EditorActions from "loom-common/EditorActionType";
import { YarnEditorMessageTypes } from "loom-common/EditorActions";
import { getNodeByTitle } from "loom-common/YarnNode";

import { createTemporaryFileForNode } from "./TemporaryFiles";
import LoomEditorProvider from "./LoomEditorProvider";

/**
 * Given a node title, will open that node in a temporary text file
 * @param nodeTitle Title of node to open in text editor
 * @param editor Editor provider that contains webview
 */
export const openNodeInTemporaryFileEditor = (
  nodeTitle: string,
  editor: LoomEditorProvider
) => {
  if (!editor.webviewPanel) {
    throw new Error(
      `Tried to find node ${nodeTitle} but don't have a webview open!`
    );
  }

  const node = getNodeByTitle(editor.nodes, nodeTitle);

  if (!node) {
    throw new Error(`Couldn't find node with title ${nodeTitle}`);
  }

  // this will create a temporary file and add a file watcher on it
  // when the file changes, a message is sent back to the editor
  const temporaryFile = createTemporaryFileForNode(node, editor);
  // and open it in the editor
  workspace.openTextDocument(temporaryFile.path).then((doc) =>
    window.showTextDocument(doc, {
      preserveFocus: true,
      viewColumn: ViewColumn.Beside,
    })
  );
};

/**
 * Set the color for a node
 * @param nodeTitle Title of node to set color for
 * @param colorID Index in color array to set color to
 * @param editor Editor provider that contains webview
 */
export const setNodeColor = (
  nodeTitle: string,
  colorID: number,
  editor: LoomEditorProvider
) => {
  const node = getNodeByTitle(editor.nodes, nodeTitle);

  if (!node) {
    throw new Error(
      `Tried to set color for node ${nodeTitle} to colorId ${colorID} but no node was found.`
    );
  }

  editor.updateNode(nodeTitle, {
    ...node,
    colorID: colorID,
  });
};

/**
 * Set the position for a node
 * @param nodeTitle Title of node to set position for
 * @param x X location to set node position to
 * @param y Y location to set node position to
 * @param editor Editor provider that contains webview
 */
export const setNodePosition = (
  nodeTitle: string,
  x: number,
  y: number,
  editor: LoomEditorProvider
) => {
  const node = getNodeByTitle(editor.nodes, nodeTitle);

  if (!node) {
    throw new Error(
      `Tried to set position for node ${nodeTitle} to position (${x}, ${y}) but no node was found.`
    );
  }

  editor.updateNode(nodeTitle, {
    ...node,
    position: {
      x,
      y,
    },
  });
};

/**
 * Shows a confirmation modal and deletes the given node if the user accepts it.
 * @param nodeTitle Title of node to delete
 * @param editor Editor to delete node from
 */
export const confirmAndDeleteNode = (
  nodeTitle: string,
  editor: LoomEditorProvider
) => {
  window
    .showInformationMessage(
      `Are you sure you want to delete the node ${nodeTitle}?`,
      { modal: true },
      "Yes"
    )
    .then((val) => {
      if (val === "Yes") {
        editor.deleteNode(nodeTitle);
      }
    });
};

/**
 * Asks the user for the name of a new node to add and then adds it to the document.
 * This will ensure that the node being added has a unique title that no other node has.
 *
 * @param editor Editor to add node to
 */
export const askForNameAndAddNewNode = (editor: LoomEditorProvider) => {
  window
    .showInputBox({
      prompt: "Enter name for new node",
      placeHolder: "New Node",
      ignoreFocusOut: true, // in case they want to look at their current nodes

      // if this function returns a string, it's shown as an error and prevents the
      // user from hitting enter; returning `undefined` means we're good-to-go
      validateInput: (val: string) => {
        if (getNodeByTitle(editor.nodes, val)) {
          return `Node with name ${val} already exists`;
        }

        return undefined;
      },
    })
    .then((val) => {
      if (!val) {
        return;
      }

      if (getNodeByTitle(editor.nodes, val)) {
        window.showErrorMessage(`Node with name ${val} already exists`);
        return;
      }

      editor.addNewNode(val);
    });
};

/**
 * Listens for message being send with `window.vsCodeApi.postMessage({ type: string, payload: string });`
 * @param webviewPanel Panel to attach event listener to
 * @param document Document that webview is currently showing (undefined if showing an editor that's not looking at a document)
 */
export const listenForMessages = (
  webviewPanel: WebviewPanel,
  editor: LoomEditorProvider
) =>
  webviewPanel.webview.onDidReceiveMessage((message: EditorActions) => {
    switch (message.type) {
      case YarnEditorMessageTypes.OpenNode:
        openNodeInTemporaryFileEditor(message.payload.nodeId, editor);
        break;
      case YarnEditorMessageTypes.DeleteNode:
        confirmAndDeleteNode(message.payload.nodeTitle, editor);
        break;
      case YarnEditorMessageTypes.SetNodeColor:
        setNodeColor(
          message.payload.nodeTitle,
          message.payload.colorIndex,
          editor
        );
        break;
      case YarnEditorMessageTypes.SetNodePosition:
        setNodePosition(
          message.payload.nodeTitle,
          message.payload.x,
          message.payload.y,
          editor
        );
        break;
      case YarnEditorMessageTypes.CreateNewNode:
        askForNameAndAddNewNode(editor);
        break;
      default:
        break;
    }
  });

/** Attaches an event listener that gets all workspace configuration changes */
export const listenForConfigurationChanges = () =>
  // listen to changes to the "yarnLoom" configuration set
  workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
    if (event.affectsConfiguration("yarnLoom")) {
      // TODO dispatch events to the redux store
    }
  });
