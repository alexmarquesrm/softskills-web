import "./App.css";
import React from "react";
import NavbarButton from "./components/buttons/navbarButton"; // Caminho correto

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the App</h1>
        <NavbarButton text="Sign In" />
        <NavbarButton />
      </header>
    </div>
  );
}

export default App;
