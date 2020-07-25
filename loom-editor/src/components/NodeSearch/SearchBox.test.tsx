import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import SearchBox from "./SearchBox";
import {
  setSearchString,
  setSearchingNodeTitles,
  setSearchingNodeBodies,
  setSearchingNodeTags,
} from "../../state/UiActions";
import { defaultState } from "../../state/YarnContext";

describe("<SearchBox />", () => {
  it("renders", () => {
    renderWithProvider(<SearchBox />);
  });

  describe("search input", () => {
    const inputValue = "Some input";

    it("sets the search string", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.change(screen.getByLabelText("Search for text within nodes"), {
        target: {
          value: inputValue,
        },
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setSearchString(inputValue));
    });

    it("gets search input value from state", () => {
      renderWithProvider(<SearchBox />, {
        ...defaultState,
        search: {
          ...defaultState.search,
          searchString: inputValue,
        },
      });

      expect(
        screen
          .getByLabelText("Search for text within nodes")
          .getAttribute("value")
      ).toEqual(inputValue);
    });
  });

  describe("search titles button", () => {
    it("sets the value when clicked", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.click(screen.getByText("Title"));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setSearchingNodeTitles(false));
    });

    it("grabs its value from the state", () => {
      renderWithProvider(<SearchBox />, {
        ...defaultState,
        search: {
          ...defaultState.search,
          searchingTitle: !defaultState.search.searchingTitle,
        },
      });

      expect(screen.getByText("Title").getAttribute("aria-checked")).toEqual(
        `${!defaultState.search.searchingTitle}`
      );
    });
  });

  describe("search body button", () => {
    it("sets the value when clicked", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.click(screen.getByText("Body"));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setSearchingNodeBodies(false));
    });

    it("grabs its value from the state", () => {
      renderWithProvider(<SearchBox />, {
        ...defaultState,
        search: {
          ...defaultState.search,
          searchingBody: !defaultState.search.searchingBody,
        },
      });

      expect(screen.getByText("Body").getAttribute("aria-checked")).toEqual(
        `${!defaultState.search.searchingBody}`
      );
    });
  });

  describe("search tags button", () => {
    it("sets the value when clicked", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.click(screen.getByText("Tags"));

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(setSearchingNodeTags(false));
    });

    it("grabs its value from the state", () => {
      renderWithProvider(<SearchBox />, {
        ...defaultState,
        search: {
          ...defaultState.search,
          searchingTags: !defaultState.search.searchingTags,
        },
      });

      expect(screen.getByText("Tags").getAttribute("aria-checked")).toEqual(
        `${!defaultState.search.searchingTags}`
      );
    });
  });
});
