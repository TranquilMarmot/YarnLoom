/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useState } from "react";

import {
  setSearchString,
  setSearchingNodeTitles,
  setSearchingNodeBodies,
  setSearchingNodeTags,
} from "loom-common/EditorActions";

import { useYarnState } from "../../state/YarnContext";
import {
  getSearchingTitle,
  getSearchingBody,
  getSearchingTags,
  getSearchString,
} from "../../state/Selectors";

import { ReactComponent as ChevronDown } from "../../icons/chevron-down.svg";
import { ReactComponent as ChevronRight } from "../../icons/chevron-right.svg";

import NodeList from "./NodeList";

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

const searchInputStyle = css`
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);
  outline-color: var(--vscode-inputOption-activeBackground) !important;
  /* outline-color: rgba(
    0,
    122,
    204,
    0
  ); This should be  var(--vscode-inputOption-activeBorder) but that didn't work */

  border: none;
  padding: 5px;
  margin: 10px;

  ::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }
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

// --vscode-inputOption-activeBackground for checked options

const NodeSearch: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();
  const [showingNodeList, setShowingNodeList] = useState(false);

  if (!state) {
    return null;
  }

  const searchingTitle = getSearchingTitle(state);
  const searchingBody = getSearchingBody(state);
  const searchingTags = getSearchingTags(state);
  const searchString = getSearchString(state);

  return (
    <div css={containerStyle}>
      <form>
        <input
          css={searchInputStyle}
          type="search"
          placeholder="Search"
          value={searchString}
          onChange={(e) => dispatch(setSearchString(e.target.value))}
        />
        <div>
          {/* Title checkbox */}
          <input
            type="checkbox"
            id="titleSearchCheckbox"
            name="titleSearch"
            checked={searchingTitle}
            onChange={(e) => dispatch(setSearchingNodeTitles(e.target.checked))}
          />
          <label htmlFor="titleSearchCheckbox">Title</label>

          {/* Body checkbox */}
          <input
            type="checkbox"
            id="bodySearchCheckbox"
            name="bodySearch"
            checked={searchingBody}
            onChange={(e) => dispatch(setSearchingNodeBodies(e.target.checked))}
          />
          <label htmlFor="bodySearchCheckbox">Body</label>

          {/* Tags checkbox */}
          <input
            type="checkbox"
            id="tagsSearchCheckbox"
            name="tagsSearch"
            checked={searchingTags}
            onChange={(e) => dispatch(setSearchingNodeTags(e.target.checked))}
          />
          <label htmlFor="tagsSearchCheckbox">Tags</label>
        </div>
      </form>
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
