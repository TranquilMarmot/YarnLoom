import { ExtensionContext } from "vscode";

import LoomProvider from "./LoomEditorProvider";
import { deleteAllTemporaryFiles } from "./TemporaryFiles";

/**
 * This is called when then extension is activated.
 * It will register "subscriptions" in the context that listen for
 * opening specific file types and commands.
 */
export const activate = (context: ExtensionContext) =>
  context.subscriptions.push(LoomProvider.register(context));

/**
 * The is called when the extension is de-activated.
 */
export const deactivate = () => {
  deleteAllTemporaryFiles();
};
