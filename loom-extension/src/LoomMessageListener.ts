import {
  WebviewPanel,
  workspace,
  window,
  ConfigurationChangeEvent,
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
const openNodeInTemporaryFileEditor = (
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
  workspace
    .openTextDocument(temporaryFile.path)
    .then((doc) => window.showTextDocument(doc, { preserveFocus: true }));
};

/**
 * This will attach an event listener to the given webview that can receive
 * events sent to it via `window.vsCodeApi.postMessage` (which is created in LoomWebviewPanel.ts)
 *
 * @param webviewPanel Panel to attach event listener to
 * @param document Document that webview is currently showing (undefined if showing an editor that's not looking at a document)
 */
export default (webviewPanel: WebviewPanel, editor: LoomEditorProvider) => {
  // messages sent with "window.vsCodeApi.postMessage({ type: string, payload: string });" from the editor will end up here
  webviewPanel.webview.onDidReceiveMessage((message: EditorActions) => {
    switch (message.type) {
      case YarnEditorMessageTypes.OpenNode:
        openNodeInTemporaryFileEditor(message.payload.nodeId, editor);
        break;
      default:
        break;
    }
  });

  // listen to changes to the "yarnLoom" configuration set
  // when this changes, we just reload the whole webview since that will set all the settings
  workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
    if (event.affectsConfiguration("yarnLoom")) {
      // TODO dispatch events to the redux store
    }
  });
};
