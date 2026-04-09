import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DEFAULT_ALGORITHM_ROUTE } from "@/app/routes";
import { AlgorithmView } from "@/components/AlgorithmView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:category/:id" element={<AlgorithmView />} />
        <Route path="*" element={<Navigate to={DEFAULT_ALGORITHM_ROUTE} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
