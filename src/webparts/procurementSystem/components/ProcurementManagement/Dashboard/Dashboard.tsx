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
import { useNavigate } from "react-router-dom";
import styles from "./Dashaboard.module.scss";
import SPServices from "../../../../../CommonServices/SPServices";
import { Calendar } from "primereact/calendar";
import Loader from "../../Loader/Loader";
import MainLoader from "../../Loader/MainLoader";
import * as moment from "moment";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast | null>(null);

  let newObj = {
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
  const [applicationLoader, setapplicationLoader] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState(false);

  const onChangeHandler = (key: string, value: string) => {
    let tempDialog = {
      ...selectedRow,
    };
    tempDialog[key] = value;
    setSelectedRow({ ...tempDialog });
  };

  const getProcurementData = async () => {
    await SPServices.SPReadItems({
      Listname: "ProcurementDetails",
      Select: "*,Requestor/Title,Item/Title,Item/PRId",
      Expand: "Requestor,Item",
    })
      .then(async (res: any) => {
        // Map the response to formData structure if needed
        const mappedData = res.map((item: any) => ({
          id: item.ID,
          prId: item.Item?.PRId || "",
          item: item.Item ? item.Item.Title : "", // assuming Item is a lookup
          quantity: item.Quantity,
          price: item.Price,
          total: item.Total,
          date: item.Date,
          justification: item.Justification,
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
      // fetch ID and Title (and price if available)
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

    if (!selectedRow.item) {
      errorMsg = "Item is required.";
    } else if (!selectedRow.quantity) {
      errorMsg = "Quantity is required.";
    } else if (
      isNaN(Number(selectedRow.quantity)) ||
      Number(selectedRow.quantity) <= 0
    ) {
      errorMsg = "Quantity must be a number greater than 0.";
    } else if (!selectedRow.price) {
      errorMsg = "Estimated unit price is required.";
    } else if (
      isNaN(Number(selectedRow.price)) ||
      Number(selectedRow.price) <= 0
    ) {
      errorMsg = "Estimated unit price must be a number greater than 0.";
    } else if (!selectedRow.total) {
      errorMsg = "Total estimated is required.";
    } else if (
      isNaN(Number(selectedRow.total)) ||
      Number(selectedRow.total) <= 0
    ) {
      errorMsg = "Total estimated must be a number greater than 0.";
    } else if (!selectedRow.date) {
      errorMsg = "Required date is required.";
    } else if (!selectedRow.justification) {
      errorMsg = "Justification is required.";
    }

    if (errorMsg) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Validation Error",
          detail: errorMsg,
          life: 4000,
        });
      }

      return;
    }

    try {
      const payload: any = {
        ItemId: selectedRow.item,
        Quantity: selectedRow.quantity,
        Price: selectedRow.price,
        Total: selectedRow.total,
        Date: selectedRow.date,
        Justification: selectedRow.justification,
        ActiveTab: "1",
      };

      if (selectedRow && selectedRow.id) {
        const id = selectedRow.id;
        await SPServices.SPUpdateItem({
          Listname: "ProcurementDetails",
          ID: id,
          RequestJSON: payload,
        });
      } else {
        // Add new item
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

  const actionTemplate = (rowData: any) => (
    <div className="editIcon">
      <i
        className="pi pi-pencil"
        onClick={() => {
          navigate("/procurementmanagement", {
            state: { selectedRow: rowData, id: rowData.id },
          });
        }}
      />
    </div>
  );

  const mandatorySymbol = (): JSX.Element => {
    return <span style={{ color: "red" }}>*</span>;
  };

  useEffect(() => {
    setTimeout(() => {
      setapplicationLoader(false);
      setIsLoader(true);
      void loadProducts();
    }, 3000);
  }, []);

  return isLoader ? (
    <MainLoader />
  ) : (
    <>
      {applicationLoader ? (
        <Loader />
      ) : (
        <div className={styles.procurementWrapper}>
          <Toast ref={toast} />
          {/* Header */}
          <div className={styles.pageHeader}>
            <h3>Procurement System</h3>
            <Button
              label="Add New"
              icon="pi pi-plus"
              className="p-button-success"
              onClick={() => {
                setSelectedRow(newObj);
                setVisible(true);
              }}
            />
          </div>

          {/* DataTable */}
          <DataTable
            value={data}
            paginator
            rows={12}
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="prId" header="PR ID" />
            <Column field="item" header="Item" />
            <Column field="quantity" header="Quantity" />
            <Column field="price" header="Estimated Unit Price" />
            <Column field="total" header="Total Estimated" />
            <Column
              field="date"
              header="Required Date"
              body={(rowData) =>
                rowData.date ? moment(rowData.date).format("DD/MM/YYYY") : " - "
              }
            />
            <Column body={actionTemplate} style={{ width: "4rem" }} />
          </DataTable>

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
                  onClick={() => setVisible(false)}
                />
                <Button
                  label="Submit"
                  icon="pi pi-check"
                  className="p-button-success"
                  onClick={onSubmit}
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
                    onChange={(e: any) => {
                      //   const id = e.value;
                      //   const selected = productOptions.find((o) => o.value === id);
                      //   onChangeHandler("itemId", id);
                      onChangeHandler("item", e.value);
                      // optionally auto-fill price if product contains it
                      //   if (selected && selected.price)
                      //     onChangeHandler("price", selected.price.toString());
                    }}
                    filter
                    showClear
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
                    onChange={(e: any) => {
                      //   const id = e.value;
                      //   const selected = productOptions.find((o) => o.value === id);
                      //   onChangeHandler("itemId", id);
                      onChangeHandler("item", e.value);
                      // optionally auto-fill price if product contains it
                      //   if (selected && selected.price)
                      //     onChangeHandler("price", selected.price.toString());
                    }}
                    filter
                    showClear
                    disabled
                  />
                </div>
                <div className={styles.fields}>
                  <label>Quantity {mandatorySymbol()}</label>
                  <InputText
                    value={selectedRow.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeHandler("quantity", e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                <div className={styles.fields}>
                  <label>Estimated unit price {mandatorySymbol()}</label>
                  <InputText
                    value={
                      selectedRow.price
                        ? selectedRow.price.replace("₹", "")
                        : ""
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeHandler("price", e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                <div className={styles.fields}>
                  <label>Total estimated {mandatorySymbol()}</label>
                  <InputText
                    value={
                      selectedRow.total
                        ? selectedRow.total.replace("₹", "")
                        : ""
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeHandler("total", e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                </div>

                <div className={styles.fields}>
                  <label>Required date {mandatorySymbol()}</label>
                  <Calendar
                    value={selectedRow.date ? new Date(selectedRow.date) : null}
                    onChange={(e: any) =>
                      onChangeHandler(
                        "date",
                        e.value?.toLocaleDateString() || "",
                      )
                    }
                    dateFormat="dd/mm/yy"
                    style={{ width: "100%" }}
                  />
                </div>

                <div className={styles.fields}>
                  <label>Justification {mandatorySymbol()}</label>
                  <InputTextarea
                    rows={3}
                    value={selectedRow.justification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      onChangeHandler("justification", e.target.value)
                    }
                    style={{ width: "100%" }}
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
