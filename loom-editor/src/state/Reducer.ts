import { State } from "../Types";

import EditorActions from "loom-common/EditorActionType";
import { YarnEditorMessageTypes } from "loom-common/EditorActions";

export default (state: State, action: EditorActions): State => {
  console.log(action, state);
  switch (action.type) {
    case YarnEditorMessageTypes.EditNode:
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
