import { State } from "../Types";

import EditorActions from "loom-common/EditorActionType";
import UiActions from "./UiActionType";
import { YarnEditorMessageTypes } from "loom-common/EditorActions";
import { UiMessageTypes } from "./UiActions";

/**
 * Will search for a specific tag by setting the search string to the tag
 * and only searching tags.
 *
 * If the given tag is already being searched for, this will clear the search and reset
 * whether we're searching for title/body/tag to all be true.
 *
 * @param state Current state
 * @param tag Tag to search/unsearch for
 */
const searchForTag = (state: State, tag: string): State => {
  // if we're already searching for just this tag, reset the search
  if (
    state.search.searchString === tag &&
    !state.search.searchingBody &&
    !state.search.searchingTitle &&
    state.search.searchingTags
  ) {
    return {
      ...state,
      search: {
        ...state.search,
        searchingTitle: true,
        searchingBody: true,
        searchingTags: true,
        searchString: "",
      },
    };
  }

  // search only for the given tag
  return {
    ...state,
    search: {
      ...state.search,
      searchingTitle: false,
      searchingBody: false,
      searchingTags: true,
      searchString: tag,
    },
  };
};

export default (state: State, action: EditorActions | UiActions): State => {
  switch (action.type) {
    case YarnEditorMessageTypes.SetNodes:
      return {
        ...state,
        nodes: action.payload.nodes,
      };
    case UiMessageTypes.SetSearchingNodeBodies:
      return {
        ...state,
        search: {
          ...state.search,
          searchingBody: action.payload.searchingBody,
        },
      };
    case UiMessageTypes.SetSearchingNodeTags:
      return {
        ...state,
        search: {
          ...state.search,
          searchingTags: action.payload.searchingTags,
        },
      };
    case UiMessageTypes.SetSearchingNodeTitles:
      return {
        ...state,
        search: {
          ...state.search,
          searchingTitle: action.payload.searchingTitle,
        },
      };
    case UiMessageTypes.SetSearchCaseSensitive:
      return {
        ...state,
        search: {
          ...state.search,
          caseSensitivityEnabled: action.payload.caseSensitive,
        },
      };

    case UiMessageTypes.SetSearchRegexEnabled:
      return {
        ...state,
        search: {
          ...state.search,
          regexEnabled: action.payload.regexEnabled,
        },
      };
    case UiMessageTypes.SetSearchString:
      return {
        ...state,
        search: {
          ...state.search,
          searchString: action.payload.searchString,
        },
      };
    case UiMessageTypes.SetFocusedNode:
      return {
        ...state,
        focusedNode: action.payload.nodeTitle,
      };
    case UiMessageTypes.SearchForTag:
      return searchForTag(state, action.payload.tag);
    default:
      return state;
  }
};
