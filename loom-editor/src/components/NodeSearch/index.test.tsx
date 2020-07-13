import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProvider } from "../../utils/test-utils";

import NodeSearch from "./";

describe("<NodeSearch />", () => {
  it("renders", () => {
    renderWithProvider(<NodeSearch />);
  });

  it("shows node list when node list button is clicked", () => {
    renderWithProvider(<NodeSearch />);

    expect(screen.queryByTestId("node-search-node-list")).toBeNull();

    fireEvent.click(screen.getByTestId("node-search-show-node-list-button"));

    expect(screen.queryByTestId("node-search-node-list")).not.toBeNull();
  });

  it("shows tag list when tag list button is clicked", () => {
    renderWithProvider(<NodeSearch />);

    expect(screen.queryByTestId("node-search-tag-list")).toBeNull();

    fireEvent.click(screen.getByTestId("node-search-show-tag-list-button"));

    expect(screen.queryByTestId("node-search-tag-list")).not.toBeNull();
  });
});
