import { css } from "@emotion/core";

/** Base button styles */
export const buttonBase = css`
  background: linear-gradient(
    45deg,
    rgba(125, 255, 245, 1) 0%,
    rgba(255, 128, 228, 1) 100%
  );

  border: 1px solid #3300ff00;
  border-radius: 5px;

  height: 30px;

  :hover {
    cursor: pointer;
  }
`;
