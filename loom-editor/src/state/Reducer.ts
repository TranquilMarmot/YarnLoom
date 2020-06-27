import { State } from "../Types";

import EditorActions from "loom-common/EditorActionType";
import { YarnEditorMessageTypes } from "loom-common/EditorActions";

export default (state: State, action: EditorActions): State => {
  switch (action.type) {
    case YarnEditorMessageTypes.SetNode:
      return state;
    case YarnEditorMessageTypes.SetNodes:
      return {
        ...state,
        nodes: action.payload.nodes,
      };
    case YarnEditorMessageTypes.SetSearchingNodeBodies:
      return {
        ...state,
        search: {
          ...state.search,
          searchingBody: action.payload.searchingBody,
        },
      };
    case YarnEditorMessageTypes.SetSearchingNodeTags:
      return {
        ...state,
        search: {
          ...state.search,
          searchingTags: action.payload.searchingTags,
        },
      };
    case YarnEditorMessageTypes.SetSearchingNodeTitles:
      return {
        ...state,
        search: {
          ...state.search,
          searchingTitle: action.payload.searchingTitle,
        },
      };
    case YarnEditorMessageTypes.SetSearchString:
      return {
        ...state,
        search: {
          ...state.search,
          searchString: action.payload.searchString,
        },
      };
    case YarnEditorMessageTypes.SetFocusedNode:
      return {
        ...state,
        focusedNode: action.payload.nodeTitle,
      };
    case YarnEditorMessageTypes.SearchForTag:
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
