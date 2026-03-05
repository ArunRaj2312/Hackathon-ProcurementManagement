import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import procurementSysStyles from "./ProcurementManagement.module.scss";
import BasicInformation from "./BasicInformation/BasicInformation";
import VendorComparison from "./VendorComparison/VendorComparison";
import Approval from "./Approval/Approval";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import Invoice from "./Invoice/Invoice";
import SPServices from "../../../../CommonServices/SPServices";

const ProcurementSystem = () => {
  const navigate = useNavigate();

  const [selectedStepperVersionId, setselectedStepperVersionId] =
    useState<number>(5);
  const [formData, setFormData] = useState<any>({
    basicInformation: {
      prId: "PR-001",
      item: "Laptop - Dell Latitude 5440",
      quantity: "20 Units",
      estimatedUnitPrice: "68,000",
      totalEstimated: "13,60,000",
      requiredDate: "25/03/2026",
      justification: "New Employee onboarding requirement",
      requestedBy: "Swetha",
      employeeId: "E-0052",
      designation: "Admin",
      location: "O365",
      requesterRequiredDate: "27/02/2026",
    },
    vendorComparison: {
      vendors: [
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
      ],
    },
    approval: {
      selectedVendor: {
        name: "Vendor 1",
        price: "110",
        days: "12",
        finalScore: "90",
      },
      purchaseSummary: {
        prId: "PR-001",
        item: "Laptop – Dell Latitude 5440",
        quantity: "20 Units",
        totalAmount: "₹13,60,000",
      },
    },
    purchaseOrder: {
      poNumber: "PO-2026-001",
      issueDate: "22/02/2026",
      vendor: { name: "Vendor 1", code: "VEN-2025-0142" },
      deliveryDate: "06/03/2026",
      paymentTerms: "Net 30 days",
      lineItems: [
        {
          description: "Laptop-Dell Latitude 5440",
          quantity: "20 units",
          unitPrice: "68,000",
          amount: "13,60,000",
        },
      ],
    },
    invoice: {
      invoiceNumber: "INV-V-2026-142",
      invoiceDate: "06/03/2026",
      vendor: "Vendor 1",
      vendorCode: "VEN-2025-0142",
      gstNumber: "06AABC1234F1Z5",
      amount: "₹1,29,800",
      dueDate: "05/04/2026",
    },
  });

  const getSelectedVendorData = async (prId: string) => {
    try {
      const res = await SPServices.SPReadItems({
        Listname: "SelectedVendorDetails",
        Filter: [
          {
            FilterKey: "PRId",
            Operator: "eq",
            FilterValue: prId,
          },
        ],
      });

      console.log("Data from SP List:", res);

      const tempVendor: any[] = res.map((item: any) => ({
        id: item.Id || "",
        unit: item.Price || "",
        days: item.Days || "",
        finalScore: item.FinalScore || "",
        ontimeDelivery: item.OnTimeDelivery || "",
        qualityScore: item.QualityScore || "",
        viewScoreBreakdown: {
          priceCompetitiveness: "",
          deliveryTimeline: "",
          HistoricalPerformance: "",
          qualityCertification: "",
        },
      }));

      return tempVendor || [];
    } catch (err) {
      console.error("Error fetching data from SP List:", err);
      return [];
    }
  };
  console.log("formda", formData);

  const getProcurementData = async () => {
    await SPServices.SPReadItemUsingId({
      Listname: "ProcurementDetails",
      SelectedId: 1,
      Select: "*,Requestor/Title,Item/Title",
      Expand: "Requestor,Item",
    })
      .then(async (res: any) => {
        const selectedVendorData: any[] = await getSelectedVendorData(res.Id);
        console.log("Data from SP List:", res);
        // Map the response to formData structure if needed
        setFormData({
          basicInformation: {
            prId: res.Item?.PRId || "",
            item: res.Item?.Title || "",
            quantity: res.Quantity || "",
            estimatedUnitPrice: res.Price || "",
            totalEstimated: res.Total || "",
            requiredDate: res.Date || "",
            justification: res.Justification || "",
            requestedBy: "Swetha",
            employeeId: "E-0052",
            designation: "Admin",
            location: "O365",
            requesterRequiredDate: "27/02/2026",
          },
          vendorComparison: {
            vendors: [...selectedVendorData],
          },
          approval: {
            selectedVendor: {
              name: "Vendor 1",
              price: "110",
              days: "12",
              finalScore: "90",
            },
            purchaseSummary: {
              prId: "PR-001",
              item: "Laptop – Dell Latitude 5440",
              quantity: "20 Units",
              totalAmount: "₹13,60,000",
            },
          },
          purchaseOrder: {
            poNumber: "PO-2026-001",
            issueDate: "22/02/2026",
            vendor: { name: "Vendor 1", code: "VEN-2025-0142" },
            deliveryDate: "06/03/2026",
            paymentTerms: "Net 30 days",
            lineItems: [
              {
                description: "Laptop-Dell Latitude 5440",
                quantity: "20 units",
                unitPrice: "68,000",
                amount: "13,60,000",
              },
            ],
          },
          invoice: {
            invoiceNumber: "INV-V-2026-142",
            invoiceDate: "06/03/2026",
            vendor: "Vendor 1",
            vendorCode: "VEN-2025-0142",
            gstNumber: "06AABC1234F1Z5",
            amount: "₹1,29,800",
            dueDate: "05/04/2026",
          },
        });
      })
      .catch((err) => {
        console.error("Error fetching data from SP List:", err);
      });
  };
  useEffect(() => {
    void getProcurementData();

    // debug: show collected formData whenever it changes
    console.log("Collected formData:", formData);
  }, []);
  const stepperArr = [
    {
      id: 1,
      title: "Basic Information",
      icon: "pi pi-info-circle",
    },
    {
      id: 2,
      title: "Vendor Comparison",
      icon: "pi pi-info-circle",
    },
    {
      id: 3,
      title: "Approval",
      icon: "pi pi-info-circle",
    },
    {
      id: 4,
      title: "Purchase Order",
      icon: "pi pi-info-circle",
    },
    {
      id: 5,
      title: "Invoice",
      icon: "pi pi-info-circle",
    },
  ];
  console.log(setselectedStepperVersionId);

  // Stepper func
  const customStepperFunction = () => {
    return (
      <>
        <div className={procurementSysStyles.customStepperNav}>
          {stepperArr.map((item, index) => (
            <div
              className={procurementSysStyles.customStepperItem}
              onClick={() => {
                setselectedStepperVersionId(item.id);
              }}
            >
              <div className={procurementSysStyles.stepperTitleContainer}>
                <i
                  className={`${item?.icon} ${
                    item?.id <= selectedStepperVersionId
                      ? procurementSysStyles.activeStepperIcon
                      : procurementSysStyles.stepperIcon
                  }`}
                ></i>
                <p
                  className={
                    item.id <= selectedStepperVersionId
                      ? `${procurementSysStyles.stepperTitle} ${procurementSysStyles.activeStepperTitle}`
                      : procurementSysStyles.stepperTitle
                  }
                >
                  {item.title}
                </p>
              </div>
              {index !== stepperArr.length - 1 && (
                <span
                  className={
                    item.id <= selectedStepperVersionId
                      ? `${procurementSysStyles.stepperSeperator} ${procurementSysStyles.activeStepperSeperator}`
                      : procurementSysStyles.stepperSeperator
                  }
                ></span>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={procurementSysStyles.mainBodyLayout}>
      {customStepperFunction()}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Basic Information" ? (
        <BasicInformation data={formData.basicInformation} />
      ) : (
        ""
      )}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Vendor Comparison" ? (
        <VendorComparison data={formData.vendorComparison} />
      ) : (
        ""
      )}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Approval" ? (
        <Approval data={formData.approval} />
      ) : (
        ""
      )}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Purchase Order" ? (
        <PurchaseOrder data={formData.purchaseOrder} />
      ) : (
        ""
      )}
      {stepperArr?.find((e) => e?.id === selectedStepperVersionId)?.title ===
      "Invoice" ? (
        <Invoice data={formData.invoice} />
      ) : (
        ""
      )}
      {/* Footer with Cancel and Submit buttons */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "12px 20px",
          background: "#ffffff",
          borderTop: "1px solid #e6e6e6",
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          zIndex: 1000,
        }}
      >
        <Button
          label="Cancel"
          className="p-button-secondary"
          onClick={() => {
            // navigate back to dashboard or reset stepper
            navigate("/");
            setselectedStepperVersionId(1);
          }}
        />
        <Button
          label="Submit"
          icon="pi pi-check"
          className="p-button-success"
          onClick={async () => {
            try {
              if (!formData || Object.keys(formData).length === 0) {
                console.warn("No data available to submit.");
                return;
              }

              const { sp } = await import("@pnp/sp/presets/all");

              // TODO: replace 'ProcurementList' with your list name and map fields correctly
              const list = sp.web.lists.getByTitle("ProcurementList");

              const payload: any = {
                Title: formData.prId || formData.item || "New PR",
                Item: formData.item,
                Quantity: formData.quantity,
                EstimatedUnitPrice: formData.estimatedUnitPrice,
                TotalEstimated: formData.totalEstimated,
                RequestedBy: formData.requestedBy || formData.requestedBy,
              };

              const created = await list.items.add(payload);
              console.log("Created item:", created);
            } catch (err) {
              console.error("Error saving to SharePoint list:", err);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProcurementSystem;
