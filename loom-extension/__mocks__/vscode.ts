// Any function/import that's called from extension code that lives in the `vscode`
// package needs to be mocked here.

const workspace: {
  name: string | undefined;
} = {
  name: undefined,
};

const __setWorkspaceName = (name: string) => {
  workspace.name = name;
};

const Uri = {
  file: (f: string) => f,
  parse: jest.fn(),
};

module.exports = {
  workspace,
  Uri,
  __setWorkspaceName,
};
