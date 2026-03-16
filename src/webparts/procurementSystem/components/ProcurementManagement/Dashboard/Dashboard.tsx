import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useState, useEffect, useRef } from "react";
import styles from "./Dashaboard.module.scss";
import SPServices from "../../../../../CommonServices/SPServices";
import { Calendar } from "primereact/calendar";
import MainLoader from "../../Loader/MainLoader";
import * as moment from "moment";
import { useNavigate } from "react-router-dom";
import { getBasicInfoAI } from "../../../../../services/aiService";

const Dashboard = (props: any) => {
  const navigate = useNavigate();
  const toast = useRef<Toast | null>(null);
  let loggedInUserEmail = props.context._pageContext._user.email;

  const newObj = {
    id: null,
    prId: "",
    item: "",
    quantity: "",
    price: "",
    total: "",
    date: "",
    justification: "",
  };

  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({ ...newObj });
  const [productOptions, setProductOptions] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [userRole, setUserRole] = useState<string>("User");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const onChangeHandler = (key: string, value: string) => {
    let tempRow = { ...selectedRow };
    tempRow = { ...tempRow, [key]: value };
    if (
      (key === "quantity" || key === "price") &&
      tempRow.quantity &&
      tempRow.price
    ) {
      tempRow.total = Number(tempRow.quantity) * Number(tempRow.price);
    }
    setSelectedRow({ ...tempRow });
  };

  const getProcurementData = async () => {
    await SPServices.SPReadItems({
      Listname: "ProcurementDetails",
      Select: "*,Requestor/Title,Item/Title,Item/PRId",
      Expand: "Requestor,Item",
    })
      .then(async (res: any) => {
        const mappedData = res.map((item: any) => ({
          id: item.ID,
          prId: item.Item?.PRId || "",
          item: item.Item ? item.Item.Title : "",
          quantity: item.Quantity,
          price: item.Price,
          total: item.Total,
          date: item.Date,
          justification: item.Justification,
          status: item.Status || "Active",
        }));
        setData(mappedData);
        setIsLoader(false);
      })
      .catch((err) => {
        console.error("Error fetching data from SP List:", err);
      });
  };

  const loadProducts = async () => {
    try {
      const items: any[] = await SPServices.SPReadItems({
        Listname: "ProductDetails",
        Select: "ID,Title,PRId",
      });
      const opts = items.map((it) => ({
        label: it.PRId,
        name: it.Title,
        value: it.ID,
      }));
      setProductOptions(opts);
      await getProcurementData();
    } catch (err) {
      console.error("Failed to load product options", err);
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
      await loadProducts();
    } catch (err) {
      console.error("Error fetching approver config data", err);
    }
  };
  const UpdateAiResponse = async (Id: number): Promise<string> => {
    try {
      let AiResponse = ""; // Get this from AI response

      const selectedVendorData = await SPServices.SPReadItems({
        Listname: "SelectedVendorDetails",
        FilterCondition: "and",
        Filter: [
          {
            FilterKey: "ProductId",
            Operator: "eq",
            FilterValue: Id,
          },
          {
            FilterKey: "Selected",
            Operator: "ne",
            FilterValue: true,
          },
        ],
        Select: "*,Vendor/Id,Vendor/Title",
        Expand: "Vendor",
      });

      if (selectedVendorData.length) {
        const selectedVendor = await selectedVendorData?.map((item) => ({
          Id: item.Id,
          PRIdId: item.PRIdId,
          Price: item.Price,
          QualityScore: item.QualityScore,
          OnTimeDelivery: item.OnTimeDelivery,
          VendorId: item.VendorIdId,
          VendorTitle: item.Vendor?.Title,
        }));

        if (selectedVendor.length) {
          const response = await getBasicInfoAI(selectedVendor);

          AiResponse = response;
        }
      }

      return AiResponse;
    } catch (error) {
      console.error("Error in UpdateAiResponse:", error);
      return "AI response unavailable.";
    }
  };

  const onSubmit = async () => {
    let errorMsg = "";
    if (!selectedRow.item) errorMsg = "Item is required.";
    else if (!selectedRow.quantity) errorMsg = "Quantity is required.";
    else if (
      isNaN(Number(selectedRow.quantity)) ||
      Number(selectedRow.quantity) <= 0
    )
      errorMsg = "Quantity must be a positive number.";
    else if (!selectedRow.price) errorMsg = "Estimated unit price is required.";
    else if (isNaN(Number(selectedRow.price)) || Number(selectedRow.price) <= 0)
      errorMsg = "Estimated unit price must be a positive number.";
    else if (!selectedRow.total) errorMsg = "Total estimated is required.";
    else if (isNaN(Number(selectedRow.total)) || Number(selectedRow.total) <= 0)
      errorMsg = "Total estimated must be a positive number.";
    else if (!selectedRow.date) errorMsg = "Required date is required.";
    else if (!selectedRow.justification)
      errorMsg = "Justification is required.";

    if (errorMsg) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: errorMsg,
        life: 4000,
      });
      return;
    }

    try {
      const updateResponse = await UpdateAiResponse(Number(selectedRow.item));
      const payload: any = {
        ItemId: selectedRow.item,
        Quantity: selectedRow.quantity?.toString(),
        Price: selectedRow.price?.toString(),
        Total: selectedRow.total?.toString(),
        Date: selectedRow.date,
        Justification: selectedRow.justification,
        ActiveTab: "1",
        Status: "Pending",
        AIOverview: updateResponse || "",
      };
      if (selectedRow?.id) {
        await SPServices.SPUpdateItem({
          Listname: "ProcurementDetails",
          ID: selectedRow.id,
          RequestJSON: payload,
        });
      } else {
        await SPServices.SPAddItem({
          Listname: "ProcurementDetails",
          RequestJSON: payload,
        });
      }
      setVisible(false);
      setIsLoader(true);
      await getProcurementData();
    } catch (error) {
      console.error("Error saving to SharePoint list:", error);
    }
  };

  // const mandatorySymbol = () => <span style={{ color: "red" }}>*</span>;

  // ====== Computed stats ======
  const totalPRs = data.length;
  const totalItems = data.reduce(
    (acc, row) => acc + (Number(row.quantity) || 0),
    0,
  );
  const totalEstimated = data.reduce(
    (acc, row) => acc + (Number(String(row.total).replace(/[$,]/g, "")) || 0),
    0,
  );
  const upcomingDue = data.filter((row) => {
    if (!row.date) return false;
    const d = new Date(row.date);
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return d >= now && d <= endOfMonth;
  }).length;

  // ====== Status Overview counts ======
  const approvedCount = data.filter(
    (r) => (r.status || "").toLowerCase() === "approved",
  ).length;
  const pendingCount = data.filter(
    (r) => (r.status || "").toLowerCase() === "pending",
  ).length;
  // const draftCount = data.filter(
  //   (r) =>
  //     (r.status || "").toLowerCase() === "draft" ||
  //     (r.status || "").toLowerCase() === "pending",
  // ).length;

  // ====== Spend by category (derived from items) ======
  const categorySpend: Record<string, number> = {};
  data.forEach((row) => {
    const cat = row.item || "Other";
    categorySpend[cat] =
      (categorySpend[cat] || 0) +
      (Number(String(row.total).replace(/[$,]/g, "")) || 0);
  });
  const categoryList = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const maxCatSpend = categoryList[0]?.[1] || 1;

  const catColors = ["#e67e22", "#6c63ff", "#3182ce", "#e67e22", "#e53e3e"];

  // ====== Filtered table data ======
  const filteredData = data.filter((row) => {
    const matchTab =
      activeTab === "All" ||
      (row.status || "").toLowerCase() === activeTab.toLowerCase();
    const matchSearch =
      !searchText ||
      (row.prId || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (row.item || "").toLowerCase().includes(searchText.toLowerCase());
    return matchTab && matchSearch;
  });

  // ====== Column body templates ======
  const prIdTemplate = (rowData: any) => (
    <div className={styles.prIdCellWrap}>
      <span
        className={styles.prIdDot}
        style={{
          background:
            (rowData.status || "").toLowerCase() === "approved"
              ? "#28a745"
              : (rowData.status || "").toLowerCase() === "pending"
                ? "#e67e22"
                : "#3182ce",
        }}
      />
      <span
        className={styles.prIdCell}
        onClick={() =>
          navigate("/procurementmanagement", {
            state: { selectedRow: rowData, id: rowData.id },
          })
        }
      >
        {"REQ-" + String(rowData.id || "").padStart(4, "0")}
      </span>
    </div>
  );

  const itemTemplate = (rowData: any) => (
    <div className={styles.itemCell}>
      <div className={styles.itemIconBox}>
        <i
          className={`pi ${rowData.item?.toLowerCase().includes("laptop") ? "pi-desktop" : "pi-mobile"}`}
        />
      </div>
      {rowData.item || "—"}
    </div>
  );

  const qtyTemplate = (rowData: any) => (
    <span className={styles.qtyChip}>{rowData.quantity || "0"}</span>
  );

  const priceTemplate = (rowData: any) => (
    <span>${Number(rowData.price).toLocaleString("en-US") || "—"}</span>
  );

  const totalTemplate = (rowData: any) => (
    <span className={styles.totalCell}>
      ${Number(rowData.total).toLocaleString("en-US") || "—"}
    </span>
  );

  const statusTemplate = (rowData: any) => {
    const s = (rowData.status || "active").toLowerCase();
    const cls =
      s === "approved"
        ? styles.statusApproved
        : s === "pending"
          ? styles.statusPending
          : s === "draft"
            ? styles.statusDraft
            : styles.statusDefault;
    return (
      <span className={`${styles.statusBadge} ${cls}`}>
        <span className={styles.statusDotInner} />
        {rowData.status || "Active"}
      </span>
    );
  };

  const dateTemplate = (rowData: any) => (
    <div className={styles.dateCell}>
      <i className={`pi pi-calendar ${styles.dateIcon}`} />
      {rowData.date ? moment(rowData.date).format("DD MMM YYYY") : "—"}
    </div>
  );

  const actionTemplate = (rowData: any) => (
    <div className={styles.actionCell}>
      <button
        className={styles.actionEditBtn}
        onClick={() =>
          navigate("/procurementmanagement", {
            state: { selectedRow: rowData, id: rowData.id },
          })
        }
        title="Edit"
      >
        <i className="pi pi-pencil" />
      </button>
      <button
        className={styles.actionViewBtn}
        onClick={() =>
          navigate("/procurementmanagement", {
            state: { selectedRow: rowData, id: rowData.id },
          })
        }
        title="View"
      >
        <i className="pi pi-eye" />
      </button>
    </div>
  );

  useEffect(() => {
    setIsLoader(true);
    void UpdateAiResponse(1);
    void getApproverConfig();
  }, []);

  return (
    <>
      {isLoader ? (
        <MainLoader />
      ) : (
        <div className={styles.procurementWrapper}>
          <Toast ref={toast} />

          {/* ===== PAGE HEADER ===== */}
          <div className={styles.pageHeader}>
            <div className={styles.pageHeaderLeft}>
              <h2 className={styles.pageTitle}>Procurement</h2>
              <p className={styles.pageSubtitle}>
                {moment().format("MMMM YYYY")} · Purchase Requisitions
              </p>
            </div>
            <div className={styles.pageHeaderRight}>
              <div className={styles.searchBox}>
                <i
                  className="pi pi-search"
                  style={{ color: "#a0aab4", fontSize: 13 }}
                />
                <input
                  className={styles.searchInput}
                  placeholder="Search PRs..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <button className={styles.exportBtn} title="Export">
                <i className="pi pi-download" />
              </button>
              {userRole === "User" && (
                <button
                  className={styles.newPrBtn}
                  onClick={() => {
                    setSelectedRow(newObj);
                    setVisible(true);
                  }}
                >
                  + New PR
                </button>
              )}
            </div>
          </div>

          {/* ===== STAT CARDS ===== */}
          <div className={styles.statCardsGrid}>
            {/* Total PRs */}
            <div className={styles.statCard}>
              <div className={styles.statCardContent}>
                <p className={styles.statCardLabel}>TOTAL PRS</p>
                <p className={styles.statCardValue}>{totalPRs}</p>
                <p className={styles.statCardSub}>↑ This period</p>
              </div>
              <div
                className={`${styles.statCardIcon} ${styles.statIconClipboard}`}
              >
                <i className="pi pi-clipboard" />
              </div>
            </div>
            {/* Total Items */}
            <div className={styles.statCard}>
              <div className={styles.statCardContent}>
                <p className={styles.statCardLabel}>TOTAL ITEMS</p>
                <p className={styles.statCardValue}>{totalItems}</p>
                <p className={styles.statCardSub}>Units ordered</p>
              </div>
              <div
                className={`${styles.statCardIcon} ${styles.statIconDesktop}`}
              >
                <i className="pi pi-desktop" />
              </div>
            </div>
            {/* Est. Value */}
            <div className={styles.statCard}>
              <div className={styles.statCardContent}>
                <p className={styles.statCardLabel}>EST. VALUE</p>
                <p className={styles.statCardValue} style={{ fontSize: 22 }}>
                  ${totalEstimated.toLocaleString("en-US")}
                </p>
                <p className={styles.statCardSub}>Combined spend</p>
              </div>
              <div className={`${styles.statCardIcon} ${styles.statIconRupee}`}>
                <i className="pi pi-dollar" />
              </div>
            </div>
            {/* Upcoming Due */}
            <div className={styles.statCard}>
              <div className={styles.statCardContent}>
                <p className={styles.statCardLabel}>UPCOMING DUE</p>
                <p className={styles.statCardValue}>{upcomingDue}</p>
                <p className={styles.statCardSub}>In this month</p>
              </div>
              <div className={`${styles.statCardIcon} ${styles.statIconCal}`}>
                <i className="pi pi-calendar" />
              </div>
            </div>
          </div>

          {/* ===== MAIN TWO-COLUMN LAYOUT ===== */}
          <div className={styles.mainLayout}>
            {/* LEFT: Table */}
            <div className={styles.tableSection}>
              <div className={styles.tableCard}>
                {/* Table header */}
                <div className={styles.tableTopRow}>
                  <div className={styles.tableTitleRow}>
                    <p className={styles.tableTitle}>Purchase Requisitions</p>
                    <span className={styles.recordsBadge}>
                      {filteredData.length} RECORD
                      {filteredData.length !== 1 ? "S" : ""}
                    </span>
                  </div>
                  <div className={styles.filterTabs}>
                    {["All", "Approved", "Pending", "Draft"].map((tab) => (
                      <button
                        key={tab}
                        className={`${styles.filterTab} ${activeTab === tab ? styles.filterTabActive : ""}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DataTable */}
                <DataTable
                  value={filteredData}
                  responsiveLayout="scroll"
                  className="p-datatable-sm"
                  paginator={true}
                  rows={10}
                  paginatorTemplate="PrevPageLink PageLinks NextPageLink"
                  paginatorClassName="custom-paginator"
                  emptyMessage={
                    <div className={styles.emptyState}>
                      <i
                        className="pi pi-inbox"
                        style={{
                          fontSize: 32,
                          color: "#d1d5db",
                          marginBottom: 8,
                        }}
                      />
                      <p>No records found</p>
                    </div>
                  }
                >
                  <Column field="prId" header="PR ID" body={prIdTemplate} />
                  <Column field="item" header="ITEM" body={itemTemplate} />
                  <Column
                    field="quantity"
                    header="QTY"
                    body={qtyTemplate}
                    style={{ width: "6rem" }}
                  />
                  <Column
                    field="price"
                    header="UNIT PRICE"
                    body={priceTemplate}
                  />
                  <Column field="total" header="TOTAL" body={totalTemplate} />
                  <Column
                    field="status"
                    header="STATUS"
                    body={statusTemplate}
                  />
                  <Column
                    field="date"
                    header="REQUIRED BY"
                    body={dateTemplate}
                  />
                  <Column
                    header="ACTIONS"
                    body={actionTemplate}
                    style={{ width: "7rem" }}
                  />
                </DataTable>
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div className={styles.sidebar}>
              {/* Status Overview */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <p className={styles.sideCardTitle}>Status Overview</p>
                </div>
                <div className={styles.statusOverviewList}>
                  {[
                    {
                      label: "Approved",
                      count: approvedCount,
                      color: "#e67e22",
                      bg: "#e8f5ec",
                    },
                    {
                      label: "Pending",
                      count: pendingCount,
                      color: "#e67e22",
                      bg: "#fff3e0",
                    },
                    // {
                    //   label: "Draft",
                    //   count: draftCount,
                    //   color: "#6a737d",
                    //   bg: "#f0f2f4",
                    // },
                  ].map((s) => (
                    <div key={s.label} className={styles.statusOverviewRow}>
                      <div className={styles.statusOverviewLeft}>
                        <span
                          className={styles.statusOverviewDot}
                          style={{ background: s.color }}
                        />
                        <span className={styles.statusOverviewLabel}>
                          {s.label}
                        </span>
                      </div>
                      <span className={styles.statusOverviewCount}>
                        {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Suppliers */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <p className={styles.sideCardTitle}>Top Suppliers</p>
                </div>
                <div className={styles.supplierList}>
                  {[
                    {
                      name: "Dell Technologies",
                      sub: "3 orders · Electronics",
                      badge: "Active",
                      badgeCls: styles.badgeActive,
                      initial: "D",
                      color: "#4c8b4b",
                    },
                    {
                      name: "Lenovo India",
                      sub: "1 order · Laptops",
                      badge: "Active",
                      badgeCls: styles.badgeActive,
                      initial: "L",
                      color: "#6c63ff",
                    },
                    {
                      name: "Samsung B2B",
                      sub: "2 orders · Devices",
                      badge: "Pending",
                      badgeCls: styles.badgePending,
                      initial: "S",
                      color: "#3182ce",
                    },
                  ].map((s) => (
                    <div key={s.name} className={styles.supplierRow}>
                      <div
                        className={styles.supplierAvatar}
                        style={{ background: s.color }}
                      >
                        {s.initial}
                      </div>
                      <div className={styles.supplierInfo}>
                        <p className={styles.supplierName}>{s.name}</p>
                        <p className={styles.supplierSub}>{s.sub}</p>
                      </div>
                      <span className={`${styles.supplierBadge} ${s.badgeCls}`}>
                        {s.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spend by Category */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <p className={styles.sideCardTitle}>Spend by Category</p>
                </div>
                <div className={styles.categoryList}>
                  {categoryList.length > 0 ? (
                    categoryList.map(([cat, amt], idx) => (
                      <div key={cat} className={styles.categoryRow}>
                        <div className={styles.categoryRowTop}>
                          <div className={styles.categoryLeft}>
                            <span
                              className={styles.categoryDot}
                              style={{
                                background: catColors[idx % catColors.length],
                              }}
                            />
                            <span className={styles.categoryName}>{cat}</span>
                          </div>
                          <span className={styles.categoryAmount}>
                            ${amt.toLocaleString("en-US")}
                          </span>
                        </div>
                        <div className={styles.categoryBar}>
                          <div
                            className={styles.categoryBarFill}
                            style={{
                              width: `${(amt / maxCatSpend) * 100}%`,
                              background: catColors[idx % catColors.length],
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noData}>No data yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===== ADD/EDIT DIALOG ===== */}
          <Dialog
            visible={visible}
            style={{ width: "45vw" }}
            onHide={() => setVisible(false)}
            draggable={false}
            className="custom-pr-dialog"
            showHeader={false}
          >
            <div className={styles.dialogHeaderCustom}>
              <div className={styles.dialogHeaderIcon}>
                <i className="pi pi-shopping-cart" />
              </div>
              <div className={styles.dialogHeaderContent}>
                <p className={styles.dialogHeaderTitle}>Purchase Request</p>
                <p className={styles.dialogHeaderSub}>
                  Create a new procurement requisition
                </p>
              </div>
              <button
                className={styles.dialogCloseBtn}
                onClick={() => setVisible(false)}
              >
                <i className="pi pi-times" />
              </button>
            </div>

            <div className={styles.sectionDivider}>ITEM INFORMATION</div>

            {selectedRow && (
              <div className={styles.fieldsGrid}>
                {/* Item */}
                <div className={styles.fieldGroup}>
                  <label>
                    Item <span className={styles.reqStar}>*</span>
                  </label>
                  <Dropdown
                    options={productOptions}
                    value={selectedRow.item}
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Select item"
                    className={styles.customInput}
                    onChange={(e: any) => onChangeHandler("item", e.value)}
                    filter
                  />
                </div>

                {/* PR ID */}
                <div className={styles.fieldGroup}>
                  <label>
                    PR ID <span className={styles.reqStar}>*</span>
                  </label>
                  <Dropdown
                    options={productOptions}
                    value={selectedRow.item} // It looks like this uses a placeholder in the design
                    placeholder="Auto-generate"
                    className={styles.customInput}
                    disabled
                  />
                </div>

                {/* Quantity */}
                <div className={styles.fieldGroup}>
                  <label>
                    Quantity <span className={styles.reqStar}>*</span>
                  </label>
                  <InputText
                    value={selectedRow.quantity}
                    placeholder="e.g. 2"
                    className={styles.customInput}
                    onChange={(e: any) =>
                      onChangeHandler("quantity", e.target.value)
                    }
                  />
                </div>

                {/* Estimated Unit Price */}
                <div className={styles.fieldGroup}>
                  <label>
                    Estimated Unit Price{" "}
                    <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.currencyPrefix}>$</span>
                    <InputText
                      value={
                        selectedRow.price
                          ? String(selectedRow.price).replace("$", "")
                          : ""
                      }
                      placeholder="0.00"
                      className={`${styles.customInput} ${styles.hasPrefix}`}
                      onChange={(e: any) =>
                        onChangeHandler("price", e.target.value)
                      }
                    />
                    <i className={`pi pi-dollar ${styles.rightIcon}`} />
                  </div>
                </div>

                {/* Total Estimated */}
                <div className={styles.fieldGroup}>
                  <label>
                    Total Estimated <span className={styles.reqStar}>*</span>
                    <span className={styles.autoBadge}>
                      <i className="pi pi-bolt" style={{ fontSize: "8px" }} />{" "}
                      Auto
                    </span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <span className={styles.currencyPrefix}>$</span>
                    <InputText
                      value={
                        selectedRow.total
                          ? String(selectedRow.total).replace("$", "")
                          : ""
                      }
                      placeholder="0"
                      className={`${styles.customInput} ${styles.hasPrefix} ${styles.lockedInput}`}
                      onChange={(e: any) => {
                        const val = e.target.value;
                        if (val === "" || /^[0-9]+$/.test(val)) {
                          onChangeHandler("total", val);
                        }
                      }}
                    />
                    <i
                      className={`pi pi-lock ${styles.rightIcon} ${styles.rightIconLocked}`}
                    />
                  </div>
                </div>

                {/* Required Date */}
                <div className={styles.fieldGroup}>
                  <label>
                    Required Date <span className={styles.reqStar}>*</span>
                  </label>
                  <div className={styles.inputWithIcon}>
                    <Calendar
                      value={
                        selectedRow.date ? new Date(selectedRow.date) : null
                      }
                      dateFormat="dd/mm/yy"
                      placeholder="mm/dd/yyyy"
                      className={styles.customInputCal}
                      onChange={(e: any) =>
                        onChangeHandler(
                          "date",
                          e.value?.toLocaleDateString() || "",
                        )
                      }
                    />
                    <i className={`pi pi-calendar ${styles.rightIcon}`} />
                  </div>
                </div>

                {/* Justification */}
                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                  <label>
                    Justification <span className={styles.reqStar}>*</span>
                  </label>
                  <InputTextarea
                    rows={4}
                    value={selectedRow.justification}
                    placeholder="Briefly describe why this purchase is needed..."
                    className={styles.customInput}
                    onChange={(e: any) =>
                      onChangeHandler("justification", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <div className={styles.dialogFooterCustom}>
              <div className={styles.dialogFooterButtons}>
                <Button
                  label="✖ Cancel"
                  className={styles.btnCancel}
                  onClick={() => setVisible(false)}
                />
                <Button
                  label="Submit Request →"
                  className={styles.btnSubmit}
                  onClick={onSubmit}
                />
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Dashboard;
