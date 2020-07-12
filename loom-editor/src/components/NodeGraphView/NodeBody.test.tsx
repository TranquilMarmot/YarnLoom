import React from "react";
import { render, screen } from "@testing-library/react";

import NodeBody from "./NodeBody";

describe("<NodeBody />", () => {
  const body = `Person A: Hello.
Person B: How's it going!
<<if visited("Some Node") is false>>
[[Some Node]]
<<else>>
[[It's going well.|Going Well]]
[[It's going bad.|Going Bad]]
<<endif>>
`;
  it("renders", () => {
    render(<NodeBody body="Some body" />);
  });

  it("syntax highlights goto statements", () => {
    render(<NodeBody body={body} />);

    const gotoHighlights = screen.queryAllByTestId("node-body-goto-highlight");

    expect(gotoHighlights).toHaveLength(2);

    expect(gotoHighlights[0].textContent).toEqual(
      "[[It's going well.|Going Well]]"
    );
    expect(gotoHighlights[1].textContent).toEqual(
      "[[It's going bad.|Going Bad]]"
    );

    const goingWellTitle = gotoHighlights[0].querySelector(
      "[data-testid='node-body-goto-highlight-title']"
    );
    expect(goingWellTitle?.textContent).toEqual("|Going Well");

    const goingBadTitle = gotoHighlights[1].querySelector(
      "[data-testid='node-body-goto-highlight-title']"
    );
    expect(goingBadTitle?.textContent).toEqual("|Going Bad");
  });

  it("syntax highlights jumps", () => {
    render(<NodeBody body={body} />);

    const jumpHighlights = screen.queryAllByTestId("node-body-jump-highlight");

    expect(jumpHighlights).toHaveLength(1);

    expect(jumpHighlights[0]).toHaveTextContent("[[Some Node]]");
  });

  it("syntax highlights commands", () => {
    render(<NodeBody body={body} />);

    const commandHighlights = screen.queryAllByTestId(
      "node-body-command-highlight"
    );

    expect(commandHighlights).toHaveLength(3);

    expect(commandHighlights[0].textContent).toEqual(
      '<<if visited("Some Node") is false>>'
    );

    expect(commandHighlights[1].textContent).toEqual("<<else>>");

    expect(commandHighlights[2].textContent).toEqual("<<endif>>");
  });

  it("leaves text alone", () => {
    render(<NodeBody body={body} />);

    const textNodes = screen.queryAllByTestId("node-body-text");

    expect(textNodes).toHaveLength(3);

    // we replace " " with "\u00a0" so it actually takes up space
    expect(textNodes[0].textContent).toEqual("Person\u00a0A:\u00a0Hello.");
    expect(textNodes[1].textContent).toEqual(
      "Person\u00a0B:\u00a0How's\u00a0it\u00a0going!"
    );
    expect(textNodes[2].textContent).toEqual(""); // newline
  });
});
