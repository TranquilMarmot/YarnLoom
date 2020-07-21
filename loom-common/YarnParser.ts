import { YarnNode, getNodeByTitle } from "./YarnNode";

/**
 * Parse a yarn file into a list of yarn nodes
 * @param file Text of file to parse
 */
export const parseYarnFile = (file: string): YarnNode[] => {
  const emptyNode: YarnNode = {
    title: "",
    tags: "",
    body: "",
  };
  const nodes: YarnNode[] = [];
  const lines = file.split(/\r?\n/);
  let obj: YarnNode | undefined = undefined;
  let readingBody = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "===") {
      readingBody = false;
      if (obj) {
        nodes.push(obj);
        obj = undefined;
      }
    } else if (readingBody) {
      if (!obj) {
        obj = { ...emptyNode };
      }
      obj.body += lines[i] + "\n";
    } else {
      if (lines[i].indexOf("title:") > -1) {
        if (!obj) {
          obj = { ...emptyNode };
        }

        obj.title = lines[i].substr(7, lines[i].length - 7);
      } else if (lines[i].indexOf("position:") > -1) {
        if (!obj) {
          obj = { ...emptyNode };
        }

        const xy = lines[i].substr(9, lines[i].length - 9).split(",");
        obj.position = { x: Number(xy[0].trim()), y: Number(xy[1].trim()) };
      } else if (lines[i].indexOf("colorID:") > -1) {
        if (!obj) {
          obj = { ...emptyNode };
        }

        obj.colorID = Number(lines[i].substr(9, lines[i].length - 9).trim());
      } else if (lines[i].indexOf("tags:") > -1) {
        if (!obj) {
          obj = { ...emptyNode };
        }

        obj.tags = lines[i].substr(6, lines[i].length - 6);
      } else if (lines[i].trim() == "---") {
        readingBody = true;
      }
    }
  }

  // build up the list of links
  buildLinksFromNodes(nodes, false);

  return nodes;
};

/**
 * Given the text body of a yarn node, returns the list of titles of nodes that it links to
 * @param body Body of node to find links for
 */
export const getLinkedNodesFromNodeBody = (
  body: string
): string[] | undefined => {
  // links look like `[[Text|Node title]]`
  const links = body.match(/\[\[(.*?)\]\]/g);

  if (links != undefined) {
    // used to keep track of links we've already seen
    const exists: { [key: string]: boolean } = {};

    for (let i = links.length - 1; i >= 0; i--) {
      // cut off the `[[` and `]]` in the link text
      links[i] = links[i].substr(2, links[i].length - 4).trim();

      // if the link has a `|` we only care about the second part
      if (links[i].indexOf("|") >= 0) {
        links[i] = links[i].split("|")[1];
      }

      // if we've already seen this link, remove it from the list
      if (exists[links[i]] != undefined) {
        links.splice(i, 1);
      }

      // mark the link as seen
      exists[links[i]] = true;
    }

    return links;
  } else {
    return undefined;
  }
};

/**
 * Re-build the list of links for all the given nodes.
 * If automatically creating new nodes, will return a list of the added nodes.
 *
 * @param nodes Nodes to re-build links for
 * @param autoCreateLinkedNodes Whether or not to automatically create new nodes for links that are pointing to non-existant nodes
 * @returns List of added nodes
 */
export const buildLinksFromNodes = (
  nodes: YarnNode[],
  autoCreateLinkedNodes: boolean
): YarnNode[] => {
  const addedNodes: YarnNode[] = [];

  nodes.forEach((node) => {
    node.links = getLinkedNodesFromNodeBody(node.body);

    // auto-create any new links that don't exist yet
    if (autoCreateLinkedNodes) {
      node.links?.forEach((link) => {
        if (!getNodeByTitle(nodes, link)) {
          const node: YarnNode = {
            title: link,
            tags: "",
            body: "\n",
          };

          nodes.push(node);
          addedNodes.push(node);
        }
      });
    }
  });

  return addedNodes;
};

/**
 * Will rename all links that point to a node to a new title.
 * @param nodes List of all nodes
 * @param oldTitle Title of node to rename links to
 * @param newTitle New title of node being renamed
 * @returns List of nodes that were changed
 */
export const renameLinksFromNode = (
  nodes: YarnNode[],
  oldTitle: string,
  newTitle: string
): YarnNode[] => {
  const updatedNodes: YarnNode[] = [];

  nodes.forEach((node) => {
    // because this is a changing regex, we have to use the constructor and "double-escape" the literal characters
    // links come in two forms:
    // [[Some text.|some-node-title]]
    // [[some-node-title]]
    //
    // Here, we're using RegEx capturing groups. The actual regex looks something like:
    // [[(.*?\|)(some-node-title)]]
    //
    // This results in capturing two groups:
    // $1 is the text of the link, with the "|" at the end. When there is no text, this is empty.
    // $2 is the title of the node being renamed. We throw this out and replace it with the new title.
    //
    // The replacement of:
    // [[$1${newTitle}]]
    // is essentially just grabbing the optional node text and then appending the new title
    const regex = new RegExp(`\\[\\[(.*?\\|?)(${oldTitle})\\]\\]`, "g");

    if (node.body.match(regex)) {
      node.body = node.body.replace(regex, `[[$1${newTitle}]]`);
      updatedNodes.push(node);
    }
  });

  return updatedNodes;
};
