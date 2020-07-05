// Any function/import that's called from extension code that lives in the `vscode`
// package needs to be mocked here.

const workspace: any = {
  name: undefined,
  openTextDocument: jest.fn().mockImplementation(() => ({
    then: (fn: () => void) => {
      fn();
    },
  })),
};

// @ts-ignore
const window = { showTextDocument: jest.fn() };

const __setWorkspaceName = (name: string) => {
  workspace.name = name;
};

const Uri = {
  file: (f: string) => f,
  parse: jest.fn(),
};

enum ViewColumn {
  Beside,
}

module.exports = {
  workspace,
  window,
  ViewColumn,
  Uri,
  __setWorkspaceName,
};
