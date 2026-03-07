import * as React from "react";
import styles from "./Invoice.module.scss";

const Invoice: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div>
        <p className={styles.title}>Invoice Validation</p>
      </div>
      <div className={styles.mainGrid}>
        {/* Left Section */}

        <div className={styles.poCard}>
          <div className={styles.poTop}>
            <div className={styles.poContentCon}>
              <span className={styles.label}>Invoice Number</span>
              <strong className={styles.value}>
                {data?.invoiceNumber || "INV-V-2026-142"}
              </strong>
            </div>
            <div className={styles.poContentCon}>
              <span className={styles.label}>Invoice date</span>
              <strong className={styles.value}>
                {data?.invoiceDate || "06/03/2026"}
              </strong>
            </div>
          </div>

          {/* Invoice Details */}
          <div className={styles.vendorDetails}>
            <p className={styles.subtitle}>Invoice Details</p>
            <div className={styles.subTitleCon}>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Vendor</p>
                <p className={styles.itemValueCon}>
                  {data?.vendor || "Vendor-1"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Vendor code</p>
                <p className={styles.itemValueCon}>
                  {data?.vendorCode || "VEN-2025-0142"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>GST number</p>
                <p className={styles.itemValueCon}>
                  {data?.gstNumber || "06AABC1234F1Z5"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Amount</p>
                <p className={styles.itemValueCon}>
                  {data?.amount || "₹1,29,800"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Due date</p>
                <p className={styles.itemValueCon}>
                  {data?.dueDate || "05/04/2026"}
                </p>
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
