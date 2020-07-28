import reducer from "./Reducer";
import { State } from "../Types";
import { YarnNode } from "loom-common/YarnNode";
import { setNodes } from "loom-common/EditorActions";
import {
  setSearchingNodeBodies,
  setSearchingNodeTags,
  setSearchingNodeTitles,
  setSearchString,
  setFocusedNode,
  searchForTag,
  setSearchCaseSensitive,
  setSearchRegexEnabled,
} from "./UiActions";

describe("Reducer", () => {
  const node0: YarnNode = {
    title: "Node 0",
    tags: "some tags",
    body: "I am a node",
  };

  const node1: YarnNode = {
    title: "Node 1",
    tags: "some tags",
    body: "I am also a node",
  };

  const startState: State = {
    nodes: [node0, node1],
    search: {
      searchString: "",
      searchingBody: false,
      searchingTags: false,
      searchingTitle: false,
      regexEnabled: false,
      caseSensitivityEnabled: false,
    },
    focusedNode: undefined,
  };

  it("handles YarnEditorMessageTypes.SetNodes", () => {
    const node2: YarnNode = {
      title: "Node 2",
      tags: "other tags",
      body: "I am an added node",
    };

    const nodesToSet = [node0, node1, node2];
    const reduced = reducer(startState, setNodes(nodesToSet));

    expect(reduced.nodes).toEqual(nodesToSet);
  });

  it("handles UiMessageTypes.SetSearchingNodeBodies", () => {
    expect(startState.search.searchingBody).toBe(false);
    const reduced = reducer(startState, setSearchingNodeBodies(true));
    expect(reduced.search.searchingBody).toBe(true);
  });

  it("handles UiMessageTypes.SetSearchingNodeTags", () => {
    expect(startState.search.searchingTags).toBe(false);
    const reduced = reducer(startState, setSearchingNodeTags(true));
    expect(reduced.search.searchingTags).toBe(true);
  });

  it("handles UiMessageTypes.SetSearchingNodeTitles", () => {
    expect(startState.search.searchingTitle).toBe(false);
    const reduced = reducer(startState, setSearchingNodeTitles(true));
    expect(reduced.search.searchingTitle).toBe(true);
  });

  it("handles UiMessageTypes.SetSearchCaseSensitive", () => {
    expect(startState.search.caseSensitivityEnabled).toBe(false);
    const reduced = reducer(startState, setSearchCaseSensitive(true));
    expect(reduced.search.caseSensitivityEnabled).toBe(true);
  });

  it("handles UiMessageTypes.SetSearchRegexEnabled", () => {
    expect(startState.search.regexEnabled).toBe(false);
    const reduced = reducer(startState, setSearchRegexEnabled(true));
    expect(reduced.search.regexEnabled).toBe(true);
  });

  it("handles UiMessageTypes.SetSearchString", () => {
    expect(startState.search.searchString).toBe("");
    const reduced = reducer(startState, setSearchString("some search string"));
    expect(reduced.search.searchString).toBe("some search string");
  });

  it("handles UiMessageTypes.SetFocusedNode", () => {
    const nodeToFocusOn = "Node 0";

    expect(startState.focusedNode).toBe(undefined);
    const reduced = reducer(startState, setFocusedNode(nodeToFocusOn));
    expect(reduced.focusedNode).toBe(nodeToFocusOn);
  });

  describe("handles UiMessageTypes.SearchForTag", () => {
    it("searches for tags", () => {
      const tag = "tag";

      // searching for a tag will un-search for title and body and only search tags
      const startStateSearchingEverything: State = {
        ...startState,
        search: {
          ...startState.search,
          searchingTitle: true,
          searchingBody: true,
          searchingTags: false,
        },
      };

      const reduced = reducer(startStateSearchingEverything, searchForTag(tag));

      expect(reduced.search.searchString).toBe(tag);
      expect(reduced.search.searchingBody).toBe(false);
      expect(reduced.search.searchingTitle).toBe(false);
      expect(reduced.search.searchingTags).toBe(true);
    });

    it("un-searches for tags", () => {
      const tag = "tag";

      // searching for a tag will un-search for title and body and only search tags
      const startStateSearchingEverything: State = {
        ...startState,
        search: {
          ...startState.search,
          searchString: tag,
          searchingTitle: false,
          searchingBody: false,
          searchingTags: true,
        },
      };

      const reduced = reducer(startStateSearchingEverything, searchForTag(tag));

      expect(reduced.search.searchString).toBe("");
      expect(reduced.search.searchingBody).toBe(true);
      expect(reduced.search.searchingTitle).toBe(true);
      expect(reduced.search.searchingTags).toBe(true);
    });
  });
});
