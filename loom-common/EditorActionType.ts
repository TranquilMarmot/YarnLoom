import * as actions from "./EditorActions";
import { ActionType } from "typesafe-actions";

/** List of all actions */
type Actions = ActionType<typeof actions>;

export default Actions;
