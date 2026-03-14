/* eslint-disable no-void */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import basicInfoStyles from "../BasicInformation/BasicInformation.module.scss";
// import { useEffect, useState } from "react";
import * as moment from "moment";
// import { getBasicInfoAI } from "../../../../../services/aiService";

const BasicInformation = (props: {
  data: any;
  aiOverview?: string;
}): JSX.Element => {
  const data = props.data || {};

  // const [aiOverview, setAiOverview] = useState<string>(
  //   "Analyzing request with AI...",
  // );
  // console.log("aiOverview", aiOverview);

  // useEffect(() => {
  //   setAiOverview("");
  // }, []);
  // useEffect(() => {
  //   const loadAI = async (): Promise<void> => {
  //     const response = await getBasicInfoAI(props.data);

  //     setAiOverview(response);
  //   };

  //   if (props.data) {
  //     void loadAI();
  //   }
  // }, [props.data]);
  return (
    <div className={basicInfoStyles.layoutCon}>
      {/* ===== TOP SUMMARY CARDS ===== */}
      <div className={basicInfoStyles.summaryCards}>
        {/* Item Card */}
        <div className={basicInfoStyles.summaryCard}>
          <i className={`pi pi-desktop ${basicInfoStyles.summaryCardIcon}`} />
          <p className={basicInfoStyles.summaryCardLabel}>Item</p>
          <p
            className={basicInfoStyles.summaryCardValue}
            style={{ fontSize: 22, color: "var(--themeColorDark, #28a745)" }}
          >
            {data?.item || "—"}
          </p>
          <p className={basicInfoStyles.summaryCardItem}>{data?.prId || ""}</p>
        </div>

        {/* Quantity Card */}
        <div className={basicInfoStyles.summaryCard}>
          <p className={basicInfoStyles.summaryCardLabel}>Quantity</p>
          <p className={basicInfoStyles.summaryCardValue}>
            {data?.quantity || "—"}
          </p>
          <p className={basicInfoStyles.summaryCardSub}>units ordered</p>
        </div>

        {/* Total Estimated Card */}
        <div className={basicInfoStyles.summaryCard}>
          <p className={basicInfoStyles.summaryCardLabel}>Total Estimated</p>
          <p
            className={`${basicInfoStyles.summaryCardValue} ${basicInfoStyles.summaryCardValueGreen}`}
          >
            {data?.totalEstimated
              ? `₹${Number(data.totalEstimated).toLocaleString("en-IN")}`
              : "—"}
          </p>
          <p className={basicInfoStyles.summaryCardSub}>
            {data?.estimatedUnitPrice
              ? `@ ₹${data.estimatedUnitPrice} per unit`
              : ""}
          </p>
        </div>
      </div>

      {/* ===== BASIC DETAILS SECTION ===== */}
      <div className={basicInfoStyles.sectionCard}>
        <div className={basicInfoStyles.sectionHeader}>
          <div className={basicInfoStyles.sectionHeaderLeft}>
            <div className={basicInfoStyles.sectionIcon}>
              <i className="pi pi-file" />
            </div>
            <p className={basicInfoStyles.sectionTitle}>Basic Details</p>
          </div>
          <p className={basicInfoStyles.sectionFieldCount}>6 fields</p>
        </div>
        <div className={basicInfoStyles.sectionBody}>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>PR ID</p>
            <p
              className={`${basicInfoStyles.fieldValue} ${basicInfoStyles.fieldValueGreen}`}
            >
              {data?.prId || "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Item</p>
            <p className={basicInfoStyles.fieldValue}>{data?.item || "—"}</p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Quantity</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.quantity ? `${data.quantity} units` : "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Unit Price</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.estimatedUnitPrice
                ? `₹${Number(data.estimatedUnitPrice).toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Total Estimated</p>
            <p
              className={`${basicInfoStyles.fieldValue} ${basicInfoStyles.fieldValueGreen}`}
            >
              {data?.totalEstimated
                ? `₹${Number(data.totalEstimated).toLocaleString("en-IN")}`
                : "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Required Date</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.requiredDate
                ? moment(data.requiredDate).format("DD MMM YYYY")
                : "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Justification</p>
            <p
              className={`${basicInfoStyles.fieldValue} ${basicInfoStyles.fieldValueItalic}`}
            >
              {data?.justification || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== REQUESTER DETAILS SECTION ===== */}
      <div className={basicInfoStyles.sectionCard}>
        <div className={basicInfoStyles.sectionHeader}>
          <div className={basicInfoStyles.sectionHeaderLeft}>
            <div className={basicInfoStyles.sectionIcon}>
              <i className="pi pi-user" />
            </div>
            <p className={basicInfoStyles.sectionTitle}>Requester Details</p>
          </div>
          <p className={basicInfoStyles.sectionFieldCount}>5 fields</p>
        </div>
        <div className={basicInfoStyles.sectionBody}>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Requested By</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.requestedBy || "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Employee ID</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.employeeId || "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Designation</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.designation || "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Location</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.location || "—"}
            </p>
          </div>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>Request Date</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.requesterRequiredDate
                ? moment(data.requesterRequiredDate).format("DD MMM YYYY")
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== AI OVERVIEW ===== */}
      <div className={basicInfoStyles.aiOverviewMainCon}>
        <div className={basicInfoStyles.aiOverviewLabelCon}>
          <p className={basicInfoStyles.labelStyle}>
            <i className={`${basicInfoStyles.aiIconStyle} pi pi-sparkles`} />
            AI Overview
          </p>
        </div>
        <div className={basicInfoStyles.aiContentCon}>
          {props.aiOverview ? (
            props.aiOverview
              .split("\n")
              .map((line, index) => <p key={index}>{line}</p>)
          ) : (
            <p style={{ color: "#a0aab4", fontStyle: "italic" }}>
              AI analysis will appear here once generated.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default BasicInformation;
