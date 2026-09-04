import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Prospectivity from "./pages/Prospectivity";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prospectivity" element={<Prospectivity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;