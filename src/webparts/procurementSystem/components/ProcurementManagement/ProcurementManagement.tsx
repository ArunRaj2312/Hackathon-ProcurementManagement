import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import procurementSysStyles from "./ProcurementManagement.module.scss";
import BasicInformation from "./BasicInformation/BasicInformation";
import VendorComparison from "./VendorComparison/VendorComparison";
import Approval from "./Approval/Approval";
import PurchaseOrder from "./PurchaseOrder/PurchaseOrder";
import Invoice from "./Invoice/Invoice";
import SPServices from "../../../../CommonServices/SPServices";
import { sp } from "@pnp/sp/presets/all";
import { ProcurementFormData } from "../../../../config/interface";
import { newData } from "../../../../config/config";

const ProcurementSystem = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || 1;

  let loggedInUserEmail = props.context._pageContext._user.email;
  const stepperArr = [
    {
      id: 1,
      title: "Basic Information",
      icon: "pi pi-info-circle",
    },
    {
      id: 2,
      title: "Vendor Comparison",
      icon: "pi pi-inbox",
    },
    {
      id: 3,
      title: "Approval",
      icon: "pi pi-check-circle",
    },
    {
      id: 4,
      title: "Purchase Order",
      icon: "pi pi-shop",
    },
    {
      id: 5,
      title: "Invoice",
      icon: "pi pi-receipt",
    },
  ];

  const [userRole, setUserRole] = useState<string>("User");
  const [userDetails, setUserDetails] = useState<any>({
    text: "",
    secondaryText: "",
    id: "",
  });
  const [selectedStepperVersionId, setselectedStepperVersionId] =
    useState<number>(1);
  const [formData, setFormData] = useState<ProcurementFormData>(newData);
  const [vendorDialogVisible, setVendorDialogVisible] =
    useState<boolean>(false);
  const [vendorsList, setVendorsList] = useState<any[]>([]);

  const approveRejectComments = async (status: string) => {
    let Json: any = {
      Comments: formData.approval.comments,
      Status: status,
    };
    if (status === "Approved") {
      Json = { ...Json, ActiveTab: 4 };
    }
    await SPServices.SPUpdateItem({
      Listname: "ProcurementDetails",
      ID: formData.basicInformation.id,
      RequestJSON: {
        ...Json,
      },
    });
    setVendorDialogVisible(false);
    navigate("/");
  };

  const addSelectedVendor = async () => {
    const selected = vendorsList.filter((v) => v.isSelected);
    for (let i = 0; i < selected.length; i++) {
      const sel = selected[i];
      await SPServices.SPAddItem({
        Listname: "SelectedVendorDetails",
        RequestJSON: {
          PRIdId: formData.basicInformation.id,
          VendorId: sel.id,
        },
      });
      if (i === selected.length - 1) {
        await SPServices.SPUpdateItem({
          Listname: "ProcurementDetails",
          ID: formData.basicInformation.id,
          RequestJSON: {
            ActiveTab: 2,
          },
        });
        setVendorDialogVisible(false);
        navigate("/");
      }
    }
  };

  const addUserSelectedVendor = async () => {
    const selected = formData.vendorComparison.vendors?.filter(
      (v: any) => v.selected,
    );
    if (selected.length > 0) {
      const sel = selected[0];
      await SPServices.SPUpdateItem({
        Listname: "SelectedVendorDetails",
        ID: sel.id,
        RequestJSON: {
          Selected: true,
        },
      });
      await SPServices.SPUpdateItem({
        Listname: "ProcurementDetails",
        ID: formData.basicInformation.id,
        RequestJSON: {
          ActiveTab: 3,
        },
      });
      navigate("/");
    } else {
      navigate("/");
    }
    navigate("/");
    console.log("Selected vendors (name,id,isSlected):", selected);
  };

  const fetchVendors = async (prId: any) => {
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: "VendorDetails",
        Select: "Id,Title,PRItemId,PRItem/ID",
        Expand: "PRItem",
        Filter: [
          {
            FilterKey: "PRItemId",
            Operator: "eq",
            FilterValue: prId,
          },
        ],
      });

      const mapped = (res || []).map((item: any) => ({
        name: item.Title || "",
        id: item.Id || "",
        isSelected: false,
      }));

      setVendorsList(mapped);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setVendorsList([]);
    }
  };

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

      const tempVendor: any[] = res.map((item: any) => ({
        id: item.Id || "",
        unit: item.Price || "",
        days: item.Days || "",
        finalScore: item.FinalScore || "",
        ontimeDelivery: item.OnTimeDelivery || "",
        qualityScore: item.QualityScore || "",
        aiRecommeded: item.AIRecommended || false,
        selected: item.Selected || false,
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
      SelectedId: id,
      Select: "*,Requestor/Title,Item/Title,Item/PRId",
      Expand: "Requestor,Item",
    })
      .then(async (res: any) => {
        const selectedVendorData: any[] = await getSelectedVendorData(res.Id);

        setFormData({
          ActiveTab: res.ActiveTab || 1,
          basicInformation: {
            id: res.Id,
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
            requesterRequiredDate: res.Created || "",
          },
          vendorComparison: {
            vendors: [...selectedVendorData], // Assuming only one vendor is selected,
          },
          approval: {
            selectedVendor: [...selectedVendorData].find(
              (vendor) => vendor.selected,
            ) || {
              id: "",
              unit: "",
              days: "",
              finalScore: "",
              ontimeDelivery: "",
              qualityScore: "",
              aiRecommeded: false,
              selected: false,
              viewScoreBreakdown: {
                priceCompetitiveness: "",
                deliveryTimeline: "",
                HistoricalPerformance: "",
                qualityCertification: "",
              },
            },
            purchaseSummary: {
              prId: "PR-001",
              item: "Laptop – Dell Latitude 5440",
              quantity: "20 Units",
              totalAmount: "₹13,60,000",
            },
            comments: "",
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
        await fetchVendors(res.ItemId || "");
      })
      .catch((err) => {
        console.error("Error fetching data from SP List:", err);
      });
  };

  const getApproverConfig = async () => {
    await SPServices.SPReadItems({
      Listname: "ApproverConfig",
      Select: "*,Approver/Title",
      Expand: "Approver",
      Filter: [
        {
          FilterKey: "Approver/EMail",
          Operator: "eq",
          FilterValue: loggedInUserEmail,
        },
      ],
    })
      .then(async (res: any) => {
        if (res && res.length > 0) {
          setUserRole(res[0].Role);
        }
        await getProcurementData();
        console.log("Approver config data", res);
      })
      .catch((err) => {
        console.error("Error fetching approver config data", err);
      });
  };

  const getCurrentUserDetails = async () => {
    await sp.web
      .ensureUser(loggedInUserEmail.toLowerCase())
      .then(async (user: any) => {
        setUserDetails({
          text: user.data.Title,
          secondaryText: user.data.Email,
          id: user.data.Id,
        });
        await getApproverConfig();
      });
  };

  const toggleVendorSelection = (id: any) => {
    const updated = vendorsList.map((v) => {
      if (v.id === id) {
        const newSel = !v.isSelected;
        return { ...v, isSelected: newSel, isSlected: newSel };
      }
      return v;
    });
    setVendorsList(updated);
  };

  useEffect(() => {
    if (loggedInUserEmail) void getCurrentUserDetails();
  }, []);

  // Stepper subtitle labels
  const stepSubtitles: Record<number, string> = {
    1: "PR details & requester",
    2: "Evaluate suppliers",
    3: "Manager sign-off",
    4: "Generate PO",
    5: "Payment & close",
  };

  return (
    <div className={procurementSysStyles.mainBodyLayout}>
      {/* LEFT SIDEBAR */}
      <div className={procurementSysStyles.sidebar}>
        <div className={procurementSysStyles.sidebarTop}>
          <p className={procurementSysStyles.sidebarLabel}>Workflow Steps</p>
          <div className={procurementSysStyles.stepList}>
            {stepperArr.map((item) => {
              const isActive = item.id === selectedStepperVersionId;
              const isCompleted = item.id < selectedStepperVersionId;
              const cls = [
                procurementSysStyles.stepItem,
                isActive ? procurementSysStyles.activeStep : "",
                isCompleted ? procurementSysStyles.completedStep : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={item.id} className={cls}>
                  <div className={procurementSysStyles.stepBubble}>
                    {isCompleted ? (
                      <i className="pi pi-check" style={{ fontSize: 12 }} />
                    ) : (
                      item.id
                    )}
                  </div>
                  <div className={procurementSysStyles.stepTextBlock}>
                    <p className={procurementSysStyles.stepName}>
                      {item.title}
                    </p>
                    <span className={procurementSysStyles.stepSubtitle}>
                      {stepSubtitles[item.id]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom meta info */}
        <div className={procurementSysStyles.sidebarMeta}>
          <div className={procurementSysStyles.metaRow}>
            <span>PR ID</span>
            <span>{formData.basicInformation.prId || "—"}</span>
          </div>
          <div className={procurementSysStyles.metaRow}>
            <span>Created</span>
            <span>
              {formData.basicInformation.requesterRequiredDate
                ? new Date(
                    formData.basicInformation.requesterRequiredDate,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
          <div className={procurementSysStyles.metaRow}>
            <span>Step</span>
            <span>{selectedStepperVersionId} of 5</span>
          </div>
          <div className={procurementSysStyles.metaRow}>
            <span>Status</span>
            <span className={procurementSysStyles.metaStatus}>Draft</span>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT PANEL */}
      <div className={procurementSysStyles.contentPanel}>
        {/* Page top bar */}
        <div className={procurementSysStyles.pageTopBar}>
          <div className={procurementSysStyles.pageTitleBlock}>
            <h2>
              {stepperArr.find((e) => e.id === selectedStepperVersionId)?.title}
            </h2>
            <p>
              {selectedStepperVersionId === 1
                ? "Fill in the requisition details to proceed to vendor comparison"
                : selectedStepperVersionId === 2
                  ? "Evaluate and select a vendor for this purchase request"
                  : selectedStepperVersionId === 3
                    ? "Awaiting manager approval for the selected vendor"
                    : selectedStepperVersionId === 4
                      ? "Generate and review the purchase order"
                      : "Review and close the invoice for this order"}
            </p>
          </div>
          <div className={procurementSysStyles.pageBadges}>
            <span className={procurementSysStyles.badgeDraft}>DRAFT</span>
            <span className={procurementSysStyles.badgePrId}>
              {formData.basicInformation.prId || "PR — 001"}
            </span>
          </div>
        </div>

        {/* Scrollable step content */}
        <div className={procurementSysStyles.stepContent}>
          {selectedStepperVersionId === 1 && (
            <BasicInformation data={formData.basicInformation} />
          )}
          {selectedStepperVersionId === 2 && (
            <VendorComparison
              data={formData.vendorComparison}
              activeTab={formData.ActiveTab}
              onDataChange={setFormData}
            />
          )}
          {selectedStepperVersionId === 3 && (
            <Approval
              data={formData.approval}
              userRole={userRole}
              userDetails={userDetails}
              onDataChange={setFormData}
            />
          )}
          {selectedStepperVersionId === 4 && (
            <PurchaseOrder data={formData.purchaseOrder} />
          )}
          {selectedStepperVersionId === 5 && (
            <Invoice data={formData.invoice} />
          )}
        </div>

        {/* FOOTER */}
        <div className={procurementSysStyles.footer}>
          <span className={procurementSysStyles.footerStepLabel}>
            Step <strong>{selectedStepperVersionId}</strong> of{" "}
            <strong>5</strong> ·{" "}
            {stepperArr.find((e) => e.id === selectedStepperVersionId)?.title}
          </span>
          <div className={procurementSysStyles.footerActions}>
            {selectedStepperVersionId > 1 && (
              <Button
                label="Previous"
                icon="pi pi-arrow-left"
                className="p-button-secondary"
                style={{
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                }}
                onClick={() => setselectedStepperVersionId((prev) => prev - 1)}
              />
            )}
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-secondary"
              style={{
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
              }}
              onClick={() => {
                navigate("/");
                setselectedStepperVersionId(1);
              }}
            />
            {formData.ActiveTab === 1 && selectedStepperVersionId === 1 ? (
              <Button
                label="Proceed to RFQ →"
                className="p-button-success"
                style={{
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                }}
                onClick={async () => setVendorDialogVisible(true)}
              />
            ) : formData.ActiveTab === 2 && selectedStepperVersionId === 2 ? (
              <Button
                label="Submit"
                icon="pi pi-check"
                className="p-button-success"
                style={{
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                }}
                onClick={async () => {
                  if (
                    formData.vendorComparison.vendors?.filter(
                      (v: any) => v.selected,
                    ).length > 0
                  ) {
                    await addUserSelectedVendor();
                  }
                }}
              />
            ) : formData.ActiveTab === 3 &&
              selectedStepperVersionId === 3 &&
              userRole !== "User" ? (
              <>
                <Button
                  label="Approve"
                  icon="pi pi-check"
                  className="p-button-success"
                  style={{
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 13,
                  }}
                  onClick={async () => {
                    if (formData.approval.comments.trim()) {
                      await approveRejectComments("Approved");
                    }
                  }}
                />
                <Button
                  label="Reject"
                  icon="pi pi-times"
                  style={{
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 13,
                  }}
                  className="p-button-danger"
                  onClick={async () => {
                    if (formData.approval.comments.trim()) {
                      await approveRejectComments("Rejected");
                    }
                  }}
                />
              </>
            ) : Number(formData.ActiveTab) >
              Number(selectedStepperVersionId) ? (
              <Button
                label="Next →"
                className="p-button-success"
                style={{
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                }}
                onClick={() => setselectedStepperVersionId((prev) => prev + 1)}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Vendor selection dialog */}
      <Dialog
        header="Select Vendor"
        visible={vendorDialogVisible}
        style={{ width: "640px" }}
        modal
        onHide={() => setVendorDialogVisible(false)}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {vendorsList && vendorsList.length ? (
            vendorsList.map((v) => (
              <div
                key={v.id}
                style={{
                  width: "30%",
                  minWidth: 150,
                  border: "1px solid #f0f0f0",
                  padding: 10,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Checkbox
                  checked={v.isSelected}
                  onChange={() => toggleVendorSelection(v.id)}
                />
                <div>{v.name}</div>
              </div>
            ))
          ) : (
            <div>No vendors found.</div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 12,
          }}
        >
          <Button
            label="Close"
            className="p-button-secondary"
            style={{
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
            }}
            onClick={() => setVendorDialogVisible(false)}
          />
          <Button
            label="Send RFQ"
            icon="pi pi-send"
            className="p-button-success"
            style={{
              borderRadius: 10,
              padding: "8px 16px",
              fontSize: 13,
            }}
            onClick={async () => {
              if (vendorsList.filter((v) => v.isSelected).length > 0) {
                await addSelectedVendor();
              }
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ProcurementSystem;
