import * as React from "react";
import { useState } from "react";
import procurementSysStyles from "./ProcurementManagement.module.scss";
import BasicInformation from "./BasicInformation/BasicInformation";
import VendorComparison from "./VendorComparison/VendorComparison";

const ProcurementSystem = () => {
  const [selectedStepperVersionId, setselectedStepperVersionId] =
    useState<number>(2);
  const stepperArr = [
    {
      id: 1,
      title: "Basic Information",
      icon: "pi pi-info-circle",
    },
    {
      id: 2,
      title: "Vendor Comparison",
      icon: "pi pi-info-circle",
    },
    {
      id: 3,
      title: "Approval",
      icon: "pi pi-info-circle",
    },
    {
      id: 4,
      title: "Purchase Order",
      icon: "pi pi-info-circle",
    },
    {
      id: 5,
      title: "Invoice",
      icon: "pi pi-info-circle",
    },
  ];
  console.log(setselectedStepperVersionId);

  // Stepper func
  const customStepperFunction = () => {
    return (
      <>
        <div className={procurementSysStyles.customStepperNav}>
          {stepperArr.map((item, index) => (
            <div className={procurementSysStyles.customStepperItem}>
              <div className={procurementSysStyles.stepperTitleContainer}>
                <i
                  className={`${item?.icon} ${
                    item?.id <= selectedStepperVersionId
                      ? procurementSysStyles.activeStepperIcon
                      : procurementSysStyles.stepperIcon
                  }`}
                ></i>
                <p
                  className={
                    item.id <= selectedStepperVersionId
                      ? `${procurementSysStyles.stepperTitle} ${procurementSysStyles.activeStepperTitle}`
                      : procurementSysStyles.stepperTitle
                  }
                >
                  {item.title}
                </p>
              </div>
              {index !== stepperArr.length - 1 && (
                <span
                  className={
                    item.id <= selectedStepperVersionId
                      ? `${procurementSysStyles.stepperSeperator} ${procurementSysStyles.activeStepperSeperator}`
                      : procurementSysStyles.stepperSeperator
                  }
                ></span>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={procurementSysStyles.mainBodyLayout}>
      {customStepperFunction()}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Basic Information" ? (
        <BasicInformation />
      ) : (
        ""
      )}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Vendor Comparison" ? (
        <VendorComparison />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProcurementSystem;
