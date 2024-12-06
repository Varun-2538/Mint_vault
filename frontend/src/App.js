import React from "react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <HomePage />
      </div>
    </BrowserRouter>
  );
}

export default App;
