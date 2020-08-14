import { action } from "typesafe-actions";

/** Types of messages that only pertain to the webview editor */
export enum UiMessageTypes {
  /** Set whether or not we're searching node bodies */
  SetSearchingNodeBodies = "SetSearchingNodeBodies",

  /** Set whether or not we're searching node titles */
  SetSearchingNodeTitles = "SetSearchingNodeTitles",

  /** Set whether or not we're searching node tags */
  SetSearchingNodeTags = "SetSearchingNodeTags",

  /** Set whether the current search is case sensitive or not */
  SetSearchCaseSensitive = "SetSearchCaseSensitive",

  /** Set whether or not to use regex in searches */
  SetSearchRegexEnabled = "SetSearchRegexEnabled",

  /** Set the string currently being searched for */
  SetSearchString = "SetSearchString",

  /** Set the node to focus on */
  SetFocusedNode = "SetFocusedNode",

  /** Search for a specific tag */
  SearchForTag = "SearchForTag",

  /** Set the current zoom level of the graph */
  SetCurrentZoom = "SetCurrentZoom",
}

export const setSearchingNodeTitles = (searchingTitle: boolean) =>
  action(UiMessageTypes.SetSearchingNodeTitles, { searchingTitle });

export const setSearchingNodeBodies = (searchingBody: boolean) =>
  action(UiMessageTypes.SetSearchingNodeBodies, { searchingBody });

export const setSearchingNodeTags = (searchingTags: boolean) =>
  action(UiMessageTypes.SetSearchingNodeTags, { searchingTags });

export const setSearchCaseSensitive = (caseSensitive: boolean) =>
  action(UiMessageTypes.SetSearchCaseSensitive, { caseSensitive });

export const setSearchRegexEnabled = (regexEnabled: boolean) =>
  action(UiMessageTypes.SetSearchRegexEnabled, { regexEnabled });

export const setSearchString = (searchString: string) =>
  action(UiMessageTypes.SetSearchString, { searchString });

export const setFocusedNode = (nodeTitle?: string) =>
  action(UiMessageTypes.SetFocusedNode, { nodeTitle });

export const searchForTag = (tag: string) =>
  action(UiMessageTypes.SearchForTag, { tag });

export const setCurrentZoom = (zoom: number) =>
  action(UiMessageTypes.SetCurrentZoom, { zoom });
