import { action } from "typesafe-actions";

/** Types of messages that only pertain to the webview editor */
export enum UiMessageTypes {
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

export const setSearchingNodeTitles = (searchingTitle: boolean) =>
  action(UiMessageTypes.SetSearchingNodeTitles, { searchingTitle });

export const setSearchingNodeBodies = (searchingBody: boolean) =>
  action(UiMessageTypes.SetSearchingNodeBodies, { searchingBody });

export const setSearchingNodeTags = (searchingTags: boolean) =>
  action(UiMessageTypes.SetSearchingNodeTags, { searchingTags });

export const setSearchString = (searchString: string) =>
  action(UiMessageTypes.SetSearchString, { searchString });

export const setFocusedNode = (nodeTitle: string) =>
  action(UiMessageTypes.SetFocusedNode, { nodeTitle });

export const searchForTag = (tag: string) =>
  action(UiMessageTypes.SearchForTag, { tag });
