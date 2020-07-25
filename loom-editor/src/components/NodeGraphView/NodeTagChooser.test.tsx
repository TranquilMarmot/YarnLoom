import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import { toggleTagOnNode, promptForNewTags } from "loom-common/EditorActions";

import NodeTagChooser from "./NodeTagChooser";
import { defaultState } from "../../state/YarnContext";
import { State } from "../../Types";

describe("<NodeTagChooser />", () => {
  const node = {
    title: "Test node",
    body: "",
    tags: "some tags",
  };

  const stateWithNodes: State = {
    ...defaultState,
    nodes: [
      node,
      {
        title: "Another test node",
        body: "",
        tags: "some other tags",
      },
      {
        title: "Yet another test node",
        body: "",
        tags: "more tags",
      },
    ],
  };

  it("renders", () => {
    renderWithProvider(<NodeTagChooser node={node} onClose={() => {}} />);
  });

  it("renders all tags", () => {
    renderWithProvider(
      <NodeTagChooser node={node} onClose={() => {}} />,
      stateWithNodes
    );

    // tags we expect: some other tags more
    const buttonText = screen.queryAllByTestId("tag-chooser-tag-button-text");

    expect(buttonText).toHaveLength(4);

    // they should also be sorted
    expect(buttonText[0].textContent).toBe("more");
    expect(buttonText[1].textContent).toBe("other");
    expect(buttonText[2].textContent).toBe("some");
    expect(buttonText[3].textContent).toBe("tags");
  });

  it("chooses tags when they're clicked", async () => {
    window.vsCodeApi = { postMessage: jest.fn() };

    renderWithProvider(
      <NodeTagChooser node={node} onClose={() => {}} />,
      stateWithNodes
    );

    fireEvent.click(await screen.findByText("more"));
    fireEvent.click(await screen.findByText("other"));
    fireEvent.click(await screen.findByText("some"));
    fireEvent.click(await screen.findByText("tags"));

    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(4);

    expect(window.vsCodeApi.postMessage).toHaveBeenNthCalledWith(
      1,
      toggleTagOnNode(node.title, "more")
    );
    expect(window.vsCodeApi.postMessage).toHaveBeenNthCalledWith(
      2,
      toggleTagOnNode(node.title, "other")
    );
    expect(window.vsCodeApi.postMessage).toHaveBeenNthCalledWith(
      3,
      toggleTagOnNode(node.title, "some")
    );
    expect(window.vsCodeApi.postMessage).toHaveBeenNthCalledWith(
      4,
      toggleTagOnNode(node.title, "tags")
    );
  });

  it("opens prompts for a new tag when new tag button is clicked", async () => {
    window.vsCodeApi = { postMessage: jest.fn() };

    renderWithProvider(
      <NodeTagChooser node={node} onClose={() => {}} />,
      stateWithNodes
    );

    fireEvent.click(await screen.findByText("New tag"));

    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(1);
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledWith(
      promptForNewTags(node.title)
    );
  });

  it("closes when close button is clicked", async () => {
    const onCloseSpy = jest.fn();

    renderWithProvider(<NodeTagChooser node={node} onClose={onCloseSpy} />);

    fireEvent.click(await screen.findByText("Close"));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
