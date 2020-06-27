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
