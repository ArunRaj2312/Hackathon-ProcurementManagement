import * as React from "react";
import styles from "./Approval.module.scss";

const Approval: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <div>
        <p className={styles.topTitle}>Selected Vendor</p>
      </div>
      <div className={styles.topGrid}>
        {/* Selected Vendor */}
        {/* <div className={styles.cardLayoutCon}> */}
        <div className={styles.cardMainCon}>
          <div className={styles.vendorNameMainCon}>
            <div className={styles.vendorNameCon}>
              <p className={styles.vendorNameStyle}>
                {data?.selectedVendor?.name || "Vendor 1"}
              </p>
              <div className={styles.unitDaysMainCon}>
                <div className={styles.unitMainCon}>
                  <i className={`${styles.iconStyle} pi pi-dollar`}></i>
                  <p className={styles.unitStyle}>
                    ₹{data?.selectedVendor?.price || "110"}/unit •{" "}
                  </p>
                </div>
                <div className={styles.daysMainCon}>
                  <i className={`${styles.iconStyle} pi pi-clock`}></i>
                  <p className={styles.daysStyle}>
                    {data?.selectedVendor?.days || "12"} days
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.unitDaysFScoreMainCon}>
              <div className={styles.finalScoreMainCon}>
                <p className={styles.finalScoreLabel}>Final Score</p>
                <p className={styles.finalScoreValue}>
                  {data?.selectedVendor?.finalScore || "90"}
                </p>
              </div>
            </div>
          </div>
          {/* on time delivery */}
          <div className={styles.labelValueMainCon}>
            <div className={styles.labelValueCon}>
              <p className={styles.labelStyle}>On-Time delivery</p>
              <p className={styles.valueStyle}>90 %</p>
            </div>
            <div className={styles.labelValueCon}>
              <p className={styles.labelStyle}>Quality Score</p>
              <p className={styles.valueStyle}>88 /100</p>
            </div>
          </div>
          {/* view score breakdown */}
          <div
            className={styles.viewScoreMainCon}
            //onClick={() => handleToggle(item?.id)}
            style={{ cursor: "pointer" }}
          >
            <p className={styles.viewScoreLabel}>View score breakdown</p>
            {/* <i
                className={`${styles.viewScoreIcon} pi ${
                  openVendor === item?.id ? "pi-angle-up" : "pi-angle-down"
                }`}
              ></i> */}
          </div>
          {/* view score breakdown content */}
          {/* {openVendor === item?.id && (
              <div className={styles.viewScoreContentMainCon}>
                <div className={styles.viewScoreItem}>
                  <p className={styles.viewScoreContentLabel}>
                    Price Competitiveness
                  </p>
                  <p className={styles.viewScoreContentValue}>
                    {item?.viewScoreBreakdown?.priceCompetitiveness}/100
                  </p>
                </div>
                <div className={styles.viewScoreItem}>
                  <p className={styles.viewScoreContentLabel}>
                    Delivery timeline
                  </p>
                  <p className={styles.viewScoreContentValue}>
                    {item?.viewScoreBreakdown?.deliveryTimeline}/100
                  </p>
                </div>
                <div className={styles.viewScoreItem}>
                  <p className={styles.viewScoreContentLabel}>
                    Historical performance
                  </p>
                  <p className={styles.viewScoreContentValue}>
                    {item?.viewScoreBreakdown?.HistoricalPerformance}/100
                  </p>
                </div>
                <div className={styles.viewScoreItem}>
                  <p className={styles.viewScoreContentLabel}>
                    Quality Certification
                  </p>
                  <p className={styles.viewScoreContentValue}>
                    {item?.viewScoreBreakdown?.qualityCertification}/100
                  </p>
                </div>
              </div>
            )} */}
        </div>
        {/* </div> */}

        {/* Purchase Summary */}
        <div className={styles.basicInfoMainCon}>
          <p className={styles.subtitle}>Purchase Request Summary</p>
          <div className={styles.subTitleCon}>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>PR ID</p>
              <p className={styles.itemValueCon}>
                {data?.purchaseSummary?.prId}
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Item</p>
              <p className={styles.itemValueCon}>
                {data?.purchaseSummary?.item || "Laptop – Dell Latitude 5440"}
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Quantity</p>
              <p className={styles.itemValueCon}>
                {data?.purchaseSummary?.quantity || "20 Units"}
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Total amount</p>
              <p className={styles.itemValueCon}>
                {data?.purchaseSummary?.totalAmount || "₹13,60,000"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Section (separated panel) */}
      <div className={styles.approvalPanel}>
        <div className={styles.approvalHeader}>
          <div className={styles.approver}>
            <div className={styles.avatar}>👤</div>
            <div>
              <strong className={styles.mainText}>Head of Procurement</strong>
              <div className={styles.subText}>Mohan</div>
            </div>
          </div>
        </div>

        <div className={styles.approvalBody}>
          <label className={styles.label}>Add comment</label>
          <textarea
            className={styles.textarea}
            defaultValue="Price within budget. Vendor approved."
          />

          <div className={styles.actions}>
            <button className={styles.approve}>✔ Approve</button>
            <button className={styles.reject}>✖ Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approval;
