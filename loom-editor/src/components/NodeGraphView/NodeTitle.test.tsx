import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import { deleteNode, renameNode } from "loom-common/EditorActions";

import NodeTitle from "./NodeTitle";

describe("<NodeTitle />", () => {
  const nodeTitle = "Some Title";

  it("renders", () => {
    renderWithProvider(
      <NodeTitle title={nodeTitle} onOpenColorChooser={() => {}} />
    );
  });

  it("posts message when trying to delete node", () => {
    window.vsCodeApi = { postMessage: jest.fn() };

    renderWithProvider(
      <NodeTitle title={nodeTitle} onOpenColorChooser={() => {}} />
    );

    fireEvent.click(screen.getByLabelText("Delete node"));

    // this posts a message to the extension which shows the confirm/cancel message
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(1);
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledWith(
      deleteNode(nodeTitle)
    );
  });

  it("shows color picker when color picker button is clicked", () => {
    const onOpenColorChooserSpy = jest.fn();

    renderWithProvider(
      <NodeTitle title={nodeTitle} onOpenColorChooser={onOpenColorChooserSpy} />
    );

    fireEvent.click(screen.getByLabelText("Change node color"));

    expect(onOpenColorChooserSpy).toHaveBeenCalledTimes(1);
  });

  it("posts message when rename button is clicked", () => {
    window.vsCodeApi = { postMessage: jest.fn() };

    renderWithProvider(
      <NodeTitle title={nodeTitle} onOpenColorChooser={() => {}} />
    );

    fireEvent.click(screen.getByLabelText("Rename node"));

    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(1);
    expect(window.vsCodeApi.postMessage).toHaveBeenCalledWith(
      renameNode(nodeTitle)
    );
  });
});
