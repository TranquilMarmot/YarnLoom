import { State } from "../Types";

import EditorActions from "loom-common/EditorActionType";
import UiActions from "./UiActionType";
import { YarnEditorMessageTypes } from "loom-common/EditorActions";
import { UiMessageTypes } from "./UiActions";

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
      return {
        ...state,
        search: {
          ...state.search,
          searchingTitle: false,
          searchingBody: false,
          searchingTags: true,
          searchString: action.payload.tag,
        },
      };
    default:
      return state;
  }
};
