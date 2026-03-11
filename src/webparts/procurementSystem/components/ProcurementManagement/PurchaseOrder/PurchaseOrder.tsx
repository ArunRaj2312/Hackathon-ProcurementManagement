import * as React from "react";
import styles from "./PurchaseOrder.module.scss";

const PurchaseOrder: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};

  const lineItems = data.lineItems || [
    {
      description: "Laptop — Dell Latitude 5440",
      subDescription: "Electronics · Hardware · SKU: DL-LAT-5440",
      quantity: "20 units",
      unitPrice: "68,000",
      amount: "13,60,000",
    },
  ];

  const subTotal = "13,60,000";
  const cgst = "9,900";
  const sgst = "9,900";
  const totalAmount = "₹ 13,78,800";

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainGrid}>
        {/* ===== LEFT COLUMN ===== */}
        <div className={styles.leftCol}>
          {/* PO Details Card */}
          <div className={styles.poCard}>
            {/* Card Header */}
            <div className={styles.poCardHeader}>
              <div className={styles.poCardHeaderLeft}>
                <div className={styles.poCardIconWrap}>
                  <i className="pi pi-file" />
                </div>
                <p className={styles.poCardTitle}>Purchase Order</p>
              </div>
              <span className={styles.poCardSubInfo}>
                {data.poNumber || "PO-2026-001"} · Generated from PR-001
              </span>
            </div>

            {/* PO Number + Issue Date */}
            <div className={styles.poTop}>
              <div className={styles.poNumberBlock}>
                <p className={styles.fieldLabel}>Purchase Order Number</p>
                <p className={styles.poNumber}>{data.poNumber || "PO-2026-001"}</p>
              </div>
              <div className={styles.issueDateBlock}>
                <p className={styles.fieldLabel}>Issue Date</p>
                <p className={styles.issueDate}>
                  {data.issueDate
                    ? data.issueDate.replace(/\//g, " / ")
                    : "22 / 02 / 2026"}
                </p>
              </div>
            </div>

            {/* Vendor Details */}
            <div className={styles.vendorDetails}>
              <p className={styles.sectionSubLabel}>Vendor Details</p>
              <div className={styles.subTitleCon}>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Company Name</p>
                  <p className={styles.itemValueCon}>{data.vendor?.name || "Vendor 1"}</p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Vendor Code</p>
                  <p className={styles.itemValueCon}>{data.vendor?.code || "VEN-2025-0142"}</p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>GST Number</p>
                  <p className={styles.itemValueCon}>06AABC1234F1Z5</p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Contact Person</p>
                  <p className={styles.itemValueCon}>Ramesh Kumar</p>
                </div>
                <div className={styles.itemCon} style={{ gridColumn: "span 2" }}>
                  <p className={styles.itemLabelCon}>Address</p>
                  <p className={styles.itemValueCon}>
                    Plot 45, Industrial Area, Sector 18<br />
                    Gurgaon, Haryana — 122015
                  </p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Delivery Date</p>
                  <p className={styles.itemValueCon}>
                    <strong>{data.deliveryDate || "06 Mar 2026"}</strong>
                  </p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Payment Terms</p>
                  <p className={`${styles.itemValueCon} ${styles.itemValueGreen}`}>
                    {data.paymentTerms || "Net 30 days"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          <div className={styles.lineItemsCard}>
            <div className={styles.lineItemsHeader}>
              <div className={styles.lineItemsHeaderLeft}>
                <div className={styles.lineItemsIconWrap}>📦</div>
                <p className={styles.lineItemsTitle}>Line Items</p>
              </div>
              <span className={styles.lineItemCount}>{lineItems.length} item</span>
            </div>

            <table className={styles.lineItemsTable}>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Unit Price (₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <span className={styles.tdItemName}>{item.description}</span>
                      {item.subDescription && (
                        <span className={styles.tdItemSub}>{item.subDescription}</span>
                      )}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotals */}
            <div className={styles.totalsSection}>
              <div className={styles.totalsRow}>
                <p className={styles.totalsLabel}>Sub Total</p>
                <p className={styles.totalsValue}>{subTotal}</p>
              </div>
              <div className={styles.totalsRow}>
                <p className={styles.totalsLabel}>CGST (9%)</p>
                <p className={styles.totalsValue}>{cgst}</p>
              </div>
              <div className={styles.totalsRow}>
                <p className={styles.totalsLabel}>SGST (9%)</p>
                <p className={styles.totalsValue}>{sgst}</p>
              </div>
            </div>
            {/* Grand Total */}
            <div className={styles.totalAmountRow}>
              <p className={styles.totalAmountLabel}>Total Amount</p>
              <p className={styles.totalAmountValue}>{totalAmount}</p>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className={styles.rightCol}>
          {/* Actions Card */}
          <div className={styles.actionsCard}>
            <div className={styles.actionsCardHeader}>
              <span className={styles.actionsIconWrap}>⚡</span>
              <p className={styles.actionsTitle}>Actions</p>
            </div>
            <div className={styles.actionsBody}>
              <button className={styles.btnPrimary}>
                <i className="pi pi-file-pdf" />
                Generate PDF
              </button>
              <button className={styles.btnOutline}>
                <i className="pi pi-send" />
                Email Vendor
              </button>
              <button className={styles.btnOutline}>
                <i className="pi pi-download" />
                Download Copy
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
              <span className={styles.summaryIconWrap}>🗒️</span>
              <p className={styles.summaryCardTitle}>Order Summary</p>
            </div>
            <div className={styles.summaryBody}>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>PO Number</p>
                <p className={styles.summaryPoNumber}>{data.poNumber || "PO-2026-001"}</p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Vendor</p>
                <p className={styles.summaryValue}>{data.vendor?.name || "Vendor 1"}</p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Item</p>
                <p className={styles.summaryValue}>
                  {lineItems[0]?.description?.replace("Laptop — ", "") || "Dell Latitude 5440"}
                </p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Quantity</p>
                <p className={styles.summaryValue}>{lineItems[0]?.quantity || "20 Units"}</p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Delivery By</p>
                <p className={styles.summaryValue}>{data.deliveryDate || "06 Mar 2026"}</p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Total Amount</p>
                <p className={styles.summaryValueGreen}>{totalAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
