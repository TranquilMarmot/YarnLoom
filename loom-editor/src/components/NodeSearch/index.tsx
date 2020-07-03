/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import { ReactComponent as ChevronDown } from "../../icons/chevron-down.svg";
import { ReactComponent as ChevronRight } from "../../icons/chevron-right.svg";

import { useYarnState } from "../../state/YarnContext";

import SearchBox from "./SearchBox";
import NodeList from "./NodeList";
import TagList from "./TagList";

const containerStyle = css`
  position: absolute;
  top: 5px;
  left: 5px;

  border: 1px solid var(--vscode-panelSection-border);

  color: var(--vscode-input-foreground);
  font-weight: 600;

  background-color: var(--vscode-sideBar-background);
  color: var(--vscode-foreground);
`;

const expandListButtonStyle = css`
  color: var(--vscode-foreground);

  background: none;
  border: none;
  outline: none;

  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 0;
  padding-right: 0;

  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
    background-color: var(--vscode-list-inactiveSelectionBackground);
  }

  :focus {
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
  }
`;

const chevronIconStyle = css`
  margin-right: 3px;
`;

const NodeSearch: FunctionComponent = () => {
  const [state] = useYarnState();
  const [showingNodeList, setShowingNodeList] = useState(false);
  const [showingTagList, setShowingTagList] = useState(false);

  if (!state) {
    return null;
  }
  return (
    <div css={containerStyle}>
      <SearchBox />
      <button
        type="button"
        css={expandListButtonStyle}
        onClick={() => setShowingNodeList(!showingNodeList)}
      >
        {showingNodeList ? (
          <ChevronDown css={chevronIconStyle} />
        ) : (
          <ChevronRight css={chevronIconStyle} />
        )}{" "}
        Nodes
      </button>
      {showingNodeList && <NodeList />}

      <button
        type="button"
        css={expandListButtonStyle}
        onClick={() => setShowingTagList(!showingTagList)}
      >
        {showingTagList ? (
          <ChevronDown css={chevronIconStyle} />
        ) : (
          <ChevronRight css={chevronIconStyle} />
        )}{" "}
        Tags
      </button>
      {showingTagList && <TagList />}
    </div>
  );
};

export default NodeSearch;
