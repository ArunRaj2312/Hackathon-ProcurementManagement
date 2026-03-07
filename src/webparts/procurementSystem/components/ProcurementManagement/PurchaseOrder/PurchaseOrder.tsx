import * as React from "react";
import styles from "./PurchaseOrder.module.scss";

const PurchaseOrder: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div>
        <p className={styles.title}>Purchase order</p>
        <p className={styles.subtitle}>
          {data?.poNumber || "PO-2026-001"} - Generated From{" "}
          {data?.prId || "PR-001"}
        </p>
      </div>

      {/* PO Card */}
      <div className={styles.poCard}>
        <div className={styles.poTop}>
          <div className={styles.poContentCon}>
            <span className={styles.label}>Purchase Order Number</span>
            <strong className={styles.value}>
              {data?.poNumber || "PO-2026-001"}
            </strong>
          </div>
          <div className={styles.poContentCon}>
            <span className={styles.label}>Issue date</span>
            <strong className={styles.value}>
              {data?.issueDate || "22/02/2026"}
            </strong>
          </div>
        </div>

        {/* Vendor Details */}
        <div className={styles.vendorDetails}>
          <p className={styles.subtitle}>Vendor Details</p>
          <div className={styles.subTitleCon}>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Company name</p>
              <p className={styles.itemValueCon}>
                {data?.vendor?.name || "Vendor 1"}
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Vendor code</p>
              <p className={styles.itemValueCon}>
                {data?.vendor?.code || "VEN-2025-0142"}
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>GST number</p>
              <p className={styles.itemValueCon}>06AABC1234F1Z5</p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Contact person</p>
              <p className={styles.itemValueCon}>Ramesh Kumar</p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Address</p>
              <p className={styles.itemValueCon}>
                {" "}
                Plot 45, Industrial Area, Sector 18
                <br />
                Gurgaon, Haryana - 122015
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Delivery date</p>
              <p className={styles.itemValueCon}>
                {data?.deliveryDate || "06/03/2026"}
              </p>
            </div>
            <div className={styles.itemCon}>
              <p className={styles.itemLabelCon}>Payment terms</p>
              <p className={styles.itemValueCon}>
                {data?.paymentTerms || "Net 30 days"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomGrid}>
        {/* Line Items */}
        <div className={styles.lineItems}>
          <h3>Line items</h3>

          <table>
            <thead>
              <tr>
                <th>Item description</th>
                <th>Quantity</th>
                <th>Unit price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Laptop-Dell Latitude 5440</td>
                <td style={{ textAlign: "center" }}>20 units</td>
                <td style={{ textAlign: "center" }}>68,000</td>
                <td style={{ textAlign: "center" }}>13,60,000</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.calculation}>
            <div className={styles.subContentCon}>
              <span className={styles.label}>Sub total</span>
              <span className={styles.value}>13,60,000</span>
            </div>
            <div className={styles.subContentCon}>
              <span className={styles.label}>CGST (9%)</span>
              <span className={styles.value}>9,900</span>
            </div>
            <div className={styles.subContentCon}>
              <span className={styles.label}>SGST (9%)</span>
              <span className={styles.value}>9,900</span>
            </div>

            <div
              // className={styles.total}
              className={`${styles.total} ${styles.subContentCon}`}
            >
              <span className={styles.label}>Total Amount</span>
              <span className={styles.value}>13,78,800</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <h3>Action</h3>

          <button className={styles.primary}>Generate PDF</button>
          <button className={styles.outline}>Email vendor</button>
          <button className={styles.outline}>Download copy</button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
