/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent, useRef } from "react";

import { ReactComponent as CaseSensitiveIcon } from "../../icons/case-sensitive.svg";
import { ReactComponent as RegExIcon } from "../../icons/regex.svg";

import {
  setSearchString,
  setSearchingNodeTitles,
  setSearchingNodeBodies,
  setSearchingNodeTags,
  setSearchCaseSensitive,
  setSearchRegexEnabled,
} from "../../state/UiActions";

import { useYarnState } from "../../state/YarnContext";
import {
  getSearchingTitle,
  getSearchingBody,
  getSearchingTags,
  getSearchString,
  getCaseSensitivityEnabled,
  getRegexEnabled,
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

const buttonContainerStyle = css`
  display: flex;
  align-items: center;
`;

const buttonStyle = css`
  border: none;
  outline: none;
  background-color: transparent;

  margin-right: 3px;

  color: var(--vscode-input-placeholderForeground);

  :hover {
    color: var(--vscode-input-foreground);
    cursor: pointer;
  }
`;

const textButtonStyle = css`
  ${buttonStyle}

  width: 40px;
  padding-top: 2px;
  padding-bottom: 2px;
`;

const iconButtonStyle = css`
  ${buttonStyle}

  height: 19px;
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
  const caseSensitivityEnabled = getCaseSensitivityEnabled(state);
  const regexEnabled = getRegexEnabled(state);
  const searchString = getSearchString(state);

  return (
    <form css={formStyle}>
      <input
        ref={inputRef}
        css={searchInputStyle}
        type="search"
        placeholder="Search"
        value={searchString}
        aria-label="Search for text within nodes"
        onChange={(e) => dispatch(setSearchString(e.target.value))}
      />
      <div css={buttonContainerStyle}>
        <button
          css={css`
            ${iconButtonStyle}
            ${caseSensitivityEnabled && buttonActiveStyle}
          `}
          type="button"
          role="switch"
          aria-checked={false}
          onClick={() => {
            dispatch(setSearchCaseSensitive(!caseSensitivityEnabled));
            inputRef?.current?.focus();
          }}
        >
          <CaseSensitiveIcon />
        </button>
        <button
          css={css`${iconButtonStyle}${regexEnabled && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={false}
          onClick={() => {
            dispatch(setSearchRegexEnabled(!regexEnabled));
            inputRef?.current?.focus();
          }}
        >
          <RegExIcon />
        </button>
        <button
          css={css`${textButtonStyle}${searchingTitle && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={searchingTitle}
          onClick={() => {
            dispatch(setSearchingNodeTitles(!searchingTitle));
            inputRef?.current?.focus();
          }}
        >
          Title
        </button>

        <button
          css={css`${textButtonStyle}${searchingBody && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={searchingBody}
          onClick={() => {
            dispatch(setSearchingNodeBodies(!searchingBody));
            inputRef?.current?.focus();
          }}
        >
          Body
        </button>

        <button
          css={css`${textButtonStyle}${searchingTags && buttonActiveStyle}`}
          type="button"
          role="switch"
          aria-checked={searchingTags}
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
