import * as React from "react";
import styles from "./PurchaseOrder.module.scss";

const PurchaseOrder: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Purchase order</h2>
        <span className={styles.subHeader}>
          {data?.poNumber || "PO-2026-001"} - Generated From{" "}
          {data?.prId || "PR-001"}
        </span>
      </div>

      {/* PO Card */}
      <div className={styles.poCard}>
        <div className={styles.poTop}>
          <div>
            <span className={styles.label}>Purchase Order Number</span>
            <div className={styles.poNumber}>
              {data?.poNumber || "PO-2026-001"}
            </div>
          </div>
          <div className={styles.issueDate}>
            <span className={styles.label}>Issue date</span>
            <strong>{data?.issueDate || "22/02/2026"}</strong>
          </div>
        </div>

        {/* Vendor Details */}
        <div className={styles.vendorBox}>
          <div className={styles.vendorTitle}>VENDOR DETAILS</div>

          <div className={styles.vendorGrid}>
            <div>
              <span className={styles.label}>Company name</span>
              <p>{data?.vendor?.name || "Vendor 1"}</p>
            </div>
            <div>
              <span className={styles.label}>Vendor code</span>
              <p>{data?.vendor?.code || "VEN-2025-0142"}</p>
            </div>
            <div>
              <span className={styles.label}>GST number</span>
              <p>06AABC1234F1Z5</p>
            </div>
            <div>
              <span className={styles.label}>Contact person</span>
              <p>Ramesh Kumar</p>
            </div>

            <div>
              <span className={styles.label}>Address</span>
              <p>
                Plot 45, Industrial Area, Sector 18
                <br />
                Gurgaon, Haryana - 122015
              </p>
            </div>
            <div>
              <span className={styles.label}>Delivery date</span>
              <p>{data?.deliveryDate || "06/03/2026"}</p>
            </div>
            <div>
              <span className={styles.label}>Payment terms</span>
              <p>{data?.paymentTerms || "Net 30 days"}</p>
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
                <td>20 units</td>
                <td>68,000</td>
                <td>13,60,000</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.calculation}>
            <div>
              <span>Sub total</span>
              <span>13,60,000</span>
            </div>
            <div>
              <span>CGST (9%)</span>
              <span>9,900</span>
            </div>
            <div>
              <span>SGST (9%)</span>
              <span>9,900</span>
            </div>

            <div className={styles.total}>
              <span>Total Amount</span>
              <span>13,78,800</span>
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
