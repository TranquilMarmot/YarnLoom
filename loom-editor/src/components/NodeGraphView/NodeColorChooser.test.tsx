import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { setNodeColor } from "loom-common/EditorActions";

import NodeColorChooser from "./NodeColorChooser";

describe("<NodeColorChooser />", () => {
  const nodeTitle = "Some Node";
  it("renders", () => {
    render(<NodeColorChooser onClose={() => {}} nodeTitle={nodeTitle} />);
  });

  it("chooses a color when a color is clicked", async () => {
    const onClose = jest.fn();

    window.vsCodeApi = { postMessage: jest.fn() };

    render(<NodeColorChooser onClose={onClose} nodeTitle={nodeTitle} />);

    const buttons = await screen.findAllByLabelText(/Choose color/);

    // just... click some buttons
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[3]);

    expect(window.vsCodeApi.postMessage).toHaveBeenCalledTimes(2);
    expect(window.vsCodeApi.postMessage).toHaveBeenNthCalledWith(
      1,
      setNodeColor(nodeTitle, 0)
    );
    expect(window.vsCodeApi.postMessage).toHaveBeenNthCalledWith(
      2,
      setNodeColor(nodeTitle, 3)
    );

    // realistically, the component will not be rendering anymore once `onClose` is called,
    // but here we just assume that since two buttons were clicked this would have been hit twice
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("closes when the Cancel button is clicked", () => {
    const onClose = jest.fn();

    render(<NodeColorChooser onClose={onClose} nodeTitle={nodeTitle} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
