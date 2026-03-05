import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ProcurementManagement from "./ProcurementManagement/ProcurementManagement";
import Dashboard from "./ProcurementManagement/Dashboard/Dashboard";

const MainComponent: React.FC = () => {
  React.useEffect(() => {
    window.location.href = "#/";
  }, []);
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/procurementmanagement"
            element={<ProcurementManagement />}
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default MainComponent;
