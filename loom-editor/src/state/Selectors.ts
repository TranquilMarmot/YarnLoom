import { State } from "../Types";

export const getNodes = (state?: State) => state?.nodes || [];

export const getSearchingTitle = (state: State) => state.search.searchingTitle;
export const getSearchingBody = (state: State) => state.search.searchingBody;
export const getSearchingTags = (state: State) => state.search.searchingTags;
export const getCaseSensitivityEnabled = (state: State) =>
  state.search.caseSensitivityEnabled;
export const getRegexEnabled = (state: State) => state.search.regexEnabled;
export const getSearchString = (state: State) => state.search.searchString;

export const getFocusedNode = (state?: State) => state?.focusedNode;
