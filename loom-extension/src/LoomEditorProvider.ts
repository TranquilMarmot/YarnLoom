import {
  ExtensionContext,
  CustomTextEditorProvider,
  TextDocument,
  WebviewPanel,
  Disposable,
  window,
  workspace,
  WorkspaceEdit,
  Range,
  Position,
} from "vscode";
import rimraf from "rimraf";

import { YarnNode, createNodeText } from "loom-common/YarnNode";
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

  /** Context that extension is running under */
  context: ExtensionContext;

  /** Text document that's open */
  document?: TextDocument;

  /** Webview panel displaying editor */
  webviewPanel?: WebviewPanel;

  /** List of yarn nodes in the current document */
  nodes: YarnNode[];

  constructor(context: ExtensionContext) {
    this.context = context;
    this.nodes = [];
  }

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
    // and delete any temporary files
    workspace.onDidCloseTextDocument((e) => {
      if (e.uri === document.uri) {
        this.onDocumentClosed(document);
      }
    });

    // track when the document that's opened changes
    // this is so that we can re-update the editor
    workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri === document.uri) {
        this.nodes = parseYarnFile(e.document.getText());
        webviewPanel.webview.postMessage(setNodes(this.nodes));
      }
    });

    // start the message listener
    LoomMessageListener(webviewPanel, this);

    // actually create the webview
    LoomWebviewPanel(webviewPanel, this.context.extensionPath);

    // and send all of our nodes over to it
    webviewPanel.webview.postMessage(setNodes(this.nodes));
  }

  /**
   * Called when the given document is closed in the workspace
   * @param document The document getting closed
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

  /**
   * Given a node title, will return a range of lines that that node occupies in the backing text document.
   * @param nodeTitle Title of node to get range in document for
   */
  getRangeForNode = (nodeTitle: string): Range => {
    if (!this.document) {
      throw new Error(
        `Tried to update node ${nodeTitle} but we don't have a document!`
      );
    }

    const lines = this.document.getText().split("\n");
    let nodeStartingLineNumber: number = -1;
    let nodeEndingLineNumber: number = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === `title: ${nodeTitle.trim()}`) {
        nodeStartingLineNumber = i;
      }

      // if we have the starting line number, the next `===` we run into means it's the end of the node
      if (nodeStartingLineNumber !== -1 && line === "===") {
        nodeEndingLineNumber = i;
        break;
      }
    }

    // 3 because nodes end with `===`
    return new Range(nodeStartingLineNumber, 0, nodeEndingLineNumber, 3);
  };

  /**
   * Update a single node in the document
   * @param originalTitle Original title of node, in case it was changed during the edit
   * @param node Node to update
   */
  updateNode = (originalTitle: string, node: YarnNode) => {
    if (!this.webviewPanel) {
      throw new Error(
        `Tried to update node ${originalTitle} but we don't have a webview!`
      );
    }

    if (!this.document) {
      throw new Error(
        `Tried to update node ${originalTitle} but we don't have a document!`
      );
    }

    const originalNodeIndex = this.nodes.findIndex(
      (originalNode) => originalNode.title === originalTitle
    );

    // update the one node we're updating and leave the rest alone
    this.nodes = [
      ...this.nodes.slice(0, originalNodeIndex),
      ...[node],
      ...this.nodes.slice(originalNodeIndex + 1),
    ];

    // re-build the links in case they changed
    // this will return any new nodes that were auto-created from added links
    const addedNodes = buildLinksFromNodes(this.nodes, true);

    // update all the nodes in the editor
    this.webviewPanel.webview.postMessage(setNodes(this.nodes));

    // and finally, apply the actual edit to the text document
    const edit = new WorkspaceEdit();
    edit.replace(
      this.document.uri,
      this.getRangeForNode(originalTitle),
      createNodeText(node)
    );
    addedNodes.forEach((addedNode) =>
      this.createNodeInDocument(addedNode, edit)
    );
    workspace.applyEdit(edit);
  };

  /**
   * Delete a node with the given title
   * @param nodeTitle Title of node to delete
   */
  deleteNode = (nodeTitle: string) => {
    if (!this.webviewPanel) {
      throw new Error(
        `Tried to delete node ${nodeTitle} but we don't have a webview!`
      );
    }

    if (!this.document) {
      throw new Error(
        `Tried to delete node ${nodeTitle} but we don't have a document!`
      );
    }

    const originalNodeIndex = this.nodes.findIndex(
      (originalNode) => originalNode.title === nodeTitle
    );

    // update the one node we're updating and leave the rest alone
    this.nodes = [
      ...this.nodes.slice(0, originalNodeIndex),
      ...this.nodes.slice(originalNodeIndex + 1),
    ];

    // re-build the links in case they changed
    buildLinksFromNodes(this.nodes, false);

    // update all the nodes in the editor
    this.webviewPanel.webview.postMessage(setNodes(this.nodes));

    // and finally, apply the actual edit to the text document
    const edit = new WorkspaceEdit();
    edit.delete(this.document.uri, this.getRangeForNode(nodeTitle));
    workspace.applyEdit(edit);
  };

  /**
   * Add a new node to the backing text document
   * @param node Node to insert into document
   * @param edit Edit to apply insert to
   */
  createNodeInDocument = (node: YarnNode, edit: WorkspaceEdit) => {
    if (!this.document) {
      throw new Error(
        `Tried to create node ${node.title} but we don't have a document!`
      );
    }

    edit.insert(
      this.document.uri,
      new Position(this.document.getText().split("\n").length + 1, 0),
      createNodeText(node)
    );
  };
}
