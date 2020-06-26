/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

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

const formStyle = css`
  position: absolute;
  top: 5px;
  left: 5px;

  padding: 20px;
  border-radius: 5px;

  color: black;
  font-weight: 600;

  background: linear-gradient(
    45deg,
    rgba(125, 255, 245, 0.75) 0%,
    rgba(255, 128, 228, 0.75) 100%
  );
`;

const NodeSearch: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();

  if (!state) {
    return null;
  }

  const searchingTitle = getSearchingTitle(state);
  const searchingBody = getSearchingBody(state);
  const searchingTags = getSearchingTags(state);
  const searchString = getSearchString(state);

  return (
    <form css={formStyle}>
      <div>Search</div>
      <input
        type="search"
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
  );
};

export default NodeSearch;
