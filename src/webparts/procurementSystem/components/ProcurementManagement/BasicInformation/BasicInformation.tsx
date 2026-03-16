/* eslint-disable no-void */
/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import basicInfoStyles from "../BasicInformation/BasicInformation.module.scss";
import * as moment from "moment";

const BasicInformation = (props: {
  data: any;
  aiOverview?: string;
}): JSX.Element => {
  const data = props.data || {};

  return (
    <div className={basicInfoStyles.layoutCon}>
      {/* ===== TOP SUMMARY CARDS ===== */}
      <div className={basicInfoStyles.summaryCards}>
        {/* Item Card */}
        <div className={basicInfoStyles.summaryCard}>
          <div
            className={`${basicInfoStyles.summaryCardIconBox} ${basicInfoStyles.summaryCardIconBoxBlue}`}
          >
            <i className="pi pi-desktop" />
          </div>
          <div className={basicInfoStyles.summaryCardContent}>
            <p className={basicInfoStyles.summaryCardLabel}>Item</p>
            <p
              className={`${basicInfoStyles.summaryCardValue} ${basicInfoStyles.summaryCardValueOrange}`}
            >
              {data?.item || "—"}
            </p>
            <p className={basicInfoStyles.summaryCardSub}>{data?.prId || ""}</p>
          </div>
        </div>

        {/* Quantity Card */}
        <div className={basicInfoStyles.summaryCard}>
          <div
            className={`${basicInfoStyles.summaryCardIconBox} ${basicInfoStyles.summaryCardIconBoxOrange}`}
          >
            <i className="pi pi-box" />
          </div>
          <div className={basicInfoStyles.summaryCardContent}>
            <p className={basicInfoStyles.summaryCardLabel}>Quantity</p>
            <p className={basicInfoStyles.summaryCardValue}>
              {data?.quantity || "—"}
            </p>
            <p className={basicInfoStyles.summaryCardSub}>Units ordered</p>
          </div>
        </div>

        {/* Total Estimated Card */}
        <div className={basicInfoStyles.summaryCard}>
          <div
            className={`${basicInfoStyles.summaryCardIconBox} ${basicInfoStyles.summaryCardIconBoxYellow}`}
          >
            <i className="pi pi-dollar" />
          </div>
          <div className={basicInfoStyles.summaryCardContent}>
            <p className={basicInfoStyles.summaryCardLabel}>Total Estimated</p>
            <p
              className={`${basicInfoStyles.summaryCardValue} ${basicInfoStyles.summaryCardValueOrange}`}
            >
              {data?.totalEstimated
                ? `$${Number(data.totalEstimated).toLocaleString("en-US")}`
                : "—"}
            </p>
            <p className={basicInfoStyles.summaryCardSub}>
              {data?.estimatedUnitPrice
                ? `@ $${Number(data.estimatedUnitPrice).toLocaleString("en-US")} per unit`
                : ""}
            </p>
          </div>
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
        </div>
        <div className={basicInfoStyles.sectionBody}>
          <div className={basicInfoStyles.fieldItem}>
            <p className={basicInfoStyles.fieldLabel}>PR ID</p>
            <p
              className={`${basicInfoStyles.fieldValue} ${basicInfoStyles.fieldValueOrange}`}
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
                ? `$${Number(data.estimatedUnitPrice).toLocaleString("en-US")}`
                : "—"}
            </p>
          </div>
          <div
            className={`${basicInfoStyles.fieldItem} ${basicInfoStyles.lastRow}`}
          >
            <p className={basicInfoStyles.fieldLabel}>Total Estimated</p>
            <p
              className={`${basicInfoStyles.fieldValue} ${basicInfoStyles.fieldValueGreen}`}
            >
              {data?.totalEstimated
                ? `$${Number(data.totalEstimated).toLocaleString("en-US")}`
                : "—"}
            </p>
          </div>
          <div
            className={`${basicInfoStyles.fieldItem} ${basicInfoStyles.lastRow}`}
          >
            <p className={basicInfoStyles.fieldLabel}>Required Date</p>
            <p className={basicInfoStyles.fieldValue}>
              {data?.requiredDate
                ? moment(data.requiredDate).format("DD MMM YYYY")
                : "—"}
            </p>
          </div>
          <div
            className={`${basicInfoStyles.fieldItem} ${basicInfoStyles.lastRow}`}
          >
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
            <div
              className={`${basicInfoStyles.sectionIcon} ${basicInfoStyles.sectionIconBlue}`}
            >
              <i className="pi pi-user" />
            </div>
            <p className={basicInfoStyles.sectionTitle}>Requester Details</p>
          </div>
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
          <div
            className={`${basicInfoStyles.fieldItem} ${basicInfoStyles.lastRow}`}
          >
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
            {/* AI Overview */}
            AI Suggestions
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
