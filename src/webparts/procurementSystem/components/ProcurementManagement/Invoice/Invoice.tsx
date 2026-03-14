import * as React from "react";
import styles from "./Invoice.module.scss";

const Invoice: React.FC<{ data?: any }> = (props) => {
  const data = props.data || {};

  return (
    <div className={styles.wrapper}>
      {/* ===== VALIDATION STATUS BANNER ===== */}
      <div className={styles.validationBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIconWrap}>🎉</div>
          <div>
            <p className={styles.bannerTitle}>Invoice Validation Complete</p>
            <p className={styles.bannerSub}>
              All steps verified · Ready for payment processing and order
              closure
            </p>
          </div>
        </div>
        <span className={styles.validatedBadge}>✓ VALIDATED</span>
      </div>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className={styles.mainGrid}>
        {/* LEFT: Invoice Validation Card */}
        <div className={styles.invoiceCard}>
          {/* Card Header */}
          <div className={styles.invoiceCardHeader}>
            <div className={styles.invoiceCardHeaderLeft}>
              <div className={styles.invoiceCardIconWrap}>
                <i className="pi pi-file-check" />
              </div>
              <p className={styles.invoiceCardTitle}>Invoice Validation</p>
            </div>
            <span className={styles.invoiceCardSubInfo}>
              Generated from {data.poReference || "PO-2026-001"}
            </span>
          </div>

          {/* Invoice Number + Date */}
          <div className={styles.invoiceTop}>
            <div className={styles.invoiceNumberBlock}>
              <p className={styles.fieldLabel}>Invoice Number</p>
              <p className={styles.invoiceNumber}>
                {data.invoiceNumber || "INV-V-2026-142"}
              </p>
            </div>
            <div className={styles.invoiceDateBlock}>
              <p className={styles.fieldLabel}>Invoice Date</p>
              <p className={styles.invoiceDate}>
                {data.invoiceDate
                  ? data.invoiceDate.replace(/\//g, " / ")
                  : "06 / 03 / 2026"}
              </p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className={styles.invoiceDetails}>
            <p className={styles.sectionSubLabel}>Invoice Details</p>
            <div className={styles.detailsGrid}>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Vendor</p>
                <p className={styles.itemValueCon}>
                  {data.vendor || "Vendor 1"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Vendor Code</p>
                <p className={styles.itemValueCon}>
                  {data.vendorCode || "VEN-2025-0142"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>GST Number</p>
                <p className={styles.itemValueCon}>
                  {data.gstNumber || "06AABC1234F1Z5"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Invoice Amount</p>
                <p
                  className={`${styles.itemValueCon} ${styles.itemValueGreen}`}
                >
                  {data.amount || "₹1,29,800"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Due Date</p>
                <p className={`${styles.itemValueCon} ${styles.itemValueRed}`}>
                  {data.dueDate || "05 Apr 2026"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>Payment Terms</p>
                <p className={styles.itemValueCon}>
                  {data.paymentTerms || "Net 30 Days"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>PO Reference</p>
                <p className={`${styles.itemValueCon} ${styles.itemValueBlue}`}>
                  {data.poReference || "PO-2026-001"}
                </p>
              </div>
              <div className={styles.itemCon}>
                <p className={styles.itemLabelCon}>GRN Reference</p>
                <p
                  className={`${styles.itemValueCon} ${styles.itemValueOrange}`}
                >
                  {data.grnReference || "GRN-2026-089"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Status Row */}
          <div className={styles.statusRow}>
            <div className={styles.statusPill}>
              <span>Payment Status</span>
              <span className={styles.statusDot} />
              <span className={styles.statusPendingLabel}>Pending</span>
            </div>
            <span className={styles.statusSep}>|</span>
            <div className={styles.statusPill}>
              <span
                className={styles.statusDotGreen}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--themeColorDark, #e67e22)",
                  display: "inline-block",
                }}
              />
              <span>Validation</span>
              <span className={styles.statusApprovedLabel}>Approved</span>
            </div>
            <span className={styles.statusDueBadge}>
              Due by {data.dueDate || "05 Apr 2026"}
            </span>
          </div>
        </div>

        {/* RIGHT: Related Documents */}
        <div className={styles.rightCol}>
          <div className={styles.relatedDocsCard}>
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
                  download={"Invoice.docx"}
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
            {/* <div className={styles.relatedDocsHeader}>
              <span className={styles.relatedDocsIconWrap}>🔗</span>
              <p className={styles.relatedDocsTitle}>Related Documents</p>
            </div>
            <div className={styles.relatedDocsList}>
              <div className={styles.docItem}>
                <div className={styles.docItemLeft}>
                  <div
                    className={`${styles.docIconWrap} ${styles.docIconWrapGreen}`}
                  >
                    <i
                      className="pi pi-file"
                      style={{ color: "var(--themeColorDark, #e67e22)" }}
                    />
                  </div>
                  <p className={styles.docLabel}>
                    {data.poReference || "PO-2026-001"}
                  </p>
                </div>
                <i className={`pi pi-chevron-right ${styles.docArrow}`} />
              </div>
              <div className={styles.docItem}>
                <div className={styles.docItemLeft}>
                  <div
                    className={`${styles.docIconWrap} ${styles.docIconWrapOrange}`}
                  >
                    <i className="pi pi-box" style={{ color: "#e67e22" }} />
                  </div>
                  <p className={styles.docLabel}>
                    {data.grnReference || "GRN-2026-089"}
                  </p>
                </div>
                <i className={`pi pi-chevron-right ${styles.docArrow}`} />
              </div>
              <div className={styles.docItem}>
                <div className={styles.docItemLeft}>
                  <div
                    className={`${styles.docIconWrap} ${styles.docIconWrapBlue}`}
                  >
                    <i className="pi pi-file" style={{ color: "#3182ce" }} />
                  </div>
                  <p className={styles.docLabel}>{data.prId || "PR-001"}</p>
                </div>
                <i className={`pi pi-chevron-right ${styles.docArrow}`} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
