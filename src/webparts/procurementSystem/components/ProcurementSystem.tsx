import * as React from "react";
import "../../../external/Style.css";
import "../../../external/CommonStyle.module.scss";
import MainComponent from "./MainComponent";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
const ProcurementSystem: React.FC<any> = (props) => {
  React.useEffect(() => {
    window.location.href = "#/";
  }, []);
  return (
    <div>
      <MainComponent context={props.context} />
    </div>
  );
};

export default ProcurementSystem;
