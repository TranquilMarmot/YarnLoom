// Any function/import that's called from extension code that lives in the `vscode`
// package needs to be mocked here.

const workspace: any = {
  name: undefined,
  openTextDocument: jest.fn().mockImplementation(() => ({
    then: (fn: () => void) => {
      fn();
    },
  })),
  onDidChangeConfiguration: jest.fn(),
  applyEdit: jest.fn(),
};

// @ts-ignore
const window = {
  showTextDocument: jest.fn(),
  showInformationMessage: jest.fn().mockImplementation(() => ({
    then: (fn: () => void) => {
      fn();
    },
  })),
};

const __setWorkspaceName = (name: string) => {
  workspace.name = name;
};

const __setInformationMessageResponse = (response: string) => {
  const mock = jest.fn().mockImplementationOnce(() => ({
    then: (fn: (response: string) => void) => {
      fn(response);
    },
  }));

  (window as any).showInformationMessage = mock;

  return mock;
};

const Uri = {
  file: (f: string) => f,
  parse: jest.fn(),
};

enum ViewColumn {
  Beside,
}

// @ts-ignore
const Range = jest.fn();

const Position = jest.fn();

const WorkspaceEdit = jest.fn().mockImplementation(() => ({
  replace: jest.fn(),
  insert: jest.fn(),
}));

module.exports = {
  workspace,
  window,
  ViewColumn,
  Uri,
  Range,
  Position,
  WorkspaceEdit,
  __setWorkspaceName,
  __setInformationMessageResponse,
};
