import React from "react";
import { ReactElement, FunctionComponent } from "react";
import { render, RenderOptions } from "@testing-library/react";

import { YarnStateContext, defaultState } from "../state/YarnContext";
import { State } from "../Types";
import EditorActionType from "loom-common/EditorActionType";
import UiActionType from "../state/UiActionType";

const wrapperWithStateAndReducer = (
  state?: State,
  reducer?: (action: EditorActionType | UiActionType) => void
) => {
  const wrapper: FunctionComponent = ({ children }) => {
    return (
      <YarnStateContext.Provider
        value={[state || defaultState, reducer || (() => {})]}
      >
        {children}
      </YarnStateContext.Provider>
    );
  };

  return wrapper;
};

export const renderWithProvider = (
  ui: ReactElement,
  state?: State,
  reducer?: (action: EditorActionType | UiActionType) => void,
  options?: Omit<RenderOptions, "queries">
) =>
  render(ui, {
    wrapper: wrapperWithStateAndReducer(state, reducer),
    ...options,
  });
