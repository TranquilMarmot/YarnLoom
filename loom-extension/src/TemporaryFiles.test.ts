import {
  getTemporaryFolderPath,
  createTemporaryFileForNode,
  createdTemporaryFiles,
  unwatchTemporaryFilesForDocument,
  TemporaryFile,
  deleteAllTemporaryFiles,
  trackTemporaryFile,
} from "./TemporaryFiles";

import { join } from "path";
import { YarnNode } from "loom-common/YarnNode";
import LoomEditorProvider from "./LoomEditorProvider";

// vscodeMock contains mock functions for the "vscode" library
// this library is unique since it's not installed as a node modules and is just globally available
import * as vscode from "vscode";
const vscodeMock = require("../__mocks__/vscode");

jest.mock("fs");
import * as fs from "fs";

jest.mock("os");
import * as os from "os";

describe("TemporaryFiles", () => {
  // file name to use for a mocked open file
  const mockOpenYarnFileName = "/some-file.yarn";

  // this is the hash of `mockOpenYarnFileName`
  const mockOpenYarnFileHash = "33bde1ae455211803e3b3ed8996e7dea";

  // mock VSCode TextDocument
  const mockTextDocument: vscode.TextDocument = ({
    uri: vscode.Uri.file(mockOpenYarnFileName),
  } as unknown) as vscode.TextDocument;

  describe("getTemporaryFolderPath", () => {
    it("generates a path with the workspace name if a workspace is open", () => {
      const testWorkspaceName = "test-workspace-name";
      vscodeMock.__setWorkspaceName(testWorkspaceName);

      const path = getTemporaryFolderPath(mockTextDocument);

      expect(path).toEqual(
        join(
          os.tmpdir(),
          "yarnSpinner",
          testWorkspaceName,
          mockOpenYarnFileHash
        )
      );

      vscodeMock.__setWorkspaceName(undefined);
    });

    it("generates a path without the workspace name if no workspace is open", () => {
      const path = getTemporaryFolderPath(mockTextDocument);

      expect(path).toContain(join("yarnSpinner", mockOpenYarnFileHash));
    });
  });

  describe("createTemporaryFileForNode", () => {
    const testNode: YarnNode = {
      title: "Test Node",
      body: "Test body",
      tags: "",
    };

    const mockEditor: LoomEditorProvider = ({
      document: mockTextDocument,
    } as unknown) as LoomEditorProvider;

    it("creates temporary documents", () => {
      const expectedMockFilePath = join(
        getTemporaryFolderPath(mockEditor.document!),
        `${testNode.title}.yarn.node`
      );
      createTemporaryFileForNode(testNode, mockEditor);

      // first it creates the temporary folder
      expect(fs.mkdirSync).toHaveBeenNthCalledWith(
        1,
        getTemporaryFolderPath(mockEditor.document!),
        { recursive: true }
      );

      // then it creates the temporary file, based on the node's name
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        1,
        expectedMockFilePath,
        testNode.body
      );

      // this will also call out to `watchTemporaryFileAndUpdateEditorOnChanges` which watches the file...
      // we don't test the specifics of that here though
      expect(fs.watch).toHaveBeenCalledTimes(1);

      // the new file should have been added to the temporary file list
      expect(createdTemporaryFiles).toHaveLength(1);
      expect(createdTemporaryFiles[0].path).toEqual(expectedMockFilePath);
      expect(createdTemporaryFiles[0].document).toEqual(mockEditor.document);

      // empty out the created list for other tests
      createdTemporaryFiles.splice(0, createdTemporaryFiles.length);
    });
  });

  describe("unwatchTemporaryFilesForDocument", () => {
    it("un-watches all tracked files for the given document", () => {
      const mockTemporaryFiles: TemporaryFile[] = [
        {
          node: {
            title: "Some node",
            body: "",
            tags: "",
          },
          path: "some-path.yarn.node",
          watcher: { close: jest.fn() } as any,
          document: mockTextDocument,
        },
        {
          node: {
            title: "Some other node",
            body: "",
            tags: "",
          },
          path: "some-other-path.yarn.node",
          watcher: { close: jest.fn() } as any,
          document: mockTextDocument,
        },
      ];

      trackTemporaryFile(mockTemporaryFiles[0]);
      trackTemporaryFile(mockTemporaryFiles[1]);

      expect(createdTemporaryFiles).toHaveLength(2);

      unwatchTemporaryFilesForDocument(mockTextDocument);

      expect(createdTemporaryFiles).toHaveLength(0);
      expect(mockTemporaryFiles[0].watcher.close).toBeCalledTimes(1);
      expect(mockTemporaryFiles[1].watcher.close).toBeCalledTimes(1);
    });

    it("does not un-watch files belonging to a different document", () => {
      const otherMockTextDocument: vscode.TextDocument = ({
        uri: vscode.Uri.file("/some-other-file.yarn"),
      } as unknown) as vscode.TextDocument;

      const mockTemporaryFiles: TemporaryFile[] = [
        {
          node: {
            title: "Some node",
            body: "",
            tags: "",
          },
          path: "some-path.yarn.node",
          watcher: { close: jest.fn() } as any,
          document: mockTextDocument,
        },
        {
          node: {
            title: "Some other node",
            body: "",
            tags: "",
          },
          path: "some-other-path.yarn.node",
          watcher: { close: jest.fn() } as any,
          document: otherMockTextDocument,
        },
      ];

      trackTemporaryFile(mockTemporaryFiles[0]);
      trackTemporaryFile(mockTemporaryFiles[1]);
      expect(createdTemporaryFiles).toHaveLength(2);

      // this should only remove the first one in the array that we have
      unwatchTemporaryFilesForDocument(mockTextDocument);

      expect(createdTemporaryFiles).toHaveLength(1);
      expect(mockTemporaryFiles[0].watcher.close).toBeCalledTimes(1);

      // this one remains since it is for another file
      expect(mockTemporaryFiles[1].watcher.close).toBeCalledTimes(0);
      expect(createdTemporaryFiles[0]).toEqual(mockTemporaryFiles[1]);

      // empty out the created list for other tests
      createdTemporaryFiles.splice(0, createdTemporaryFiles.length);
    });
  });

  describe("deleteAllTemporaryFiles", () => {
    it("deletes all temporary files", () => {
      const mockTemporaryFile: TemporaryFile = {
        node: {
          title: "Some node",
          body: "",
          tags: "",
        },
        path: "some-path.yarn.node",
        watcher: { close: jest.fn() } as any,
        document: mockTextDocument,
      };

      trackTemporaryFile(mockTemporaryFile);

      expect(createdTemporaryFiles).toHaveLength(1);

      deleteAllTemporaryFiles();

      expect(createdTemporaryFiles).toHaveLength(0);
      expect(mockTemporaryFile.watcher.close).toHaveBeenCalledTimes(1);
      expect(fs.unlink).toHaveBeenNthCalledWith(
        1,
        mockTemporaryFile.path,
        console.error
      );
    });
  });
});
