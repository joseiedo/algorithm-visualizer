import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AlgorithmView } from "@/components/AlgorithmView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:category/:id" element={<AlgorithmView />} />
        <Route path="*" element={<Navigate to="/sorting/bubble-sort" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
