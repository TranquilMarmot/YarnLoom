/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react/macro";
import { FunctionComponent } from "react";

const bodyStyle = css`
  font-size: 10px;
  overflow: auto;
  padding-left: 3px;

  grid-row: 2 / 3;

  ::-webkit-scrollbar-corner {
    background-color: white;
  }
`;

interface NodeBodyProps {
  /** Body of node to render */
  body: string;
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
          dangerouslySetInnerHTML={{
            // We replace spaces with a whitespace character so that indentation takes up space properly.
            // We also remove any line identifiers that have been added to the line (this is used to uniquely identify lines for internationalization)
            __html: line.replace(/ /g, "\u00a0").replace(/#line:.*/, ""),
          }}
          data-testid="node-body-text"
        />
      );
    }
  }

  return newBody;
};

/** Render the body of a node with some basic syntax highlighting. */
const NodeBody: FunctionComponent<NodeBodyProps> = ({ body }) => {
  return <div css={bodyStyle}>{parseBody(body)}</div>;
};

export default NodeBody;
