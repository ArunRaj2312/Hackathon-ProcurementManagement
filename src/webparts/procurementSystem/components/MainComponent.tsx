import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import ProcurementManagement from "./ProcurementManagement/ProcurementManagement";
import Dashboard from "./ProcurementManagement/Dashboard/Dashboard";

interface IMainComponentProps {
  context: any; // or WebPartContext
}

const MainComponent: React.FC<IMainComponentProps> = ({ context }) => {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/procurementmanagement"
            element={<ProcurementManagement context={context} />}
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default MainComponent;
