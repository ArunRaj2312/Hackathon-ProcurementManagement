import * as React from "react";
import styles from "./PurchaseOrder.module.scss";

const PurchaseOrder: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};

  const lineItems = data.lineItems || [];
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
                {data.poNumber || "N/A"} · Generated from {data.prId || "N/A"}
              </span>
            </div>

            {/* PO Number + Issue Date */}
            <div className={styles.poTop}>
              <div className={styles.poNumberBlock}>
                <p className={styles.fieldLabel}>Purchase Order Number</p>
                <p className={styles.poNumber}>{data.poNumber || "N/A"}</p>
              </div>
              <div className={styles.issueDateBlock}>
                <p className={styles.fieldLabel}>Issue Date</p>
                <p className={styles.issueDate}>
                  {data.issueDate
                    ? data.issueDate.replace(/\//g, " / ")
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Vendor Details */}
            <div className={styles.vendorDetails}>
              <p className={styles.sectionSubLabel}>Vendor Details</p>
              <div className={styles.subTitleCon}>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Company Name</p>
                  <p className={styles.itemValueCon}>
                    {data.vendor?.companyName || "N/A"}
                  </p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Vendor Code</p>
                  <p className={styles.itemValueCon}>
                    {data.vendor?.code || "N/A"}
                  </p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>GST Number</p>
                  <p className={styles.itemValueCon}>
                    {data.vendor?.gstNumber || "N/A"}
                  </p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Contact Person</p>
                  <p className={styles.itemValueCon}>
                    {data.vendor?.contactPerson || "N/A"}
                  </p>
                </div>
                <div
                  className={styles.itemCon}
                  style={{ gridColumn: "span 2" }}
                >
                  <p className={styles.itemLabelCon}>Address</p>
                  <p className={styles.itemValueCon}>
                    {data.vendor?.address
                      ? data.vendor.address
                          .split("\n")
                          .map((line: string, i: number) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))
                      : "N/A"}
                  </p>
                </div>
                <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Delivery Date</p>
                  <p className={styles.itemValueCon}>
                    <strong>{data.deliveryDate || "N/A"}</strong>
                  </p>
                </div>
                {/* <div className={styles.itemCon}>
                  <p className={styles.itemLabelCon}>Payment Terms</p>
                  <p
                    className={`${styles.itemValueCon} ${styles.itemValueGreen}`}
                  >
                    {data.paymentTerms || "N/A"}
                  </p>
                </div> */}
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
              <span className={styles.lineItemCount}>
                {lineItems.length} item{lineItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            <table className={styles.lineItemsTable}>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Quantity</th>
                  <th>Unit Price ($)</th>
                  <th>Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <span className={styles.tdItemName}>
                        {item.description || "N/A"}
                      </span>
                      {item.subDescription && (
                        <span className={styles.tdItemSub}>
                          {item.subDescription}
                        </span>
                      )}
                    </td>
                    <td>{item.quantity || "N/A"}</td>
                    <td>{item.unitPrice || "N/A"}</td>
                    <td>{item.amount || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Subtotals */}
            <div className={styles.totalsSection}>
              <div className={styles.totalsRow}>
                <p className={styles.totalsLabel}>Sub Total</p>
                <p className={styles.totalsValue}>{data.subTotal || "0"}</p>
              </div>
              <div className={styles.totalsRow}>
                <p className={styles.totalsLabel}>CGST (0%)</p>
                <p className={styles.totalsValue}>{data.cgst || "0"}</p>
              </div>
              <div className={styles.totalsRow}>
                <p className={styles.totalsLabel}>SGST (0%)</p>
                <p className={styles.totalsValue}>{data.sgst || "0"}</p>
              </div>
            </div>
            {/* Grand Total */}
            <div className={styles.totalAmountRow}>
              <p className={styles.totalAmountLabel}>Total Amount</p>
              <p className={styles.totalAmountValue}>
                {data.totalAmount || "0"}
              </p>
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
              {/* <button className={styles.btnPrimary}>
                <i className="pi pi-file-pdf" />
                Generate PDF
              </button>
              <button className={styles.btnOutline}>
                <i className="pi pi-send" />
                Email Vendor
              </button> */}
              <a
                href={data.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={"PO.docx"}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none" }}
              >
                <button className={styles.btnOutline}>
                  <i className="pi pi-download" />
                  Download Copy
                </button>
              </a>
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
                <p className={styles.summaryPoNumber}>
                  {data.poNumber || "N/A"}
                </p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Vendor</p>
                <p className={styles.summaryValue}>
                  {data.vendor?.name || "N/A"}
                </p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Item</p>
                <p className={styles.summaryValue}>
                  {lineItems[0]?.description || "N/A"}
                </p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Quantity</p>
                <p className={styles.summaryValue}>
                  {lineItems[0]?.quantity || "N/A"}
                </p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Delivery By</p>
                <p className={styles.summaryValue}>
                  {data.deliveryDate || "N/A"}
                </p>
              </div>
              <div className={styles.summaryRow}>
                <p className={styles.summaryLabel}>Total Amount</p>
                <p className={styles.summaryValueGreen}>
                  {data.totalAmount || "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
