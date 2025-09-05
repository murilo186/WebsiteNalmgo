import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import FretesPage from "./components/ShipScreen";
import GestaoEquipe from "./components/TeamScreen";
import EncontrarMotorista from "./components/DriverPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header companyName="Transportes Silva & Cia" />
{/* Header aparece fixo em todas as páginas */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fretes" element={<FretesPage />} />
          <Route path="/equipe" element={<GestaoEquipe />} />
          <Route path="/motoristas" element={<EncontrarMotorista />} />
          {/* rota padrão, etc */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
