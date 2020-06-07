import { YarnNode } from "./YarnNode";

export const parseYarnFile = (file: string): YarnNode[] => {
  const emptyNode: YarnNode = {
    title: "",
    tags: "",
    body: "",
  };
  const nodes: YarnNode[] = [];
  const lines = file.split(/\r?\n/);
  var obj: YarnNode | undefined = undefined;
  var index = 0;
  var readingBody = false;
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

        var xy = lines[i].substr(9, lines[i].length - 9).split(",");
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

  return nodes;
};

const getNodeByTitle = (
  nodes: YarnNode[],
  title: string
): YarnNode | undefined =>
  Object.values(nodes).find((node) => node.title === title);

const getLinkedNodesFromNodeBody = (body: string) => {
  const links = body.match(/\[\[(.*?)\]\]/g);

  if (links != undefined) {
    let exists: { [key: string]: boolean } = {};

    for (let i = links.length - 1; i >= 0; i--) {
      links[i] = links[i].substr(2, links[i].length - 4).trim();

      if (links[i].indexOf("|") >= 0) {
        links[i] = links[i].split("|")[1];
      }

      if (exists[links[i]] != undefined) {
        links.splice(i, 1);
      }

      exists[links[i]] = true;
    }

    return links;
  } else {
    return undefined;
  }
};

export const buildLinksFromNodes = (nodes: YarnNode[]) => {
  nodes.forEach((node) => {
    const links = getLinkedNodesFromNodeBody(node.body);
    node.links = links;
  });
};
