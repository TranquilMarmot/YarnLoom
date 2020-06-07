import React from "react";
import "./App.css";
import { createNodeText } from "loom-common/YarnNode";

function App() {
  return (
    <div>
      Loom Editor
      {createNodeText({ title: "Test", tags: "", body: "Test Test" })}
    </div>
  );
}

export default App;
