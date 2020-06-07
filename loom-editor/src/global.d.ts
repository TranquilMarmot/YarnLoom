import EditorActions from "loom-common/EditorActionType";

// needed or else we get an error
export {};

declare global {
  interface Window {
    vsCodeApi: {
      postMessage: (message: EditorActions) => void;
    };
  }
}
