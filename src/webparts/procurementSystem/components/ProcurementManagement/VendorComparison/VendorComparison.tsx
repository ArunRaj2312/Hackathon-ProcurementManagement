import * as React from "react";
import { useEffect, useState } from "react";
import vendorStyles from "../VendorComparison/VendorComparison.module.scss";
// import { getVendorComparisonAI } from "../../../../../services/aiService";

// Placeholder vendor names
// const VENDOR_SLOTS = ["Vendor 1", "Vendor 2", "Vendor 3", "Vendor 4"];

const VendorComparison = (props: {
  data?: any;
  activeTab: Number;
  onDataChange?: (data: any) => void;
}) => {
  // const [openVendor, setOpenVendor] = useState<number | null>(null);
  const [aiOverview, setAiOverview] = useState<string>(
    "Analyzing vendors with AI...",
  );
  console.log("aiOverview", aiOverview);

  // const handleToggle = (id: number, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setOpenVendor((prev) => (prev === id ? null : id));
  // };

  useEffect(() => {
    setAiOverview("");
  }, []);
  // useEffect(() => {
  //   const loadAI = async () => {
  //     const result = await getVendorComparisonAI(props.data?.vendors);

  //     setAiOverview(result);
  //   };
  //   if (props.data?.vendors) {
  //     void loadAI();
  //   }
  // }, [props.data?.vendors]);

  console.log("props.data", props.data);

  const vendors: any[] = props.data?.vendors || [];

  // Helper: returns width% for progress bar, capped at 100
  const toPercent = (val: any): number => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : Math.min(n, 100);
  };

  return (
    <>
      <div className={vendorStyles.vendorLayoutCon}>
        {/* ===== HEADER CARD ===== */}
        <div className={vendorStyles.headerCard}>
          <div className={vendorStyles.headerLeft}>
            <div className={vendorStyles.headerIconWrap}>
              <i className="pi pi-chart-bar" />
            </div>
            <div>
              <p className={vendorStyles.headerTitle}>
                Smart Vendor Evaluation
              </p>
              <p className={vendorStyles.headerSubtitle}>
                {props.data?.purchaseSummary?.prId || ""} · AI-powered vendor
                comparison and recommendation
              </p>
            </div>
          </div>
          <div className={vendorStyles.aiPoweredBadge}>
            <i className="pi pi-plus" />
            AI Powered
          </div>
        </div>

        {/* ===== 2x2 VENDOR GRID ===== */}
        <div className={vendorStyles.cardLayoutCon}>
          {vendors.map((item, slotIndex) => {
            // const item = vendors[slotIndex];

            // Empty slot
            if (!item) {
              return (
                <div key={slotIndex} className={vendorStyles.emptyCard}>
                  <i className={`pi pi-inbox ${vendorStyles.emptyCardIcon}`} />
                  <p className={vendorStyles.emptyCardName}>
                    Vendor {slotIndex + 1}
                  </p>
                  <p className={vendorStyles.emptyCardSub}>
                    No data available yet
                  </p>
                </div>
              );
            }

            // Filled vendor card
            const isSelected = item.selected;
            const isTopPick = item.aiRecommeded;
            const onTimeVal = toPercent(item.ontimeDelivery);
            const qualityVal = toPercent(item.qualityScore);
            const priceVal = toPercent(
              item.viewScoreBreakdown?.priceCompetitiveness,
            );
            const isOrangeOnTime = onTimeVal < 100;

            return (
              <div
                key={item?.id}
                className={`${vendorStyles.cardMainCon} ${isSelected ? vendorStyles.activeCard : ""}`}
                onClick={() => {
                  if (props.activeTab === 2) {
                    let updated = [...vendors];
                    updated = updated.map((v) => ({
                      ...v,
                      selected: v.id === item.id,
                    }));
                    props.onDataChange &&
                      props.onDataChange((prev: any) => ({
                        ...prev,
                        vendorComparison: { vendors: updated },
                      }));
                  }
                }}
              >
                {/* TOP ROW: Name + Score */}
                <div className={vendorStyles.vendorNameMainCon}>
                  <div className={vendorStyles.vendorNameCon}>
                    <div className={vendorStyles.vendorNameTopRow}>
                      <p className={vendorStyles.vendorNameStyle}>
                        {item.name}
                      </p>
                      {isTopPick && (
                        <span className={vendorStyles.topPickBadge}>
                          <i className="pi pi-star-fill" />
                          TOP PICK
                        </span>
                      )}
                    </div>
                    <div className={vendorStyles.unitDaysMainCon}>
                      <div className={vendorStyles.unitMainCon}>
                        <i
                          className={`${vendorStyles.iconStyle} pi pi-dollar`}
                        />
                        <p className={vendorStyles.unitStyle}>
                          {item?.unit ? `$${item.unit}` : "—"} / unit
                        </p>
                      </div>
                      <div className={vendorStyles.daysMainCon}>
                        <i
                          className={`${vendorStyles.iconStyle} pi pi-clock`}
                        />
                        <p className={vendorStyles.daysStyle}>
                          {item?.days ?? "—"} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Final Score */}
                  <div className={vendorStyles.finalScoreBlock}>
                    <p className={vendorStyles.finalScoreLabel}>FINAL SCORE</p>
                    <p className={vendorStyles.finalScoreValue}>
                      <span className={vendorStyles.scoreNumber}>
                        {item?.finalScore ?? "—"}
                      </span>
                      {item?.finalScore && (
                        <span className={vendorStyles.scoreDenom}>/100</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* On-time delivery + Quality Score panels */}
                <div className={vendorStyles.labelValueMainCon}>
                  <div className={vendorStyles.labelValueCon}>
                    <p className={vendorStyles.labelStyle}>On-Time Delivery</p>
                    <p
                      className={`${vendorStyles.valueStyle} ${isOrangeOnTime ? vendorStyles.valueStyleOrange : ""}`}
                    >
                      {item?.ontimeDelivery ?? "—"}%
                    </p>
                  </div>
                  <div className={vendorStyles.labelValueCon}>
                    <p className={vendorStyles.labelStyle}>Quality Score</p>
                    <p className={vendorStyles.valueStyle}>
                      {item?.qualityScore ?? "—"}/100
                    </p>
                  </div>
                </div>

                {/* Progress bars */}
                <div className={vendorStyles.progressBarsSection}>
                  {/* Delivery Reliability */}
                  <div className={vendorStyles.progressRow}>
                    <p className={vendorStyles.progressLabel}>
                      Delivery Reliability
                    </p>
                    <div className={vendorStyles.progressTrack}>
                      <div
                        className={vendorStyles.progressFill}
                        style={{ width: `${onTimeVal}%` }}
                      />
                    </div>
                    <p className={vendorStyles.progressValue}>{onTimeVal}%</p>
                  </div>

                  {/* Quality */}
                  <div className={vendorStyles.progressRow}>
                    <p className={vendorStyles.progressLabel}>Quality</p>
                    <div className={vendorStyles.progressTrack}>
                      <div
                        className={vendorStyles.progressFill}
                        style={{ width: `${qualityVal}%` }}
                      />
                    </div>
                    <p className={vendorStyles.progressValue}>
                      {qualityVal}/100
                    </p>
                  </div>

                  {/* Price Competitiveness */}
                  <div className={vendorStyles.progressRow}>
                    <p className={vendorStyles.progressLabel}>
                      Price Competitiveness
                    </p>
                    <div className={vendorStyles.progressTrack}>
                      <div
                        className={`${vendorStyles.progressFill} ${vendorStyles.progressFillOrange}`}
                        style={{ width: `${priceVal}%` }}
                      />
                    </div>
                    <p className={vendorStyles.progressValue}>{priceVal}/100</p>
                  </div>
                </div>

                {/* View Score Breakdown toggle
                <div
                  className={vendorStyles.viewScoreMainCon}
                  onClick={(e) => handleToggle(item?.id, e)}
                >
                  <p className={vendorStyles.viewScoreLabel}>
                    View score breakdown
                  </p>
                  <i
                    className={`${vendorStyles.viewScoreIcon} pi ${
                      openVendor === item?.id ? "pi-angle-up" : "pi-angle-down"
                    }`}
                  />
                </div>*/}

                {/* {openVendor === item?.id && (
                  <div className={vendorStyles.viewScoreContentMainCon}>
                    <div className={vendorStyles.viewScoreItem}>
                      <p className={vendorStyles.viewScoreContentLabel}>
                        Price Competitiveness
                      </p>
                      <p className={vendorStyles.viewScoreContentValue}>
                        {item?.viewScoreBreakdown?.priceCompetitiveness || "—"}
                        /100
                      </p>
                    </div>
                    <div className={vendorStyles.viewScoreItem}>
                      <p className={vendorStyles.viewScoreContentLabel}>
                        Delivery Timeline
                      </p>
                      <p className={vendorStyles.viewScoreContentValue}>
                        {item?.viewScoreBreakdown?.deliveryTimeline || "—"}/100
                      </p>
                    </div>
                    <div className={vendorStyles.viewScoreItem}>
                      <p className={vendorStyles.viewScoreContentLabel}>
                        Historical Performance
                      </p>
                      <p className={vendorStyles.viewScoreContentValue}>
                        {item?.viewScoreBreakdown?.HistoricalPerformance || "—"}
                        /100
                      </p>
                    </div>
                    <div className={vendorStyles.viewScoreItem}>
                      <p className={vendorStyles.viewScoreContentLabel}>
                        Quality Certification
                      </p>
                      <p className={vendorStyles.viewScoreContentValue}>
                        {item?.viewScoreBreakdown?.qualityCertification || "—"}
                        /100
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            );
          })}
        </div>

        {/* ===== AI OVERVIEW (unchanged) ===== */}
        {/* <div className={vendorStyles.aiOverviewMainCon}>
          <div className={vendorStyles.aiOverviewLabelCon}>
            <p className={vendorStyles.labelStyle}>
              <i className={`${vendorStyles.iconStyle} pi pi-sparkles`} />
              AI Overview
            </p>
          </div>
          <div className={vendorStyles.aiContentCon}>
            {aiOverview?.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div> */}
        <div className={vendorStyles.aiOverviewMainCon}>
          <div className={vendorStyles.aiOverviewLabelCon}>
            <p className={vendorStyles.labelStyle}>
              <i className={`${vendorStyles.aiIconStyle} pi pi-sparkles`} />
              AI Overview
            </p>
          </div>
          <div className={vendorStyles.aiContentCon}>
            {aiOverview ? (
              aiOverview
                .split("\n")
                .map((line, index) => <p key={index}>{line}</p>)
            ) : (
              <p style={{ color: "#a0aab4", fontStyle: "italic" }}>
                AI analysis will appear here once generated.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default VendorComparison;
