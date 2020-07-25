import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import NodeList from "./NodeList";
import { YarnNode } from "loom-common/YarnNode";
import { defaultState } from "../../state/YarnContext";
import { setFocusedNode } from "../../state/UiActions";
import { createNewNode } from "loom-common/EditorActions";

describe("<NodeList />", () => {
  const nodeList: YarnNode[] = [
    {
      title: "Start",
      body: "",
      tags: "",
    },
    {
      title: "Node 1",
      body: "",
      tags: "",
    },
    {
      title: "Node 2",
      body: "",
      tags: "",
    },
  ];

  it("renders", () => {
    renderWithProvider(<NodeList />);
  });

  it("renders every node", () => {
    renderWithProvider(<NodeList />, {
      ...defaultState,
      nodes: nodeList,
    });

    const nodeButtons = screen.getAllByTestId("node-search-node-button");
    expect(nodeButtons).toHaveLength(nodeList.length);
    expect(nodeButtons[0].textContent).toEqual(" Start");
    expect(nodeButtons[1].textContent).toEqual(" Node 1");
    expect(nodeButtons[2].textContent).toEqual(" Node 2");
  });

  it("focuses on a node when it's clicked", () => {
    const dispatch = jest.fn();

    renderWithProvider(
      <NodeList />,
      {
        ...defaultState,
        nodes: nodeList,
      },
      dispatch
    );

    const nodeButtons = screen.getAllByTestId("node-search-node-button");

    fireEvent.click(nodeButtons[0]);
    fireEvent.click(nodeButtons[1]);
    fireEvent.click(nodeButtons[2]);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      setFocusedNode(nodeList[0].title)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      setFocusedNode(nodeList[1].title)
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      3,
      setFocusedNode(nodeList[2].title)
    );
  });

  it("adds new nodes", () => {
    window.vsCodeApi = {
      postMessage: jest.fn(),
    };

    renderWithProvider(<NodeList />);

    fireEvent.click(screen.getByText("Add new node"));

    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(1);
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledWith(createNewNode());
  });
});
