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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast | null>(null);

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
      const payload: any = {
        ItemId: selectedRow.item,
        Quantity: selectedRow.quantity?.toString(),
        Price: selectedRow.price?.toString(),
        Total: selectedRow.total?.toString(),
        Date: selectedRow.date,
        Justification: selectedRow.justification,
        ActiveTab: "1",
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

  const mandatorySymbol = () => <span style={{ color: "red" }}>*</span>;

  useEffect(() => {
    setIsLoader(true);
    void loadProducts();
  }, []);

  // ====== Computed stats ======
  const totalPRs = data.length;
  const totalItems = data.reduce(
    (acc, row) => acc + (Number(row.quantity) || 0),
    0,
  );
  const totalEstimated = data.reduce(
    (acc, row) => acc + (Number(String(row.total).replace(/[₹,]/g, "")) || 0),
    0,
  );
  const upcomingDue = data.filter((row) => {
    if (!row.date) return false;
    const d = new Date(row.date);
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return d >= now && d <= endOfMonth;
  }).length;

  // ====== Column body templates ======
  const prIdTemplate = (rowData: any) => (
    <span
      className={styles.prIdCell}
      onClick={() =>
        navigate("/procurementmanagement", {
          state: { selectedRow: rowData, id: rowData.id },
        })
      }
    >
      {"PR - " + rowData.id?.toString().padStart(4, "0")}
    </span>
  );

  const itemTemplate = (rowData: any) => (
    <div className={styles.itemCell}>
      <i
        className={`pi ${rowData.item?.toLowerCase().includes("laptop") ? "pi-desktop" : "pi-mobile"} ${styles.itemIcon}`}
      />
      {rowData.item || "—"}
    </div>
  );

  const qtyTemplate = (rowData: any) => (
    <span className={styles.qtyChip}>{rowData.quantity || "0"}</span>
  );

  const priceTemplate = (rowData: any) => (
    <span>₹{Number(rowData.price).toLocaleString("en-IN") || "—"}</span>
  );

  const totalTemplate = (rowData: any) => (
    <span style={{ fontWeight: 600 }}>
      ₹{Number(rowData.total).toLocaleString("en-IN") || "—"}
    </span>
  );

  const statusTemplate = (rowData: any) => {
    const s = (rowData.status || "Active").toLowerCase();
    const cls =
      s === "active"
        ? styles.statusActive
        : s === "pending"
          ? styles.statusPending
          : s === "review"
            ? styles.statusReview
            : styles.statusDefault;
    return (
      <span className={`${styles.statusBadge} ${cls}`}>
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
    <div
      className={styles.actionCell}
      onClick={() =>
        navigate("/procurementmanagement", {
          state: { selectedRow: rowData, id: rowData.id },
        })
      }
    >
      <i className="pi pi-pencil" />
    </div>
  );

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
              <h3>Procurement System</h3>
              <p>Manage all purchase requisitions</p>
            </div>
            <div className={styles.pageHeaderRight}>
              <Button
                label="Add New"
                icon="pi pi-plus"
                className="p-button-success"
                style={{ borderRadius: 10, padding: "8px 16px", fontSize: 13 }}
                onClick={() => {
                  setSelectedRow(newObj);
                  setVisible(true);
                }}
              />
            </div>
          </div>

          {/* ===== STAT CARDS ===== */}
          <div className={styles.statCardsGrid}>
            <div className={styles.statCard}>
              <div
                className={`${styles.statCardIconWrap} ${styles.statIconGreen}`}
              >
                📋
              </div>
              <div className={styles.statCardBody}>
                <p className={styles.statCardLabel}>Total PRs</p>
                <p className={styles.statCardValue}>{totalPRs}</p>
                <p className={styles.statCardSub}>This period</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div
                className={`${styles.statCardIconWrap} ${styles.statIconBlue}`}
              >
                💻
              </div>
              <div className={styles.statCardBody}>
                <p className={styles.statCardLabel}>Total Items</p>
                <p className={styles.statCardValue}>{totalItems}</p>
                <p className={styles.statCardSub}>Units ordered</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div
                className={`${styles.statCardIconWrap} ${styles.statIconOrange}`}
              >
                💰
              </div>
              <div className={styles.statCardBody}>
                <p className={styles.statCardLabel}>Total Estimated</p>
                <p className={styles.statCardValue} style={{ fontSize: 20 }}>
                  ₹{totalEstimated.toLocaleString("en-IN")}
                </p>
                <p className={styles.statCardSub}>Combined value</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div
                className={`${styles.statCardIconWrap} ${styles.statIconRed}`}
              >
                📅
              </div>
              <div className={styles.statCardBody}>
                <p className={styles.statCardLabel}>Upcoming Due</p>
                <p className={styles.statCardValue}>{upcomingDue}</p>
                <p className={styles.statCardSub}>In this month</p>
              </div>
            </div>
          </div>

          {/* ===== TABLE CARD ===== */}
          <div className={styles.tableContainer}>
            <div className={styles.tableTopRow}>
              <p className={styles.tableTitle}>
                Purchase Requisitions
                <span className={styles.recordsBadge}>
                  {data.length} records
                </span>
              </p>
            </div>
            <DataTable
              value={data}
              responsiveLayout="scroll"
              className="p-datatable-sm"
              paginator
              rows={10}
              paginatorTemplate="PrevPageLink PageLinks NextPageLink"
              paginatorClassName="custom-paginator"
            >
              <Column field="prId" header="PR ID" body={prIdTemplate} />
              <Column field="item" header="Item" body={itemTemplate} />
              <Column field="quantity" header="Quantity" body={qtyTemplate} />
              <Column
                field="price"
                header="Est. Unit Price"
                body={priceTemplate}
              />
              <Column
                field="total"
                header="Total Estimated"
                body={totalTemplate}
              />
              <Column field="status" header="Status" body={statusTemplate} />
              <Column field="date" header="Required Date" body={dateTemplate} />
              <Column
                header="Action"
                body={actionTemplate}
                style={{ width: "5rem" }}
              />
            </DataTable>
          </div>

          {/* ===== ADD/EDIT DIALOG ===== */}
          <Dialog
            header="Purchase Request"
            visible={visible}
            style={{ width: "40vw" }}
            onHide={() => setVisible(false)}
            draggable={false}
            showCloseIcon={false}
            footer={
              <div className="flex justify-content-end gap-2">
                <Button
                  label="Close"
                  icon="pi pi-times"
                  className="p-button-secondary"
                  style={{
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 13,
                  }}
                  onClick={() => setVisible(false)}
                />
                <Button
                  label="Submit"
                  icon="pi pi-check"
                  className="p-button-success"
                  onClick={onSubmit}
                  style={{
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 13,
                  }}
                />
              </div>
            }
          >
            {selectedRow && (
              <div className={styles.fieldsFlex}>
                <div className={styles.fields}>
                  <label>Item {mandatorySymbol()}</label>
                  <Dropdown
                    options={productOptions}
                    value={selectedRow.item}
                    optionLabel="name"
                    optionValue="value"
                    placeholder="Select item"
                    style={{ width: "100%" }}
                    onChange={(e: any) => onChangeHandler("item", e.value)}
                    filter
                    // showClear
                  />
                </div>
                <div className={styles.fields}>
                  <label>PR ID {mandatorySymbol()}</label>
                  <Dropdown
                    options={productOptions}
                    value={selectedRow.item}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select item"
                    style={{ width: "100%" }}
                    onChange={(e: any) => onChangeHandler("item", e.value)}
                    filter
                    // showClear
                    disabled
                  />
                </div>
                <div className={styles.fields}>
                  <label>Quantity {mandatorySymbol()}</label>
                  <InputText
                    value={selectedRow.quantity}
                    style={{ width: "100%" }}
                    onChange={(e: any) =>
                      onChangeHandler("quantity", e.target.value)
                    }
                  />
                </div>
                <div className={styles.fields}>
                  <label>Estimated Unit Price {mandatorySymbol()}</label>
                  <InputText
                    value={
                      selectedRow.price
                        ? String(selectedRow.price).replace("₹", "")
                        : ""
                    }
                    style={{ width: "100%" }}
                    onChange={(e: any) =>
                      onChangeHandler("price", e.target.value)
                    }
                  />
                </div>
                <div className={styles.fields}>
                  <label>Total Estimated {mandatorySymbol()}</label>
                  <InputText
                    value={
                      selectedRow.total
                        ? String(selectedRow.total).replace("₹", "")
                        : ""
                    }
                    style={{ width: "100%" }}
                    onChange={(e: any) =>
                      onChangeHandler("total", e.target.value)
                    }
                  />
                </div>
                <div className={styles.fields}>
                  <label>Required Date {mandatorySymbol()}</label>
                  <Calendar
                    value={selectedRow.date ? new Date(selectedRow.date) : null}
                    dateFormat="dd/mm/yy"
                    showIcon
                    style={{ width: "100%" }}
                    onChange={(e: any) =>
                      onChangeHandler(
                        "date",
                        e.value?.toLocaleDateString() || "",
                      )
                    }
                  />
                </div>
                <div className={styles.fields} style={{ gridColumn: "span 2" }}>
                  <label>Justification {mandatorySymbol()}</label>
                  <InputTextarea
                    rows={3}
                    value={selectedRow.justification}
                    style={{ width: "100%" }}
                    onChange={(e: any) =>
                      onChangeHandler("justification", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </Dialog>
        </div>
      )}
    </>
  );
};

export default Dashboard;
