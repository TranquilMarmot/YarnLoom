/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { getNodes } from "../../state/Selectors";
import { useYarnState } from "../../state/YarnContext";
import { searchForTag } from "../../state/UiActions";

import { YarnNode } from "loom-common/YarnNode";

import { listItemBase } from "../../Styles";

const containerStyle = css`
  max-height: 320px;
  overflow-y: auto;
`;

const listItemStyle = css`
  justify-content: space-between;
  padding-right: 20px;
`;

const noTagsMessageStyle = css`
  padding: 5px;
`;

interface TagInfo {
  [tag: string]: number;
}

const getTagsFromNodes = (nodes: YarnNode[]) => {
  const tags: TagInfo = {};

  nodes.forEach((node) => {
    // tags are separated by spaces
    node.tags.split(" ").forEach((tag) => {
      // ignore empty tags
      if (tag.trim().length > 0) {
        if (!tags[tag]) {
          tags[tag] = 1;
        } else {
          tags[tag] = tags[tag] + 1;
        }
      }
    });
  });

  return tags;
};

const NodeList: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();

  const nodes = getNodes(state);
  const tags = getTagsFromNodes(nodes);
  const tagNames = Object.keys(tags);

  return (
    <div css={containerStyle} data-testid="node-search-tag-list">
      {tagNames.length === 0 ? (
        <div css={noTagsMessageStyle}>No tags</div>
      ) : (
        tagNames.map((tag) => (
          <button
            data-testid="node-search-tag-button"
            key={`tag-list-${tag}`}
            css={css`${listItemBase}${listItemStyle}`}
            onClick={() => dispatch(searchForTag(tag))}
          >
            <div data-testid="node-search-tag-label">{tag}</div>
            <div>
              {tags[tag]} node{tags[tag] > 1 ? "s" : ""}
            </div>
          </button>
        ))
      )}
    </div>
  );
};

export default NodeList;
