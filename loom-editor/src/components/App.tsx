import React from "react";

import { createNodeText } from "loom-common/YarnNode";

import "./App.css";

function App() {
  return (
    <div>
      Loom Editor
      {createNodeText({ title: "Test", tags: "", body: "Test Test" })}
    </div>
  );
}

export default App;
