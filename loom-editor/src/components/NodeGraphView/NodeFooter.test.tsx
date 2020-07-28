import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import { searchForTag } from "../../state/UiActions";

import NodeFooter from "./NodeFooter";
import { YarnNode } from "loom-common/YarnNode";

describe("<NodeFooter />", () => {
  const node: YarnNode = {
    title: "Test node",
    body: "",
    tags: "",
  };

  it("renders", () => {
    renderWithProvider(
      <NodeFooter
        node={node}
        onOpenTagChooser={() => {}}
        nodeColor="#fff"
        nodeColorIsDark={false}
      />
    );
  });

  it("renders all tags", () => {
    const nodeWithTags = {
      ...node,
      tags: "a lot of different tags",
    };
    renderWithProvider(
      <NodeFooter
        node={nodeWithTags}
        onOpenTagChooser={() => {}}
        nodeColor="#fff"
        nodeColorIsDark={false}
      />
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
      <NodeFooter
        node={nodeWithTags}
        onOpenTagChooser={() => {}}
        nodeColor="#fff"
        nodeColorIsDark={false}
      />,
      undefined,
      dispatch
    );

    fireEvent.click(await screen.getByText("some"));
    fireEvent.click(await screen.getByText("tags"));

    expect(dispatch).toHaveBeenCalledTimes(2);

    expect(dispatch).toHaveBeenNthCalledWith(1, searchForTag("some"));
    expect(dispatch).toHaveBeenNthCalledWith(2, searchForTag("tags"));
  });

  it("opens the tag chooser", () => {
    const onOpenTagChooserSpy = jest.fn();

    renderWithProvider(
      <NodeFooter
        node={node}
        onOpenTagChooser={onOpenTagChooserSpy}
        nodeColor="#fff"
        nodeColorIsDark={false}
      />
    );

    fireEvent.click(screen.getByTitle("Manage node tags"));

    expect(onOpenTagChooserSpy).toHaveBeenCalledTimes(1);
  });
});
