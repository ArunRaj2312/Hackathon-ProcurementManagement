import * as React from "react";
import styles from "./Approval.module.scss";

const Approval: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <div className={styles.topGrid}>
        {/* Selected Vendor */}
        <div className={`${styles.card} ${styles.vendorCard}`}>
          <h3 className={styles.title}>Selected Vendor</h3>

          <div className={styles.vendorHeader}>
            <div className={styles.vendorInfo}>
              <strong>{data?.selectedVendor?.name || "Vendor 1"}</strong>
              <div className={styles.meta}>
                ₹{data?.selectedVendor?.price || "110"}/unit •{" "}
                {data?.selectedVendor?.days || "12"} days
              </div>
            </div>
            <div className={styles.finalScore}>
              <span>Final Score</span>
              <strong>{data?.selectedVendor?.finalScore || "90"}</strong>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statBox}>
              <span>On-Time delivery</span>
              <strong>92%</strong>
            </div>
            <div className={styles.statBox}>
              <span>Quality Score</span>
              <strong>88/100</strong>
            </div>
          </div>

          <button className={styles.linkBtn}>View score breakdown</button>
        </div>

        {/* Purchase Summary */}
        <div className={styles.card}>
          <h3 className={styles.title}>Purchase Request Summary</h3>

          <div className={styles.summaryRow}>
            <span>PR ID</span>
            <strong>{data?.purchaseSummary?.prId || "PR-001"}</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Item</span>
            <strong>
              {data?.purchaseSummary?.item || "Laptop – Dell Latitude 5440"}
            </strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Quantity</span>
            <strong>{data?.purchaseSummary?.quantity || "20 Units"}</strong>
          </div>

          <div className={styles.summaryRow}>
            <span>Total amount</span>
            <strong>
              {data?.purchaseSummary?.totalAmount || "₹13,60,000"}
            </strong>
          </div>
        </div>
      </div>

      {/* Approval Section (separated panel) */}
      <div className={styles.approvalPanel}>
        <div className={styles.approvalHeader}>
          <div className={styles.approver}>
            <div className={styles.avatar}>👤</div>
            <div>
              <strong>Head of Procurement</strong>
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
