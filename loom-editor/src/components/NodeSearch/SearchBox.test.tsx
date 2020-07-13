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

      fireEvent.change(screen.getByTestId("search-box-input"), {
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
        screen.getByTestId("search-box-input").getAttribute("value")
      ).toEqual(inputValue);
    });
  });

  describe("search titles button", () => {
    it("sets the value when clicked", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.click(screen.getByTestId("search-box-title-button"));

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

      expect(
        screen
          .getByTestId("search-box-title-button")
          .getAttribute("aria-checked")
      ).toEqual(`${!defaultState.search.searchingTitle}`);
    });
  });

  describe("search body button", () => {
    it("sets the value when clicked", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.click(screen.getByTestId("search-box-body-button"));

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

      expect(
        screen
          .getByTestId("search-box-body-button")
          .getAttribute("aria-checked")
      ).toEqual(`${!defaultState.search.searchingBody}`);
    });
  });

  describe("search tags button", () => {
    it("sets the value when clicked", () => {
      const dispatch = jest.fn();

      renderWithProvider(<SearchBox />, undefined, dispatch);

      fireEvent.click(screen.getByTestId("search-box-tags-button"));

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

      expect(
        screen
          .getByTestId("search-box-tags-button")
          .getAttribute("aria-checked")
      ).toEqual(`${!defaultState.search.searchingTags}`);
    });
  });
});
