import * as React from "react";
import "../../../external/Style.css";
import "../../../external/CommonStyle.module.scss";
import MainComponent from "./MainComponent";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { useState } from "react";
import Loader from "./Loader/Loader";
const ProcurementSystem: React.FC<any> = (props) => {
  const [applicationLoader, setapplicationLoader] = useState<boolean>(true);

  React.useEffect(() => {
    setTimeout(() => {
      setapplicationLoader(false);
      window.location.href = "#/";
    }, 3000);
  }, []);
  return (
    <div>
      {applicationLoader ? (
        <Loader />
      ) : (
        <MainComponent context={props.context} />
      )}
    </div>
  );
};

export default ProcurementSystem;
