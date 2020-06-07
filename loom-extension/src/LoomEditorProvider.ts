import {
  ExtensionContext,
  CustomTextEditorProvider,
  TextDocument,
  WebviewPanel,
  Disposable,
  window,
  workspace,
} from "vscode";
import rimraf from "rimraf";

import { YarnNode } from "loom-common/YarnNode";
import { parseYarnFile, buildLinksFromNodes } from "loom-common/YarnParser";
import { setNodes } from "loom-common/EditorActions";

import LoomWebviewPanel from "./LoomWebviewPanel";
import LoomMessageListener from "./LoomMessageListener";
import {
  getTemporaryFolderPath,
  unwatchTemporaryFilesForDocument,
} from "./TemporaryFiles";

/**
 * This is a custom text editor provider that will open up `.yarn` files in the Yarn Editor.
 */
export default class LoomEditorProvider implements CustomTextEditorProvider {
  /**
   * This is used to trigger calling this on certain file types.
   * See package.json where this is used.
   */
  private static readonly viewType = "yarnLoom.editor";

  /** Register a LoomEditor provider in the extension context. */
  public static register(context: ExtensionContext): Disposable {
    const provider = new LoomEditorProvider(context);
    const providerRegistration = window.registerCustomEditorProvider(
      LoomEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          // this makes it so that when the tab loses context, it doesn't re-create it
          retainContextWhenHidden: true,
        },
      }
    );
    return providerRegistration;
  }

  context: ExtensionContext;

  nodes?: YarnNode[];

  document?: TextDocument;

  webviewPanel?: WebviewPanel;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  /**
   * Called when the given document is closed in the workspace
   */
  onDocumentClosed = (document: TextDocument) => {
    // first, close any file watchers we have open for this document
    unwatchTemporaryFilesForDocument(document);

    // delete the temporary folder that we created to edit nodes
    // this folder isn't guaranteed to actually exist
    const temporaryFolderPath = getTemporaryFolderPath(document);
    rimraf(temporaryFolderPath, (e) => {
      if (e) {
        console.error(
          `Error cleaning up temporary directory ${temporaryFolderPath} when closing ${document.uri.toString()}`,
          e
        );
      }
    });
  };

  updateNode = (originalTitle: string, node: YarnNode) => {
    if (!this.nodes) {
      throw new Error(
        `Tried to update node ${originalTitle} but we don't have any nodes!`
      );
    }

    if (!this.webviewPanel) {
      throw new Error(
        `Tried to update node ${originalTitle} but we don't have a webview!`
      );
    }

    const originalNodeIndex = this.nodes.findIndex(
      (originalNode) => originalNode.title === originalTitle
    );

    this.nodes = [
      ...this.nodes.slice(0, originalNodeIndex),
      ...[node],
      ...this.nodes.slice(originalNodeIndex + 1),
    ];

    buildLinksFromNodes(this.nodes);

    this.webviewPanel.webview.postMessage(setNodes(this.nodes));
  };

  /**
   * This is from the CustomTextEditorProvider interface and will be called
   * whenever we're opening a .yarn (or other supported) file with the extension
   */
  public resolveCustomTextEditor(
    document: TextDocument,
    webviewPanel: WebviewPanel
  ) {
    webviewPanel.webview.options = {
      enableScripts: true,
    };

    this.webviewPanel = webviewPanel;
    this.document = document;
    this.nodes = parseYarnFile(document.getText());

    // track when the document that we're editing is closed
    workspace.onDidCloseTextDocument((e) => {
      if (e.uri === document.uri) {
        this.onDocumentClosed(document);
      }
    });

    LoomMessageListener(webviewPanel, this);
    LoomWebviewPanel(webviewPanel, this.context.extensionPath);
    webviewPanel.webview.postMessage(setNodes(this.nodes));
  }
}
