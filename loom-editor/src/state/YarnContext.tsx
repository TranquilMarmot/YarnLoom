import React, {
  createContext,
  useReducer,
  FunctionComponent,
  useEffect,
  useContext,
} from "react";

import { State } from "../Types";
import Reducer from "./Reducer";

import EditorActionType from "loom-common/EditorActionType";
import UiActionType from "./UiActionType";

export const defaultState: State = {
  nodes: [],
  search: {
    searchingTitle: true,
    searchingBody: true,
    searchingTags: true,
    searchString: "",
  },
};

export const YarnStateContext = createContext<
  [State | undefined, (action: EditorActionType | UiActionType) => void]
>([defaultState, () => {}]);

/**
 * Wrap components in this to provide them with the required state for the editor to run
 */
export const YarnProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, defaultState);

  useEffect(() => {
    // listen for messages from the extension and dispatch them to the reducer
    window.addEventListener("message", (event) => {
      dispatch(event.data);
    });
  }, []);

  return (
    <YarnStateContext.Provider value={[state, dispatch]}>
      {children}
    </YarnStateContext.Provider>
  );
};

/**
 * Call this as a hook to return a [state, dispatch] array
 * where state is the current state of the context and dispatch can be used to dispatch
 * new events to the reducer.
 */
export const useYarnState = () => {
  const context = useContext(YarnStateContext);

  if (context === undefined) {
    throw new Error("useYarnState must be used within a YarnProvider");
  }

  return context;
};
