import React, {
  createContext,
  useReducer,
  FunctionComponent,
  useEffect,
  useContext,
} from "react";

import { State } from "../Types";
import Reducer from "./Reducer";

const defaultState: State = {
  nodes: [],
};

const YarnStateContext = createContext<
  [State | undefined, (action: any) => void]
>([defaultState, () => {}]);

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

export const useYarnState = () => {
  const context = useContext(YarnStateContext);

  if (context === undefined) {
    throw new Error("useYarnState must be used within a YarnProvider");
  }

  return context;
};
