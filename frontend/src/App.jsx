import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Prospectivity from "./pages/Prospectivity";
import Production from "./pages/production";

import ModelIntelligence from "./pages/ModelIntelligence";
import AIRecommendations from "./pages/AiRecommendation";

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
        <Route
        path="/Ai-recommendations"
        element={<AIRecommendations/>
        }
        ></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;