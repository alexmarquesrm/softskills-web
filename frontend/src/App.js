import "./App.css";
import React from "react";
import navbarButton from "./components/buttons/navbarButton"; // Caminho correto

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the App</h1>
        {/* Exibe o botão de login */}
        <navbarButton />
      </header>
    </div>
  );
}

export default App;
