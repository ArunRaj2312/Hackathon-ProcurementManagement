import * as React from "react";
import styles from "./Invoice.module.scss";

const Invoice: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Invoice Validation</h2>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Section */}
        <div className={styles.invoiceCard}>
          {/* Invoice Header */}
          <div className={styles.invoiceTop}>
            <div>
              <span className={styles.label}>Invoice Number</span>
              <div className={styles.invoiceNo}>
                {data?.invoiceNumber || "INV-V-2026-142"}
              </div>
            </div>
            <div className={styles.dateBlock}>
              <span className={styles.label}>Invoice date</span>
              <strong>{data?.invoiceDate || "06/03/2026"}</strong>
            </div>
          </div>

          {/* Invoice Details */}
          <div className={styles.detailsBox}>
            <div className={styles.detailsTitle}>INVOICE DETAILS</div>

            <div className={styles.detailsGrid}>
              <div>
                <span className={styles.label}>Vendor</span>
                <p>{data?.vendor || "Vendor 1"}</p>
              </div>

              <div>
                <span className={styles.label}>Vendor code</span>
                <p>{data?.vendorCode || "VEN-2025-0142"}</p>
              </div>

              <div>
                <span className={styles.label}>GST number</span>
                <p>{data?.gstNumber || "06AABC1234F1Z5"}</p>
              </div>

              <div>
                <span className={styles.label}>Amount</span>
                <p>{data?.amount || "₹1,29,800"}</p>
              </div>

              <div>
                <span className={styles.label}>Due date</span>
                <p>{data?.dueDate || "05/04/2026"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.actionCard}>
          <button className={styles.primaryBtn}>📄 View invoice PDF</button>

          <div className={styles.relatedBox}>
            <h3>Related Documents</h3>

            <div className={styles.docItem}>
              <span>Po-2026-001</span>
              <span className={styles.icon}>📄</span>
            </div>

            <div className={styles.docItem}>
              <span>GRN-2026-089</span>
              <span className={styles.icon}>📦</span>
            </div>

            <div className={styles.docItem}>
              <span>PR-001</span>
              <span className={styles.icon}>📄</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
