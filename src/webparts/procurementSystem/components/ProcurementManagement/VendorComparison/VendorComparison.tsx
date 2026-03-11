import * as React from "react";
import { useState } from "react";
import vendorStyles from "../VendorComparison/VendorComparison.module.scss";
// import { getVendorComparisonAI } from "../../../../../services/aiService";
const VendorComparison = (props: {
  data?: any;
  activeTab: Number;
  onDataChange?: (data: any) => void;
}) => {
  const [openVendor, setOpenVendor] = useState<number | null>(null);
  const [aiOverview, setAiOverview] = useState<string>(
    "Analyzing vendors with AI...",
  );
  const handleToggle = (id: number) => {
    setOpenVendor((prev) => (prev === id ? null : id));
  };

  React.useEffect(() => {
    setAiOverview("");
  }, []);
  // useEffect(() => {
  //   if (props.onDataChange) {
  //     props.onDataChange({ vendors: tempVendor });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   const loadAI = async () => {
  //     const result = await getVendorComparisonAI(tempVendor);

  //     setAiOverview(result);
  //   };

  // loadAI();
  // }, []);
  console.log("props.data", props.data);

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
          {props.data?.vendors?.map((item: any, index: number) => (
            <div
              className={
                item.selected
                  ? `${vendorStyles.activeCard} ${vendorStyles.cardMainCon}`
                  : vendorStyles.cardMainCon
              }
              key={item?.id}
              onClick={() => {
                if (props.activeTab === 2) {
                  let selectedVendorData = [...props.data?.vendors];
                  selectedVendorData = selectedVendorData.map((vendor) => {
                    if (vendor.id === item.id) {
                      return { ...vendor, selected: true };
                    } else {
                      return { ...vendor, selected: false };
                    }
                  });
                  props.onDataChange &&
                    props.onDataChange((prev: any) => ({
                      ...prev,
                      vendorComparison: {
                        vendors: selectedVendorData,
                      },
                    }));
                }
              }}
            >
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
          {/* <div className={vendorStyles.aiContentCon}>
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
          </div> */}
          <div className={vendorStyles.aiContentCon}>
            {aiOverview?.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default VendorComparison;
