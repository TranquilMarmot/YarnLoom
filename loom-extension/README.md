# Yarn Spinner Loom

<p align="center">
  <img src="./icon.png" alt="Yarn Loom Logo" />
</P>

Yarn Loom is a Visual Studio Code extension for editing [yarn files](https://yarnspinner.dev/). It is a re-imagining of the [Yarn Editor](https://github.com/YarnSpinnerTool/YarnEditor) built from the ground up to integrate seamlessly with Visual Studio Code.

![demo video](https://github.com/TranquilMarmot/YarnLoom/raw/main/images/demo.gif)

- [Yarn Spinner Loom](#yarn-spinner-loom)
  - [Usage](#usage)
  - [Reporting Issues/Bugs](#reporting-issuesbugs)
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
  - [Special Thanks](#special-thanks)

## Usage

Once the extension is installed, simply open up a `.yarn` or a `.yarn.txt` file to use it!

## Reporting Issues/Bugs

If you find any issues or bugs with this extension, [please open up a new issue on the GitHub repo](https://github.com/TranquilMarmot/YarnLoom/issues/new/choose) and include as much detail as possible!

## How To

Each of the examples below has an expandable gif that shows the editor in action.

### Editing nodes

To edit a node, double click it. This will open the node up in a text editor next to the open `.yarn` file.

Changes saved in this text editor will be reflected in the `.yarn` file editor. Saving the open `.yarn` file will persist changes to disk, and undo/redo can be used to move back and forth between edits to a node.

<details>
  <summary>Expand for demo of editing nodes</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/editing-node.gif" alt="Demo of editing a node" />
</details>

### Renaming nodes

A node can be renamed by changing its `title` after opening it up in the text editor.

Note that when renaming a node that has incoming links, it will automatically be re-created when renamed since the editor will auto-create linked nodes. To rename a node with incoming links, you must rename the outgoing links to the desired name and then delete the existing node. A future update will make this easier.

<details>
  <summary>Expand for demo of renaming a node</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/rename-node.gif" alt="Demo of renaming a node" />
</details>

### Changing node tags

Tags can be added/removed by changing the `tags` value in the header of a node after opening it up in the text editor.

`tags` is a space-separated list of strings.

<details>
  <summary>Expand for demo of changing node tags</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/editing-tags.gif" alt="Demo of editing a node's tags" />
</details>

### Changing a node's color

Node colors can be changed by clicking the color change icon.

This will bring up a list of colors to choose from. The `colorID` that you see when opening a node in the text editor corresponds to a color in this list.

<details>
  <summary>Expand for demo of changing a node's color</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/changing-color.gif" alt="Demo of editing a node's color" />
</details>

### Changing a node's position

A node's position can be changed by dragging it around in the graph view of the `.yarn` file.

<details>
  <summary>Expand for demo of changing a node's position</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/moving-nodes.gif" alt="Demo of move nodes around in the graph editor" />
</details>

### Adding new nodes

New nodes are added automatically when you link to them when editing node text.

You can also add new nodes by opening up the node list, scrolling to the bottom, and clicking "Add new node".

<details>
  <summary>Expand for demo of adding a new node</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/adding-new-node.gif" alt="Demo of adding a new node" />
</details>

### Deleting nodes

Nodes can be deleted by clicking the garbage can/trash icon in the their title. A confirmation message will be displayed.

<details>
  <summary>Expand for demo of deleting a node</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/deleting-node.gif" alt="Demo of deleting a node" />
</details>

### Searching

The search bar can be used to search for specific nodes.

When searching, nodes that do not contain the search term will be dimmed. Nodes containing the search term will stay opaque.

The "Title", "Body", and "Tags" buttons in the search bar control whether or not to search within node titles, bodies, and tags, respectfully. This is an "or" search, so if searching in all three locations and one node has "Sally" in the title, one has "Sally" in the body, and one has a tag of "Sally", then all three will show up in the search. Note that turning off all three options effectively disables the search.

<details>
  <summary>Expand for demo of searching for nodes</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/searching.gif" alt="Demo of searching for nodes" />
</details>

#### Quick tag search

To quickly search for a tag, you can either click on it in the footer of a node or expand the tag list and select it from there. This will automatically fill in the search box with the tag and limit the search to tags.

<details>
  <summary>Expand for demo of quick tag searching</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/quick-tag-search.gif" alt="Demo of quickly searching for tags" />
</details>

### Switching between the graph editor and a text editor

By clicking the three dots in the top-right of the open editor window, you can select "Reopen Editor With..." and choose to re-open the `.yarn` file with the default text editor.

In this menu, clicking the gear icon will set an editor as the default editor for `.yarn` files. This is useful if you want Visual Studio Code to default to opening files with the text editor.

<details>
  <summary>Expand for demo of switching between the text editor and Yarn Loom</summary>
  <img src="https://github.com/TranquilMarmot/YarnLoom/raw/main/images/reopen-with-text-editor.gif" alt="Demo of switching between Yarn Loom and a text editor" />
</details>

## Special Thanks

The syntax highlighting portion of this extension was copied over from the [Yarn VSCode Extension](https://github.com/YarnSpinnerTool/VSCodeExtension) and all credit for it goes to [@desplesda](https://github.com/desplesda).

Portions of Yarn file parsing and in-editor highlighting were copied over from the [Yarn Editor](https://github.com/YarnSpinnerTool/YarnEditor) and all credit for it goes to the Yarn Editor contributors, but especially [@blurymind](https://github.com/blurymind).

The original [Yarn Spinner logo](https://yarnspinner.dev/img/YarnSpinnerLogo.png) was made by [Cecile Richard](https://www.cecile-richard.com/) and was remixed to create the logo for this extension.