import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import { searchForTag } from "../../state/UiActions";

import NodeTags from "./NodeTags";

describe("<NodeTags />", () => {
  it("renders", () => {
    renderWithProvider(<NodeTags />);
  });

  it("renders all tags", () => {
    renderWithProvider(<NodeTags tags="a lot of different tags" />);

    expect(screen.getAllByTestId("node-tag-button")).toHaveLength(5);
  });

  it("searches for a tag when the tag is clicked", async () => {
    const dispatch = jest.fn();

    renderWithProvider(<NodeTags tags="some tags" />, undefined, dispatch);

    fireEvent.click(await screen.getByText("some"));
    fireEvent.click(await screen.getByText("tags"));

    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(1, searchForTag("some"));
    expect(dispatch).toHaveBeenNthCalledWith(2, searchForTag("tags"));
  });
});
