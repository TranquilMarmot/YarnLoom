/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useRef } from "react";

import {
  setSearchString,
  setSearchingNodeTitles,
  setSearchingNodeBodies,
  setSearchingNodeTags,
} from "../../state/UiActions";

import { useYarnState } from "../../state/YarnContext";
import {
  getSearchingTitle,
  getSearchingBody,
  getSearchingTags,
  getSearchString,
} from "../../state/Selectors";

const formStyle = css`
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);

  display: flex;
  align-items: center;

  margin: 10px;

  border: 1px solid transparent;

  :focus-within {
    border: 1px solid var(--vscode-inputOption-activeBackground);
  }
`;

const searchInputStyle = css`
  background-color: var(--vscode-input-background);
  color: var(--vscode-input-foreground);

  /* The outline is actually added by the form via the :focus-within pseudo-class */
  outline: none !important;

  padding: 5px;
  border: none;

  ::placeholder {
    color: var(--vscode-input-placeholderForeground);
  }
`;

const buttonStyle = css`
  border: none;
  outline: none;
  background-color: transparent;

  color: var(--vscode-input-placeholderForeground);

  width: 40px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-right: 5px;

  :hover {
    color: var(--vscode-input-foreground);
    cursor: pointer;
  }
`;

/** Style given to one of the buttons when it is active */
const buttonActiveStyle = css`
  background-color: var(--vscode-inputOption-activeBackground);
  color: var(--vscode-inputOption-activeForeground);

  /* Always want the color the same here; this is overriding the buttonStyle above */
  :hover {
    color: var(--vscode-inputOption-activeForeground);
  }
`;

const SearchBox: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();

  // used to focus back on the input when clicking buttons in this box
  const inputRef = useRef<HTMLInputElement>(null);

  if (!state) {
    return null;
  }

  const searchingTitle = getSearchingTitle(state);
  const searchingBody = getSearchingBody(state);
  const searchingTags = getSearchingTags(state);
  const searchString = getSearchString(state);

  return (
    <form css={formStyle}>
      <input
        ref={inputRef}
        css={searchInputStyle}
        type="search"
        placeholder="Search"
        value={searchString}
        data-testid="search-box-input"
        onChange={(e) => dispatch(setSearchString(e.target.value))}
      />
      <div>
        <button
          css={css`${buttonStyle}${searchingTitle && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={searchingTitle}
          data-testid="search-box-title-button"
          onClick={() => {
            dispatch(setSearchingNodeTitles(!searchingTitle));
            inputRef?.current?.focus();
          }}
        >
          Title
        </button>

        <button
          css={css`${buttonStyle}${searchingBody && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={searchingBody}
          data-testid="search-box-body-button"
          onClick={() => {
            dispatch(setSearchingNodeBodies(!searchingBody));
            inputRef?.current?.focus();
          }}
        >
          Body
        </button>

        <button
          css={css`${buttonStyle}${searchingTags && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={searchingTags}
          data-testid="search-box-tags-button"
          onClick={() => {
            dispatch(setSearchingNodeTags(!searchingTags));
            inputRef?.current?.focus();
          }}
        >
          Tags
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
