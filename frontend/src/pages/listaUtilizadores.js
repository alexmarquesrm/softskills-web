import "../App.css";
import React from "react";
import CustomNavbar from "../components/navbar/customNavbar";
import Footer from "../components/footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Tabela from "../components/tabelas/tabela";

function App() {
  return (
    <div>
      <CustomNavbar />
      <Tabela/>
     <Footer />
    </div>
  );
}

export default App;
 