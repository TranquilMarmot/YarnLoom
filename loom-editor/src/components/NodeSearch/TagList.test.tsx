import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import TagList from "./TagList";
import { YarnNode } from "loom-common/YarnNode";
import { defaultState } from "../../state/YarnContext";
import { searchForTag } from "../../state/UiActions";

describe("<TagList />", () => {
  it("renders", () => {
    renderWithProvider(<TagList />);
  });

  it("renders every tag", () => {
    renderWithProvider(<TagList />, {
      ...defaultState,
      nodes: [
        {
          title: "Some Node",
          body: "",
          tags: "some test tags",
        },
        {
          title: "Some Other Node",
          body: "",
          tags: "some more other tags",
        },
      ],
    });

    const tagLabels = screen.getAllByTestId("node-search-tag-label");
    expect(tagLabels).toHaveLength(5);

    expect(tagLabels[0].textContent).toEqual("some");
    expect(tagLabels[1].textContent).toEqual("test");
    expect(tagLabels[2].textContent).toEqual("tags");
    expect(tagLabels[3].textContent).toEqual("more");
    expect(tagLabels[4].textContent).toEqual("other");
  });

  it("renders plural nodes if there are more than 1 node with a tag", () => {
    renderWithProvider(<TagList />, {
      ...defaultState,
      nodes: [
        {
          title: "Some Node",
          body: "",
          tags: "some test tags",
        },
        {
          title: "Some Other Node",
          body: "",
          tags: "other test tags",
        },
      ],
    });

    const tagButtons = screen.getAllByTestId("node-search-tag-button");
    expect(tagButtons).toHaveLength(4);

    expect(tagButtons[0].textContent).toEqual("some1 node");
    expect(tagButtons[1].textContent).toEqual("test2 nodes");
    expect(tagButtons[2].textContent).toEqual("tags2 nodes");
    expect(tagButtons[3].textContent).toEqual("other1 node");
  });

  it("searches for a tag when the button is clicked", () => {
    const dispatch = jest.fn();

    renderWithProvider(
      <TagList />,
      {
        ...defaultState,
        nodes: [
          {
            title: "Some Node",
            body: "",
            tags: "cool-tag",
          },
        ],
      },
      dispatch
    );

    fireEvent.click(screen.getByTestId("node-search-tag-button"));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(searchForTag("cool-tag"));
  });
});
