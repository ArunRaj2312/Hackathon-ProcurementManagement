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
import MainLoader from "../Loader/MainLoader";

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

  const [isLoader, setIsLoader] = useState<boolean>(false);
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

  const sendPO = async () => {
    try {
      setIsLoader(true);
      await SPServices.SPUpdateItem({
        Listname: "ProcurementDetails",
        ID: formData.basicInformation.id,
        RequestJSON: { ActiveTab: 5, SendPo: true },
      });
      setIsLoader(false);
      navigate("/");
    } catch (error) {
      console.error("Error in sendPO:", error);
      setIsLoader(false);
    }
  };

  const approveRejectComments = async (status: string) => {
    try {
      setIsLoader(true);
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
      setIsLoader(false);
      navigate("/");
    } catch (error) {
      console.error("Error in approveRejectComments:", error);
      setIsLoader(false);
    }
  };

  const addSelectedVendor = async () => {
    try {
      const selected = vendorsList.filter((v) => v.isSelected);
      if (selected.length > 0) {
        for (let i = 0; i < selected.length; i++) {
          setIsLoader(true);
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
            setIsLoader(false);
            setVendorDialogVisible(false);
            navigate("/");
          }
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error in addSelectedVendor:", error);
      setIsLoader(false);
    }
  };

  const addUserSelectedVendor = async () => {
    try {
      const selected = formData.vendorComparison.vendors?.filter(
        (v: any) => v.selected,
      );
      if (selected.length > 0) {
        setIsLoader(true);
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
        setIsLoader(false);
        navigate("/");
      } else {
        navigate("/");
      }
      navigate("/");
    } catch (error) {
      console.error("Error in addUserSelectedVendor:", error);
      setIsLoader(false);
    }
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
      setIsLoader(false);
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
        vendorId: item.VendorId || "",
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

  const getUserDetails = async () => {
    try {
      const res: any[] = await SPServices.SPReadItems({
        Listname: "UserDetails",
        Select: "*,User/Title,User/EMail",
        Expand: "User",
        Filter: [
          {
            FilterKey: "User/EMail",
            Operator: "eq",
            FilterValue: loggedInUserEmail,
          },
        ],
      });

      const mapped = (res || []).map((item: any) => ({
        name: item?.User?.Title || "",
        mail: item?.User?.EMail || "",
        empId: item.EmployeeId || "",
        designation: item.Designation || "",
        location: item.Location || "",
      }));
      return mapped.length > 0 ? mapped[0] : [];
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };
  console.log("formda", formData);

  // const getDocuments = async (params: { Listname: string; ID: number }) => {
  //   const item: any = await sp.web.lists
  //     .getByTitle(params.Listname)
  //     .items.getById(params.ID);

  //   const attach: any = await item.attachmentFiles();

  //   let MasBills: any[] = [];

  //   attach.forEach((item: any) => {
  //     MasBills.push({
  //       name: item.FileName,
  //       content: item.ServerRelativeUrl,
  //       type: "Inlist",
  //       size: null,
  //     });
  //   });

  //   return MasBills;
  // };

  const getProcurementData = async () => {
    try {
      const res: any = await SPServices.SPReadItemUsingId({
        Listname: "ProcurementDetails",
        SelectedId: id,
        Select: "*,Requestor/Title,Item/Title,Item/PRId",
        Expand: "Requestor,Item",
      });
      const selectedVendorData: any[] = await getSelectedVendorData(res.Id);
      const userDetails: any = await getUserDetails();

      // Fetch VendorDetails to get actual vendor names and properties
      let vendorDetailsList: any[] = [];
      try {
        vendorDetailsList = await SPServices.SPReadItems({
          Listname: "VendorDetails",
          Select: "*",
          Filter: [
            {
              FilterKey: "PRItemId",
              Operator: "eq",
              FilterValue: res.ItemId,
            },
          ],
          FilterCondition: "and",
        });
      } catch (err) {
        console.error("Error fetching vendor details:", err);
      }

      const approvedSelectedVendor = [...selectedVendorData].find(
        (v) => v.selected,
      );
      let selectedVendorInfo: any = {};
      if (approvedSelectedVendor) {
        // Find the corresponding VendorDetail using VendorId
        const matchingVendorDetail = vendorDetailsList.find(
          (vd) =>
            vd.Id === approvedSelectedVendor.id ||
            String(vd.Id) === String(approvedSelectedVendor.vendorId),
        ); // Often SelectedVendorDetails.VendorId points to VendorDetails
        selectedVendorInfo = matchingVendorDetail || {};
      }

      // Calculations for PO
      const amountNum = parseFloat(res.Total) || 0;
      const cgstNum = amountNum * 0.09;
      const sgstNum = amountNum * 0.09;
      const totalAmountNum = amountNum + cgstNum + sgstNum;

      const formatCurrency = (val: number) =>
        `₹ ${val.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

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
          requestedBy: userDetails.name || "",
          employeeId: userDetails.empId || "",
          designation: userDetails.designation || "",
          location: userDetails.location || "",
          requesterRequiredDate: res.Created || "",
        },
        vendorComparison: {
          vendors: [...selectedVendorData], // Assuming only one vendor is selected,
        },
        approval: {
          selectedVendor: approvedSelectedVendor || {
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
            prId: res.Item?.PRId || "PR-001",
            item: res.Item?.Title || "",
            quantity: res.Quantity ? `${res.Quantity} Units` : "",
            unitPrice: res.Price,
            requiredDate: res.Date || "",
            submissionDate: res.Created || "",
            totalAmount: formatCurrency(amountNum),
          },
          comments: res.Comments || "",
        },
        purchaseOrder: {
          poNumber: `PO-${new Date().getFullYear()}-${res.Id ? ("000" + String(res.Id)).slice(-3) : "001"}`,
          prId: res.Item?.PRId || "N/A",
          issueDate: new Date().toLocaleDateString("en-GB"),
          vendor: {
            name: selectedVendorInfo?.Title || "Selected Vendor",
            code: selectedVendorInfo?.VendorCode || "",
            gstNumber: selectedVendorInfo?.GSTNumber || "",
            address: selectedVendorInfo?.Address || "",
            contactPerson: selectedVendorInfo?.ContactPerson || "",
          },
          deliveryDate: res.Date
            ? new Date(res.Date).toLocaleDateString("en-GB")
            : "",
          paymentTerms: selectedVendorInfo?.PaymentTerms || "",
          lineItems: [
            {
              description: res.Item?.Title || "",
              quantity: res.Quantity ? `${res.Quantity} units` : "",
              unitPrice: res.Price ? formatCurrency(parseFloat(res.Price)) : "",
              amount: res.Total ? formatCurrency(amountNum) : "",
            },
          ],
          subTotal: formatCurrency(amountNum),
          cgst: formatCurrency(cgstNum),
          sgst: formatCurrency(sgstNum),
          totalAmount: formatCurrency(totalAmountNum),
        },
        invoice: {
          invoiceNumber: `INV-V-${new Date().getFullYear()}-${res.Id}`,
          invoiceDate: new Date().toLocaleDateString("en-GB"),
          vendor: selectedVendorInfo?.Title || "",
          vendorCode: selectedVendorInfo?.VendorCode || "",
          gstNumber: selectedVendorInfo?.GSTNumber || "",
          amount: formatCurrency(totalAmountNum),
          dueDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toLocaleDateString("en-GB"),
        },
      });
      await fetchVendors(res.ItemId || "");
    } catch (err) {
      console.error("Error fetching data from SP List:", err);
    }
  };

  const getApproverConfig = async () => {
    try {
      const res: any = await SPServices.SPReadItems({
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
      });
      if (res && res.length > 0) {
        setUserRole(res[0].Role);
      }
      await getProcurementData();
      console.log("Approver config data", res);
    } catch (err) {
      console.error("Error fetching approver config data", err);
    }
  };

  const getCurrentUserDetails = async () => {
    try {
      setIsLoader(true);
      const user: any = await sp.web.ensureUser(
        loggedInUserEmail.toLowerCase(),
      );
      setUserDetails({
        text: user.data.Title,
        secondaryText: user.data.Email,
        id: user.data.Id,
      });
      await getApproverConfig();
    } catch (error) {
      console.error("Error in getCurrentUserDetails:", error);
      setIsLoader(false);
    }
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

  return isLoader ? (
    <MainLoader />
  ) : (
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
              label="✖ Cancel"
              // icon="pi pi-times"
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
                label="Submit →"
                // icon="pi pi-check"
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
                  label="✔ Approve"
                  // icon="pi pi-check"
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
                  label="✖ Reject"
                  // icon="pi pi-times"
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
            ) : formData.ActiveTab === 4 && selectedStepperVersionId === 4 ? (
              <Button
                label="Send PO →"
                // icon="pi pi-check"
                className="p-button-success"
                style={{
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontSize: 13,
                }}
                onClick={async () => {
                  await sendPO();
                }}
              />
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
