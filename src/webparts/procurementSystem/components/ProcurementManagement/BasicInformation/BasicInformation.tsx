import * as React from "react";
import basicInfoStyles from "../BasicInformation/BasicInformation.module.scss";
const BasicInformation = (props: { data?: any }) => {
  const data = props.data || {};
  return (
    <>
      <div className={basicInfoStyles.layoutCon}>
        <div className={basicInfoStyles.basicInfoMainCon}>
          {/* basic details */}
          <p className={basicInfoStyles.subtitle}>Basic Details</p>
          <div className={basicInfoStyles.subTitleCon}>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>PR ID</p>
              <p className={basicInfoStyles.itemValueCon}>{data?.prId}</p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Item</p>
              <p className={basicInfoStyles.itemValueCon}>{data?.item}</p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Quantity</p>
              <p className={basicInfoStyles.itemValueCon}>{data?.quantity}</p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>
                Estimated Unit Price
              </p>
              <p className={basicInfoStyles.itemValueCon}>
                {data?.estimatedUnitPrice}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Total Estimated</p>
              <p className={basicInfoStyles.itemValueCon}>
                {data?.totalEstimated}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Required Date</p>
              <p className={basicInfoStyles.itemValueCon}>
                {data?.requiredDate}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Justification</p>
              <p className={basicInfoStyles.itemValueCon}>
                {data?.justification}
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
                {data?.requestedBy}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Employee id</p>
              <p className={basicInfoStyles.itemValueCon}>{data?.employeeId}</p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Designation</p>
              <p className={basicInfoStyles.itemValueCon}>
                {data?.designation}
              </p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Location</p>
              <p className={basicInfoStyles.itemValueCon}>{data?.location}</p>
            </div>
            <div className={basicInfoStyles.itemCon}>
              <p className={basicInfoStyles.itemLabelCon}>Required Date</p>
              <p className={basicInfoStyles.itemValueCon}>
                {data?.requesterRequiredDate}
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
