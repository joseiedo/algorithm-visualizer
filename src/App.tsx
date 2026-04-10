import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AlgorithmView } from "@/components/AlgorithmView";
import { HomePage } from "@/components/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:category/:id" element={<AlgorithmView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
