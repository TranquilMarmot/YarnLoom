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

  /** Set the color for a node */
  SetNodeColor = "SetNodeColor",

  /** Set the position for a node */
  SetNodePosition = "SetNodePosition",

  /** Set whether or not we're searching node bodies */
  SetSearchingNodeBodies = "SetSearchingNodeBodies",

  /** Set whether or not we're searching node titles */
  SetSearchingNodeTitles = "SetSearchingNodeTitles",

  /** Set whether or not we're searching node tags */
  SetSearchingNodeTags = "SetSearchingNodeTags",

  /** Set the string currently being searched for */
  SetSearchString = "SetSearchString",

  /** Set the node to focus on */
  SetFocusedNode = "SetFocusedNode",

  /** Search for a specific tag */
  SearchForTag = "SearchForTag",
}

export const setNodes = (nodes: YarnNode[]) =>
  action(YarnEditorMessageTypes.SetNodes, { nodes });

export const setNode = (node: YarnNode) =>
  action(YarnEditorMessageTypes.SetNode, { node });

export const openNode = (nodeId: string) =>
  action(YarnEditorMessageTypes.OpenNode, { nodeId });

export const deleteNode = (nodeTitle: string) =>
  action(YarnEditorMessageTypes.DeleteNode, { nodeTitle });

export const setNodeColor = (nodeTitle: string, colorIndex: number) =>
  action(YarnEditorMessageTypes.SetNodeColor, { nodeTitle, colorIndex });

export const setNodePosition = (nodeTitle: string, x: number, y: number) =>
  action(YarnEditorMessageTypes.SetNodePosition, { nodeTitle, x, y });

export const setSearchingNodeTitles = (searchingTitle: boolean) =>
  action(YarnEditorMessageTypes.SetSearchingNodeTitles, { searchingTitle });

export const setSearchingNodeBodies = (searchingBody: boolean) =>
  action(YarnEditorMessageTypes.SetSearchingNodeBodies, { searchingBody });

export const setSearchingNodeTags = (searchingTags: boolean) =>
  action(YarnEditorMessageTypes.SetSearchingNodeTags, { searchingTags });

export const setSearchString = (searchString: string) =>
  action(YarnEditorMessageTypes.SetSearchString, { searchString });

export const setFocusedNode = (nodeTitle: string) =>
  action(YarnEditorMessageTypes.SetFocusedNode, { nodeTitle });

export const searchForTag = (tag: string) =>
  action(YarnEditorMessageTypes.SearchForTag, { tag });
