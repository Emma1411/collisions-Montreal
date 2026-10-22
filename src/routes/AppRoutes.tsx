
import { Navigate, Route, Routes } from "react-router-dom";
import DefaultLayout from "../components/layout/DefaultLayout";
import Overview from "../pages/OverviewPage";
import MapPage from "../pages/MapPage";
import Methodology from "../pages/MethodologyPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/carte" element={<MapPage />} />
        <Route path="/methodologie" element={<Methodology />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
