import {
  TextDocument,
  WebviewPanel,
  workspace,
  window,
  WorkspaceEdit,
  Range,
  ExtensionContext,
  ConfigurationChangeEvent,
} from "vscode";

import type { YarnNode } from "loom-common/YarnNode";

import LoomWebviewPanel from "./LoomWebviewPanel";
import { createTemporaryFileForNode } from "./TemporaryFiles";
/**
 * This will attach an event listener to the given webview that can receive
 * events sent to it via `window.vsCodeApi.postMessage` (which is created in YarnEditorWebviewPanel.ts)
 *
 * @param webviewPanel Panel to attach event listener to
 * @param document Document that webview is currently showing (undefined if showing an editor that's not looking at a document)
 */
export default (
  webviewPanel: WebviewPanel,
  context: ExtensionContext,
  document?: TextDocument
) => {
  // messages sent with "window.vsCodeApi.postMessage({ type: string, payload: string });" from the editor will end up here
  webviewPanel.webview.onDidReceiveMessage((message) => console.log(message));

  // listen to changes to the "yarnSpinner" configuration set
  // when this changes, we just reload the whole webview since that will set all the settings
  workspace.onDidChangeConfiguration((event: ConfigurationChangeEvent) => {
    if (event.affectsConfiguration("yarnSpinner")) {
      LoomWebviewPanel(webviewPanel, context.extensionPath);
    }
  });
};
