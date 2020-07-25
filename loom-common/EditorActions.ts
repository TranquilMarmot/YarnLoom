import { action } from "typesafe-actions";

import { YarnNode } from "./YarnNode";

/** Types of messages that can be sent from the editor to the extension */
export enum YarnEditorMessageTypes {
  /** Called when a node is being opened in a VSCode text editor */
  OpenNode = "OpenNode",

  /** Set a specific node */
  SetNode = "SetNode",

  /** Set all nodes */
  SetNodes = "SetNodes",

  /** Delete a specific node */
  DeleteNode = "DeleteNode",

  /** Create a new node */
  CreateNewNode = "CreateNewNode",

  /** Set the color for a node */
  SetNodeColor = "SetNodeColor",

  /** Set the position for a node */
  SetNodePosition = "SetNodePosition",

  /** Change a node's title */
  RenameNode = "RenameNode",

  /** Add/remove a tag from a node */
  ToggleTagOnNode = "ToggleTagOnNode",

  /** Prompt the user for new tags and add them to the node */
  PromptForNewTags = "PromptForNewTags",

  /** Add a specific tag to the node */
  AddTagToNode = "AddTagToNode",
}

export const setNodes = (nodes: YarnNode[]) =>
  action(YarnEditorMessageTypes.SetNodes, { nodes });

export const setNode = (node: YarnNode) =>
  action(YarnEditorMessageTypes.SetNode, { node });

export const openNode = (nodeId: string) =>
  action(YarnEditorMessageTypes.OpenNode, { nodeId });

export const deleteNode = (nodeTitle: string) =>
  action(YarnEditorMessageTypes.DeleteNode, { nodeTitle });

export const createNewNode = () => action(YarnEditorMessageTypes.CreateNewNode);

export const setNodeColor = (nodeTitle: string, colorIndex: number) =>
  action(YarnEditorMessageTypes.SetNodeColor, { nodeTitle, colorIndex });

export const setNodePosition = (nodeTitle: string, x: number, y: number) =>
  action(YarnEditorMessageTypes.SetNodePosition, { nodeTitle, x, y });

export const renameNode = (nodeTitle: string) =>
  action(YarnEditorMessageTypes.RenameNode, { nodeTitle });

export const toggleTagOnNode = (nodeTitle: string, tag: string) =>
  action(YarnEditorMessageTypes.ToggleTagOnNode, { nodeTitle, tag });

export const promptForNewTags = (nodeTitle: string) =>
  action(YarnEditorMessageTypes.PromptForNewTags, { nodeTitle });
