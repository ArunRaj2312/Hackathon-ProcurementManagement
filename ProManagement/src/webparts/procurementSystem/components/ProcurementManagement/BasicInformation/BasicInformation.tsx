import * as React from "react";
import basicInfoStyles from "../BasicInformation/BasicInformation.module.scss";
const BasicInformation = () => {
  const tempBasicDetails = {
    prId: "PR-001",
    item: "Laptop - Dell Latitude 5440",
    quantity: "20 Units",
    estimatedUnitPrice: "68,000",
    totalEstimated: "13,60,000",
    requiredDate: "25/03/2026",
    justification: "New Employee onboarding requirement",
  };
  const requesterDetails = {
    requestedBy: "Swetha",
    employeeId: "E-0052",
    designation: "Admin",
    location: "O365",
    requiredDate: "27/02/2026",
  };
  console.log(requesterDetails);
  return (
    <>
      <div className={basicInfoStyles.layoutCon}>
        <div className={basicInfoStyles.basicInfoMainCon}>
          {/* basic details */}
          <p className={basicInfoStyles.subtitle}>Basic Details</p>
          <div className={basicInfoStyles.subTitleCon}>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>PR ID</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.prId}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Item</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.item}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Quantity</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.quantity}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>
                Estimated Unit Price
              </p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.estimatedUnitPrice}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Total Estimated</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.totalEstimated}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Required Date</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.requiredDate}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Justification</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.justification}
              </p>
            </div>
          </div>
          {/* documents */}
          <p className={basicInfoStyles.subtitle}>Documents</p>
          <div className={basicInfoStyles.subTitleCon}>
            <div className={basicInfoStyles.fileMainCon}>
              <div className={basicInfoStyles.fileCon}>
                <p className={basicInfoStyles.fileLabel}>
                  <i className={`${basicInfoStyles.fileIcon} pi pi-file`}></i>
                  Resume.pdf
                </p>
              </div>
              <div className={basicInfoStyles.fileCon}>
                <p className={basicInfoStyles.fileLabel}>
                  <i className={`${basicInfoStyles.fileIcon} pi pi-file`}></i>
                  Aadhaar.pdf
                </p>
              </div>
            </div>
          </div>
          {/* requester details */}
          <p className={basicInfoStyles.subtitle}>Requester Details</p>
          <div className={basicInfoStyles.subTitleCon}>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Requested by</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.prId}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Employee id</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.item}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Designation</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.quantity}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Location</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.estimatedUnitPrice}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Required Date</p>
              <p className={basicInfoStyles.itemValueCon}>
                {tempBasicDetails?.totalEstimated}
              </p>
            </div>
          </div>
        </div>
        {/* AI overview */}
        <div className={basicInfoStyles.aiOverviewMainCon}>
          <div className={basicInfoStyles.aiOverviewLabelCon}>
            <p className={basicInfoStyles.labelStyle}>
              <i
                className={`${basicInfoStyles.aiIconStyle} pi pi-sparkles`}
              ></i>
              AI Overview
            </p>
          </div>
          <div className={basicInfoStyles.aiContentCon}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default BasicInformation;
