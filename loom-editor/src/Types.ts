import { YarnNode } from "loom-common/YarnNode";

export interface State {
  /** List of all nodes in the yarn file */
  nodes: YarnNode[];

  /** Info about what we're currently searching for */
  search: {
    /** Whether or not we're current searching by node title */
    searchingTitle: boolean;

    /** Whether or not we're currently seaching by node body */
    searchingBody: boolean;

    /** Whether or not we're currently searching by node tag */
    searchingTags: boolean;

    /** Whether or not to search via RegEx */
    regexEnabled: boolean;

    /** Whether or not the search should be case sensitive */
    caseSensitivityEnabled: boolean;

    /** The string we're actually searching for */
    searchString: string;
  };

  /** Node that is currently being focused on */
  focusedNode?: string;

  /** Current zoom in the graph */
  currentZoom?: number;
}
