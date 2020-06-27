/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { FunctionComponent } from "react";

import { getNodes } from "../../state/Selectors";
import { useYarnState } from "../../state/YarnContext";

const NodeList: FunctionComponent = () => {
  const [state, dispatch] = useYarnState();

  const nodes = getNodes(state);

  return (
    <div>
      {nodes.map((node) => (
        <div>{node.title}</div>
      ))}
    </div>
  );
};

export default NodeList;
