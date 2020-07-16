# Yarn Loom Visual Studio Code Extension

Yarn Loom is an editor for [yarn files](https://yarnspinner.dev/). It is a version of the [Yarn Editor](https://github.com/YarnSpinnerTool/YarnEditor) re-built from the ground up to integrate seamlessly with Visual Studio Code.

- [Yarn Loom Visual Studio Code Extension](#yarn-loom-visual-studio-code-extension)
  - [Installing](#installing)
  - [Usage](#usage)
  - [How To](#how-to)
    - [Editing nodes](#editing-nodes)
    - [Renaming nodes](#renaming-nodes)
    - [Changing node tags](#changing-node-tags)
    - [Changing a node's color](#changing-a-nodes-color)
    - [Changing a node's position](#changing-a-nodes-position)
    - [Adding new nodes](#adding-new-nodes)
    - [Deleting nodes](#deleting-nodes)
    - [Searching](#searching)
      - [Quick tag search](#quick-tag-search)
    - [Switching between the graph editor and a text editor](#switching-between-the-graph-editor-and-a-text-editor)
  - [Contributing, Reporting Issues/Bugs, and Technical Details](#contributing-reporting-issuesbugs-and-technical-details)
  - [Special Thanks](#special-thanks)

## Installing

- TODO Visual Studio Code marketplace link
- TODO Install from `.vsix` build artifacts

## Usage

Once the extension is installed, simply open up a `.yarn` or a `.yarn.txt` file to use it!

## How To

Each of the examples below has an expandable gif that shows the editor in action.

### Editing nodes

To edit a node, double click it. This will open the node up in a text editor next to the open `.yarn` file.

Changes saved in this text editor will be reflected in the `.yarn` file editor. Saving the open `.yarn` file will persist changes to disk, and undo/redo can be used to move back and forth between edits to a node.

### Renaming nodes

A node can be renamed by changing its `title` after opening it up in the text editor.

Note that renaming a node will break any existing links to it!

### Changing node tags

Tags can be added/removed by changing the `tags` of a node after opening it up in the text editor.

`tags` is a space-separated list of tags.

### Changing a node's color

Node colors can be changed by clicking the color change icon (![color change icon](./loom-editor/src/icons/symbol-color.svg)).

This will bring up a list of colors to choose from. The `colorID` that you see when opening a node in the text editor corresponds to a color in this list.

### Changing a node's position

A node's position can be changed by dragging it around in the graph view of the `.yarn` file.

### Adding new nodes

New nodes are added automatically when you link to them.

### Deleting nodes

Nodes can be deleted by clicking the garbage can/trash icon in the their title (![garbage can icon](./loom-editor.loom-editor/src/icons/trash.svg)). A confirmation message will be displayed.

### Searching

The search bar can be used to search for specific nodes.

When searching, nodes that do not contain the search term will be dimmed. Node containing the search term will stay solid.

The "Title", "Body", and "Tags" buttons in the search bar control whether or not to search within node titles, bodies, and tags, respectfully. This is an "or" search, so if searching in all three locations and one node has "Sally" in the title, one has "Sally" in the body, and one has a tag of "Sally", then all three will show up in the search.

#### Quick tag search

To quickly search for a tag, you can either click on it in the footer of a node or expand the tag list and select it from there. This will automatically fill in the search box with the tag and limit the search to tags.

### Switching between the graph editor and a text editor

By clicking the three dots in the top-right of the open editor window, you can select "Reopen Editor With..." and choose to re-open the `.yarn` file with the default text editor. By clicking the gear icon, you can also choose

## Contributing, Reporting Issues/Bugs, and Technical Details

If you find any issues or bugs with this extension, [please open up a new issue on the GitHub repo](https://github.com/TranquilMarmot/YarnLoom/issues/new) with as much detail as possible!

For juicy in-depth technical details for how this works, and how to contribute to it yourself, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Special Thanks

The syntax highlighting portion of this extension was copied over from the [Yarn VSCode Extension](https://github.com/YarnSpinnerTool/VSCodeExtension) and all credit for it goes to [@desplesda](https://github.com/desplesda).

Portions of Yarn file parsing and in-editor highlighting were copied over from the [Yarn Editor](https://github.com/YarnSpinnerTool/YarnEditor) and all credit for it goes to the Yarn Editor contributors, but especially [@blurymind](https://github.com/blurymind).
