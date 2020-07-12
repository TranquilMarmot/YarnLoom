/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

const bodyStyle = css`
  font-size: 10px;
  overflow: auto;
  padding-left: 3px;

  ::-webkit-scrollbar-corner {
    background-color: white;
  }
`;

/** If there are no tags for the node, this style is mixed in */
const noTagsBodyStyle = css`
  grid-row: 2 / 4;
`;

/** If there are tags for the node, this style is mixed in */
const withTagsBodyStyle = css`
  grid-row: 2 / 3;
`;

interface NodeBodyProps {
  /** Body of node to render */
  body: string;

  /** List of tags; not actually rendered, but used to determine the height of the body container */
  tags?: string;
}

/**
 * Parses the body of a node and adds some rudimentary syntax highlighting.
 * @param body Body to parse
 */
const parseBody = (body: string) => {
  let lines = body.split("\n");
  const newBody: JSX.Element[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // "goto" commands look like "[[Text|Node title]]"
    const extractedGoto = line.match(/\[\[(.*)\|(.*)\]\]/i);

    // "jumps" look like "[[Node title]]" so the "|" isn't always guaranteed
    // there's probably a more clever way to extract gotos and jumps with one regex, but I'm feeling lazy
    const extractedJump = line.match(/\[\[(.*)\]\]/i);

    // commands (i.e. if statements) look like "<< command >>"
    const extractedCommand = line.match(/<<(.*)>>/i);
    if (extractedGoto) {
      // syntax highlight the goto
      newBody[i] = (
        <div
          key={i}
          css={css`
            color: tomato;
          `}
          data-testid="node-body-goto-highlight"
        >
          {/* Link text */}
          [[{extractedGoto[1]}
          <span
            css={css`
              color: #3ecfe9;
            `}
            data-testid="node-body-goto-highlight-title"
          >
            {/* Node title */}|{`${extractedGoto[2]}`}
          </span>
          ]]
        </div>
      );
    } else if (extractedJump) {
      newBody[i] = (
        <div
          key={i}
          css={css`
            color: tomato;
          `}
          data-testid="node-body-jump-highlight"
        >
          [[{extractedJump[1]}]]
        </div>
      );
    } else if (extractedCommand) {
      // syntax highlight the command
      newBody[i] = (
        <div
          key={i}
          css={css`
            color: violet;
          `}
          data-testid="node-body-command-highlight"
        >
          {"<<"}
          {extractedCommand[1]}
          {">>"}
        </div>
      );
    } else {
      // otherwise, assume it's just regular ol' text
      // TODO might be a good idea to sanitize this to <i>,<b>, etc.?
      // TODO bbcode conversion here
      newBody[i] = (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: line.replace(/ /g, "\u00a0") }}
          data-testid="node-body-text"
        />
      );
    }
  }

  return newBody;
};

/** Render the body of a node with some basic syntax highlighting. */
const NodeBody: FunctionComponent<NodeBodyProps> = ({ body, tags }) => {
  return (
    <div css={css`${bodyStyle}${tags ? withTagsBodyStyle : noTagsBodyStyle}`}>
      {parseBody(body)}
    </div>
  );
};

export default NodeBody;
