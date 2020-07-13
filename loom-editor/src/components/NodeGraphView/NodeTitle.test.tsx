import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import { deleteNode } from "loom-common/EditorActions";

import NodeTitle from "./NodeTitle";

describe("<NodeTitle />", () => {
  const nodeTitle = "Some Title";

  it("renders", () => {
    renderWithProvider(<NodeTitle title={nodeTitle} />);
  });

  it("posts message when trying to delete node", () => {
    window.vsCodeApi = { postMessage: jest.fn() };

    renderWithProvider(<NodeTitle title={nodeTitle} />);

    fireEvent.click(screen.getByTestId("node-title-delete-button"));

    // this posts a message to the extension which shows the confirm/cancel message
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(1);
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledWith(
      deleteNode(nodeTitle)
    );
  });

  it("shows color picker when color picker button is clicked", () => {
    renderWithProvider(<NodeTitle title={nodeTitle} />);

    expect(screen.queryByTestId("node-title-color-chooser")).toBeNull();

    fireEvent.click(screen.getByTestId("node-title-color-button"));

    expect(screen.queryByTestId("node-title-color-chooser")).not.toBeNull();
  });
});
