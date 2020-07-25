import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import { searchForTag } from "../../state/UiActions";

import NodeTags from "./NodeTags";
import { YarnNode } from "loom-common/YarnNode";

describe("<NodeTags />", () => {
  const node: YarnNode = {
    title: "Test node",
    body: "",
    tags: "",
  };

  it("renders", () => {
    renderWithProvider(<NodeTags node={node} onOpenTagChooser={() => {}} />);
  });

  it("renders all tags", () => {
    const nodeWithTags = {
      ...node,
      tags: "a lot of different tags",
    };
    renderWithProvider(
      <NodeTags node={nodeWithTags} onOpenTagChooser={() => {}} />
    );

    expect(screen.getAllByTestId("node-tag-button")).toHaveLength(5);
  });

  it("searches for a tag when the tag is clicked", async () => {
    const dispatch = jest.fn();

    const nodeWithTags = {
      ...node,
      tags: "some tags",
    };

    renderWithProvider(
      <NodeTags node={nodeWithTags} onOpenTagChooser={() => {}} />,
      undefined,
      dispatch
    );

    fireEvent.click(await screen.getByText("some"));
    fireEvent.click(await screen.getByText("tags"));

    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(1, searchForTag("some"));
    expect(dispatch).toHaveBeenNthCalledWith(2, searchForTag("tags"));
  });
});
