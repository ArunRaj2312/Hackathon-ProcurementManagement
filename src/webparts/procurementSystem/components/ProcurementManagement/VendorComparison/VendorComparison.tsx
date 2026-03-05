import * as React from "react";
import { useState } from "react";
import vendorStyles from "../VendorComparison/VendorComparison.module.scss";
const VendorComparison = (props: { data?: any }) => {
  const tempVendor = props.data?.vendors || [
    {
      id: 1,
      unit: "110",
      days: "12",
      finalScore: "90",
      ontimeDelivery: "92",
      qualityScore: "88",
      viewScoreBreakdown: {
        priceCompetitiveness: "85",
        deliveryTimeline: "90",
        HistoricalPerformance: "92",
        qualityCertification: "95",
      },
    },
    {
      id: 2,
      unit: "115",
      days: "15",
      finalScore: "95",
      ontimeDelivery: "82",
      qualityScore: "78",
      viewScoreBreakdown: {
        priceCompetitiveness: "81",
        deliveryTimeline: "70",
        HistoricalPerformance: "82",
        qualityCertification: "95",
      },
    },
    {
      id: 3,
      unit: "105",
      days: "18",
      finalScore: "75",
      ontimeDelivery: "92",
      qualityScore: "78",
      viewScoreBreakdown: {
        priceCompetitiveness: "95",
        deliveryTimeline: "92",
        HistoricalPerformance: "92",
        qualityCertification: "86",
      },
    },
  ];
  const [openVendor, setOpenVendor] = useState<number | null>(null);
  const handleToggle = (id: number) => {
    setOpenVendor((prev) => (prev === id ? null : id));
  };

  // useEffect(() => {
  //   if (props.onDataChange) {
  //     props.onDataChange({ vendors: tempVendor });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <>
      <div className={vendorStyles.vendorLayoutCon}>
        <div>
          <p className={vendorStyles.title}>Smart Vendor Evaluation</p>
          <p className={vendorStyles.subtitle}>
            PR-001 - AI-powered vendor comparison and recommendation
          </p>
        </div>
        <div className={vendorStyles.cardLayoutCon}>
          {tempVendor?.map((item: any, index: number) => (
            <div className={vendorStyles.cardMainCon} key={item?.id}>
              <div className={vendorStyles.vendorNameMainCon}>
                <div className={vendorStyles.vendorNameCon}>
                  <p className={vendorStyles.vendorNameStyle}>
                    Vendor {item?.id}
                  </p>
                  <div className={vendorStyles.unitDaysMainCon}>
                    <div className={vendorStyles.unitMainCon}>
                      <i
                        className={`${vendorStyles.iconStyle} pi pi-dollar`}
                      ></i>
                      <p className={vendorStyles.unitStyle}>
                        {item?.unit}/unit
                      </p>
                    </div>
                    <div className={vendorStyles.daysMainCon}>
                      <i
                        className={`${vendorStyles.iconStyle} pi pi-clock`}
                      ></i>
                      <p className={vendorStyles.daysStyle}>
                        {item?.days} days
                      </p>
                    </div>
                  </div>
                </div>
                <div className={vendorStyles.unitDaysFScoreMainCon}>
                  <div className={vendorStyles.finalScoreMainCon}>
                    <p className={vendorStyles.finalScoreLabel}>Final Score</p>
                    <p className={vendorStyles.finalScoreValue}>
                      {item?.finalScore}
                    </p>
                  </div>
                </div>
              </div>
              {/* on time delivery */}
              <div className={vendorStyles.labelValueMainCon}>
                <div className={vendorStyles.labelValueCon}>
                  <p className={vendorStyles.labelStyle}>On-Time delivery</p>
                  <p className={vendorStyles.valueStyle}>
                    {item?.ontimeDelivery}%
                  </p>
                </div>
                <div className={vendorStyles.labelValueCon}>
                  <p className={vendorStyles.labelStyle}>Quality Score</p>
                  <p className={vendorStyles.valueStyle}>
                    {item?.qualityScore}/100
                  </p>
                </div>
              </div>
              {/* view score breakdown */}
              <div
                className={vendorStyles.viewScoreMainCon}
                onClick={() => handleToggle(item?.id)}
                style={{ cursor: "pointer" }}
              >
                <p className={vendorStyles.viewScoreLabel}>
                  View score breakdown
                </p>
                <i
                  className={`${vendorStyles.viewScoreIcon} pi ${
                    openVendor === item?.id ? "pi-angle-up" : "pi-angle-down"
                  }`}
                ></i>
              </div>
              {/* view score breakdown content */}
              {openVendor === item?.id && (
                <div className={vendorStyles.viewScoreContentMainCon}>
                  <div className={vendorStyles.viewScoreItem}>
                    <p className={vendorStyles.viewScoreContentLabel}>
                      Price Competitiveness
                    </p>
                    <p className={vendorStyles.viewScoreContentValue}>
                      {item?.viewScoreBreakdown?.priceCompetitiveness}/100
                    </p>
                  </div>
                  <div className={vendorStyles.viewScoreItem}>
                    <p className={vendorStyles.viewScoreContentLabel}>
                      Delivery timeline
                    </p>
                    <p className={vendorStyles.viewScoreContentValue}>
                      {item?.viewScoreBreakdown?.deliveryTimeline}/100
                    </p>
                  </div>
                  <div className={vendorStyles.viewScoreItem}>
                    <p className={vendorStyles.viewScoreContentLabel}>
                      Historical performance
                    </p>
                    <p className={vendorStyles.viewScoreContentValue}>
                      {item?.viewScoreBreakdown?.HistoricalPerformance}/100
                    </p>
                  </div>
                  <div className={vendorStyles.viewScoreItem}>
                    <p className={vendorStyles.viewScoreContentLabel}>
                      Quality Certification
                    </p>
                    <p className={vendorStyles.viewScoreContentValue}>
                      {item?.viewScoreBreakdown?.qualityCertification}/100
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* AI overview */}
        <div className={vendorStyles.aiOverviewMainCon}>
          <div className={vendorStyles.aiOverviewLabelCon}>
            <p className={vendorStyles.labelStyle}>
              <i className={`${vendorStyles.iconStyle} pi pi-sparkles`}></i>
              AI Overview
            </p>
          </div>
          <div className={vendorStyles.aiContentCon}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default VendorComparison;
