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
    default:
      return state;
  }
};
