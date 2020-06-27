import { css } from "@emotion/core";

/** Base button styles */
export const buttonBase = css`
  border: none;
  outline: none;
  background-color: var(--vscode-input-background);

  color: var(--vscode-input-placeholderForeground);

  :hover {
    color: var(--vscode-input-foreground);
    cursor: pointer;
  }
`;

/** Used to style a button in a list of items */
export const listItemBase = css`
  display: flex;

  color: var(--vscode-menu-foreground);

  width: 100%;
  height: 40px;

  background: none;
  border: none;
  outline: none !important;

  text-align: left;

  :hover {
    cursor: pointer;
    background-color: var(--vscode-list-inactiveSelectionBackground);
  }

  :focus {
    background-color: var(--vscode-list-focusBackground);
  }
`;
