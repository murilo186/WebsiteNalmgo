import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Dashboard from "./components/Dashboard";
import FretesPage from "./components/ShipScreen";
import GestaoEquipe from "./components/TeamScreen";
import EncontrarMotorista from "./components/DriverPage";
import LoginPage from "./components/LoginScreen";
import RegisterPage from "./components/RegisterScreen";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fretes" element={<FretesPage />} />
          <Route path="/equipe" element={<GestaoEquipe />} />
          <Route path="/motoristas" element={<EncontrarMotorista />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App
