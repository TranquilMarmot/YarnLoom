/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import { ReactComponent as ChevronDown } from "../../icons/chevron-down.svg";
import { ReactComponent as ChevronRight } from "../../icons/chevron-right.svg";

import { useYarnState } from "../../state/YarnContext";

import NodeList from "./NodeList";
import SearchBox from "./SearchBox";

const containerStyle = css`
  position: absolute;
  top: 5px;
  left: 5px;

  border: 1px solid var(--vscode-panelSection-border);

  color: var(--vscode-input-foreground);
  font-weight: 600;

  background-color: var(--vscode-menu-background);
  color: var(--vscode-foreground);
`;

const nodeListButtonStyle = css`
  color: var(--vscode-foreground);

  background: none;
  border: none;
  outline: none;

  width: 100%;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 0;
  padding-right: 0;
  margin-top: 5px;

  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  :focus {
    background-color: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
  }
`;

const NodeSearch: FunctionComponent = () => {
  const [state] = useYarnState();
  const [showingNodeList, setShowingNodeList] = useState(false);

  if (!state) {
    return null;
  }
  return (
    <div css={containerStyle}>
      <SearchBox />
      <button
        type="button"
        css={nodeListButtonStyle}
        onClick={() => setShowingNodeList(!showingNodeList)}
      >
        {showingNodeList ? <ChevronDown /> : <ChevronRight />} Node List
      </button>
      {showingNodeList && <NodeList />}
    </div>
  );
};

export default NodeSearch;
