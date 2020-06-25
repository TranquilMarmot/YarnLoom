/**
 * Describes the position of a node in the graph.
 * These positions are only used in the editor and have no real effect on the node.
 */
export interface YarnNodePosition {
  /** X position of the node */
  x: number;

  /** Y position of the node */
  y: number;
}

/** Represents a node in the Yarn file */
export interface YarnNode {
  /**
   * The title of the node
   * Note that this is also the primary identifier for the node.
   */
  title: string;

  /** Space-separated list of tags for the node */
  tags: string;

  /** Actual text of the node */
  body: string;

  /** Position of the node in the graph; only used in the editor for laying out nodes */
  position?: YarnNodePosition;

  /** Used in the editor to  */
  colorID?: number;

  /** List of titles of nodes that this node links to */
  links?: string[];
}

/** List of tags that mark variables and start/end points in a node */
enum Tags { // enum instead of an object so we get intellisense with docs
  /** The title of the node; also used as its unique ID */
  Title = "title: ",

  /** Space-separated list of tags for the node */
  Tags = "tags: ",

  /** (Optional) Position of the node. Will be `x,y`. Comma is required. */
  Position = "position: ",

  /** (Optional) ID of the color of this node */
  ColorId = "colorID: ",

  /** Marks the start of the node's body */
  NodeBodyStart = "---",

  /** Marks the end of the node's body */
  NodeBodyEnd = "===",
}

/**
 * Create text to display in a text editor for one specific node.
 * This is used in the case of opening a node in the VSCode text editor.
 *
 * The --- and === are required for the node to be considered valid.
 */
export const createNodeText = ({
  title,
  tags,
  body,
  position,
  colorID,
}: YarnNode): string => {
  let nodeText = `${Tags.Title}${title}\n${Tags.Tags}${tags}\n`;

  if (position) {
    nodeText += `${Tags.Position}${position.x},${position.y}\n`;
  }

  if (colorID) {
    nodeText += `${Tags.ColorId}${colorID}\n`;
  }

  nodeText += `${Tags.NodeBodyStart}\n${body.trim()}\n${Tags.NodeBodyEnd}`;

  return nodeText;
};

/**
 * Parse text back out into a node.
 * This is used when the node file being worked on changes.
 */
export const parseNodeText = (text: string): YarnNode => {
  const node: YarnNode = {
    title: "",
    tags: "",
    body: "",
  };

  let readingBody = false;

  const lines = text.split("\n");

  // this is essentially a copy-pasta of what's in YarnEditor's data.js loadData function
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (readingBody && line !== Tags.NodeBodyEnd) {
      // we're reading the body and haven't hit the end yet, append the line to our current body
      node.body += `${line}${i < lines.length ? "\n" : ""}`;
    } else {
      if (line.startsWith(Tags.Title)) {
        // title:
        node.title = line
          .substr(Tags.Title.length, line.length - Tags.Title.length)
          .trim();
      } else if (line.startsWith(Tags.Tags)) {
        // tags:
        node.tags = line
          .substr(Tags.Tags.length, line.length - Tags.Tags.length)
          .trim();
      } else if (line.startsWith(Tags.Position)) {
        // position:
        const xy = line
          .substr(Tags.Position.length, line.length - Tags.Position.length)
          .split(",");
        node.position = { x: Number(xy[0].trim()), y: Number(xy[1].trim()) };
      } else if (line.startsWith(Tags.ColorId)) {
        // colorID:
        node.colorID = Number.parseInt(
          line
            .substr(Tags.ColorId.length, line.length - Tags.ColorId.length)
            .trim()
        );
      } else if (line.trim() === Tags.NodeBodyStart) {
        // ---
        // (body start)
        readingBody = true;
      }
    }
  }

  node.body = node.body.trim();

  return node;
};

/**
 * Find a node in the node list by its title
 * @param nodes List of all nodes
 * @param title Title of node to get
 * @returns Node with title, or undefined if no node exists with that title
 */
export const getNodeByTitle = (
  nodes: YarnNode[],
  title: string
): YarnNode | undefined =>
  Object.values(nodes).find((node) => node.title.trim() === title.trim());
