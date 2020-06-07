import { WebviewPanel, Uri, TextDocument, workspace } from "vscode";
import { readFileSync, readdirSync } from "fs";
import { join as joinPath } from "path";
import { YarnEditorMessageTypes } from "./LoomMessageListener";

/**
 * Sets the HTML of the given webview panel to be the yarn editor.
 *
 * This wil also replace many file paths with generated URIs.
 * See also https://code.visualstudio.com/api/extension-guides/webview#loading-local-content
 *
 * @param document Document that is being opened. If this is undefined, it's assumed that we're opening a blank editor.
 * @param extensionPath Path that extension lives at; this comes from the context passed to the extension on creation.
 * @param document Text document that is being opened. Undefined if not opening a document.
 */
export default (panel: WebviewPanel, extensionPath: string) => {
  // load the built HTML file from YarnEditor
  let html = readFileSync(
    joinPath(extensionPath, "out", "build", "index.html"),
    "utf8"
  );

  html = html.replace(
    /\/static/g,
    panel.webview
      .asWebviewUri(Uri.file(joinPath(extensionPath, "out", "build", "static")))
      .toString(true)
  );

  // Here, we add basic functions and changes that are always needed by YarnEditor
  // in order for it to run in the webview.
  // This is done by "replacing" the <head> tag with the <head> tag + a <script>.
  // This ensures that these scripts are run _before_ the editor is loaded.
  html = html.replace(
    "<head>",
    `<head>
      <script>
        // shove the VSCode API onto the window so it can be used to send events back to the extension
        // the "acquireVsCodeApi" function is magically injected into the page by the webview, and can only be called ONCE
        window.vsCodeApi = acquireVsCodeApi();

        // since the webview doesn't do anything when "alert" is called, we override it here to
        // send a message back to the extension; this is listened to in LoomMessageListener
        window.alert = function(message) {
          window.vsCodeApi.postMessage({
            type: "${YarnEditorMessageTypes.Alert}",
            payload: message
          });
        };
        });
      </script>`
  );

  // and finally, actually set the webview HTML to be our munged HTML
  panel.webview.html = html;
};
