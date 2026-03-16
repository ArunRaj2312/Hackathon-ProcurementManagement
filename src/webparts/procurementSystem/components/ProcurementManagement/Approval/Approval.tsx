import * as React from "react";
// import { useState } from "react";
import styles from "./Approval.module.scss";
import * as moment from "moment";

const Approval: React.FC<{
  data?: any;
  userRole?: string;
  userDetails?: any;
  onDataChange?: (data: any) => void;
}> = (props) => {
  const data = props.data || {};
  // const [openBreakdown, setOpenBreakdown] = useState(false);

  const vendor = data.selectedVendor || {};
  const summary = data.purchaseSummary || {};

  const toPercent = (val: any): number => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : Math.min(n, 100);
  };

  const onTimeVal = toPercent(vendor.ontimeDelivery || 0);
  const qualityVal = toPercent(vendor.qualityScore || 0);
  // const priceVal = toPercent(
  //   vendor.viewScoreBreakdown?.priceCompetitiveness || 0,
  // );

  return (
    <div className={styles.container}>
      {/* ===== STATUS BANNER ===== */}
      <div className={styles.statusBanner}>
        <div className={styles.statusLeft}>
          <div className={styles.statusIconWrap}>⏳</div>
          <div>
            <p className={styles.statusTitle}>Awaiting Manager Approval</p>
            <p className={styles.statusSub}>
              {`Submitted on ${summary.submissionDate ? moment(summary.submissionDate).format("DD MMM YYYY") : ""} · Estimated response within 48 hrs`}
            </p>
          </div>
        </div>
        <span className={styles.pendingBadge}>PENDING</span>
      </div>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className={styles.topGrid}>
        {/* LEFT: Selected Vendor Card */}
        <div className={styles.vendorCard}>
          {/* Card header: label + TOP PICK */}
          <div className={styles.vendorCardHeader}>
            <p className={styles.vendorCardTitle}>Selected Vendor</p>
            {vendor.selected && (
              <span className={styles.topPickBadge}>
                <i className="pi pi-star-fill" />
                TOP PICK
              </span>
            )}
            {!vendor.selected && (
              <span className={styles.topPickBadge}>
                <i className="pi pi-star-fill" />
                TOP PICK
              </span>
            )}
          </div>

          {/* Name + Final Score */}
          <div className={styles.vendorNameMainCon}>
            <div className={styles.vendorNameCon}>
              <p className={styles.vendorNameStyle}>{vendor.name || ""}</p>
              <div className={styles.unitDaysMainCon}>
                <div className={styles.unitMainCon}>
                  {/* <i className={`${styles.iconStyle} pi pi-indian-rupee`} /> */}
                  <p className={styles.unitStyle}>
                    ${vendor.unit || ""} / unit
                  </p>
                </div>
                <span style={{ color: "#c8d0d8" }}>•</span>
                <div className={styles.daysMainCon}>
                  <i className={`${styles.iconStyle} pi pi-clock`} />
                  <p className={styles.daysStyle}>{vendor.days || ""} days</p>
                </div>
              </div>
            </div>
            <div className={styles.finalScoreBlock}>
              <p className={styles.finalScoreLabel}>FINAL SCORE</p>
              <p className={styles.finalScoreValue}>
                <span className={styles.scoreNumber}>
                  {vendor.finalScore || ""}
                </span>
                <span className={styles.scoreDenom}>/100</span>
              </p>
            </div>
          </div>

          {/* On-Time + Quality panels */}
          <div className={styles.labelValueMainCon}>
            <div className={styles.labelValueCon}>
              <p className={styles.labelStyle}>On-Time Delivery</p>
              <p className={styles.valueStyle}>{onTimeVal}%</p>
            </div>
            <div className={styles.labelValueCon}>
              <p className={styles.labelStyle}>Quality Score</p>
              <p className={styles.valueStyle}>{qualityVal}/100</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className={styles.progressBarsSection}>
            <div className={styles.progressRow}>
              <p className={styles.progressLabel}>Delivery Reliability</p>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${onTimeVal}%` }}
                />
              </div>
              <p className={styles.progressValue}>{onTimeVal}%</p>
            </div>
            <div className={styles.progressRow}>
              <p className={styles.progressLabel}>Quality</p>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${qualityVal}%` }}
                />
              </div>
              <p className={styles.progressValue}>{qualityVal}/100</p>
            </div>
            {/* <div className={styles.progressRow}>
              <p className={styles.progressLabel}>Price Competitiveness</p>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${priceVal}%` }}
                />
              </div>
              <p className={styles.progressValue}>{priceVal}/100</p>
            </div> */}
          </div>

          {/* View score breakdown */}
          {/* <div
            className={styles.viewScoreMainCon}
            onClick={() => setOpenBreakdown((p) => !p)}
          >
            <p className={styles.viewScoreLabel}>View score breakdown</p>
            <i
              className={`${styles.viewScoreIcon} pi ${openBreakdown ? "pi-angle-up" : "pi-angle-down"}`}
            />
          </div> */}
        </div>

        {/* RIGHT: Purchase Request Summary */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardHeader}>
            <div className={styles.summaryIconWrap}>
              <i className="pi pi-file" />
            </div>
            <p className={styles.summaryCardTitle}>Purchase Request Summary</p>
          </div>
          <div className={styles.summaryBody}>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>PR ID</p>
              <p
                className={styles.summaryValue}
                style={{
                  color: "var(--themeColorDark, #e67e22)",
                  fontWeight: 700,
                }}
              >
                {summary.prId || ""}
              </p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Item</p>
              <p className={styles.summaryValue}>{summary.item || ""}</p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Quantity</p>
              <p className={styles.summaryValue}>{summary.quantity || ""}</p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Unit Price</p>
              <p className={styles.summaryValue}>${summary.unitPrice || ""}</p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Required Date</p>
              <p className={styles.summaryValue}>
                {summary.requiredDate
                  ? moment(summary.requiredDate).format("DD/MM/YYYY")
                  : ""}
              </p>
            </div>
            <div className={styles.summaryRow}>
              <p className={styles.summaryLabel}>Total Amount</p>
              <p className={styles.summaryValueGreen}>
                {summary.totalAmount || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ADD COMMENT ===== */}
      <div className={styles.commentCard}>
        <div className={styles.commentCardHeader}>
          <i
            className="pi pi-comment"
            style={{ color: "#a0aab4", fontSize: 16 }}
          />
          <p className={styles.commentCardTitle}>Add Comment</p>
        </div>
        <div className={styles.commentBody}>
          <textarea
            className={styles.textarea}
            placeholder="Write your notes or remarks for the approver..."
            disabled={props.userRole === "User"}
            value={data.comments || ""}
            onChange={(e) => {
              props.onDataChange &&
                props.onDataChange((prev: any) => ({
                  ...prev,
                  approval: {
                    ...prev.approval,
                    comments: e.target.value,
                  },
                }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Approval;
