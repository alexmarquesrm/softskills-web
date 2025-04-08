import "./App.css";
import React from "react";
import LoginButton from "../src/components/buttons/loginButton"; // Caminho correto

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the App</h1>
        {/* Exibe o botão de login */}
        <LoginButton />
      </header>
    </div>
  );
}

export default App;
