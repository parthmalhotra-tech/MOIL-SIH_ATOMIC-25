import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Prospectivity from "./pages/Prospectivity";
import Production from "./pages/production";
import RiskandShortfall from "./pages/RiskandShortfall";
import ModelIntelligence from "./pages/ModelIntelligence";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Prospectivity */}
        <Route
          path="/prospectivity"
          element={<Prospectivity />}
        />

        {/* Production */}
        <Route
          path="/production"
          element={<Production />}
        />

        {/* Risk & Shortfall */}
        <Route
          path="/RiskandShortfall"
          element={<RiskandShortfall />}
        />

        {/* Model Intelligence */}
        <Route
          path="/Modelintelligence"
          element={<ModelIntelligence />}
        />

        {/* Also accept the lowercase/hyphen version */}
        <Route
          path="/model-intelligence"
          element={<ModelIntelligence />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;