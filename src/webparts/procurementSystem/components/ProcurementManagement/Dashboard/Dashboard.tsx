import * as React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashaboard.module.scss";
import SPServices from "../../../../../CommonServices/SPServices";
import { Calendar } from "primereact/calendar";

const Dashboard: React.FC = () => {
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

  const data = [
    {
      prId: "PR-001",
      item: "Laptop – Dell Latitude 5440",
      quantity: "20 Units",
      price: "₹68,000",
      total: "₹13,60,000",
      date: "28/03/2026",
      justification: "New employee onboarding requirement",
    },
    {
      prId: "PR-002",
      item: "Desktop Workstations (i7, 16GB RAM)",
      quantity: "15 Units",
      price: "₹52,000",
      total: "₹7,80,000",
      date: "02/04/2026",
      justification: "New employee onboarding requirement",
    },
  ];
  const onChangeHandler = (key: string, value: string) => {
    let tempDialog = {
      ...selectedRow,
    };
    tempDialog[key] = value;
    setSelectedRow({ ...tempDialog });
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
    } catch (err) {
      console.error("Failed to load product options", err);
    }
  };
  // load product options from ProductDetails list
  useEffect(() => {
    void loadProducts();
  }, []);
  const LIST_NAME = "ProcurementDetails"; // change to your actual SharePoint list name

  const onSubmit = async () => {
    try {
      // Prepare payload - adjust field names to match your SharePoint list internal names if needed
      const payload: any = {
        // prId: selectedRow.prId,
        // For lookup column in SharePoint, include the lookup id field (FieldInternalName + 'Id')
        ItemId: selectedRow.item?.value,
        Quantity: selectedRow.quantity,
        Price: selectedRow.price,
        Total: selectedRow.total,
        Date: selectedRow.date,
        Justification: selectedRow.justification,
      };

      if (selectedRow && selectedRow.id) {
        // Update existing item (ensure ID field is present)
        const id = selectedRow.id; // make sure your data includes the SharePoint item ID for updates
        await SPServices.SPUpdateItem({
          Listname: LIST_NAME,
          ID: id,
          RequestJSON: payload,
        });
      } else {
        // Add new item
        await SPServices.SPAddItem({
          Listname: LIST_NAME,
          RequestJSON: payload,
        });
      }

      setVisible(false);
    } catch (error) {
      console.error("Error saving to SharePoint list:", error);
      // optionally show a message to user
    }
  };

  const navigate = useNavigate();

  const actionTemplate = (rowData: any) => (
    <Button
      icon="pi pi-pencil"
      onClick={() => {
        // navigate to ProcurementManagement and pass the row data in router state
        navigate("/procurementmanagement", { state: { selectedRow: rowData } });
      }}
    />
  );

  return (
    <div className={styles.procurementWrapper}>
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
        <Column field="date" header="Required Date" />
        <Column body={actionTemplate} style={{ width: "4rem" }} />
      </DataTable>

      {/* Assign Resource Dialog */}
      <Dialog
        header="Assign resource"
        visible={visible}
        style={{ width: "40vw" }}
        onHide={() => setVisible(false)}
        footer={
          <div className="flex justify-content-end gap-2">
            <Button
              label="Close"
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
          <div className="p-fluid grid">
            <div className="col-6">
              <label>PR ID</label>
              <Dropdown
                options={productOptions}
                value={selectedRow.item}
                optionLabel="label"
                optionValue="value"
                placeholder="Select item"
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

            <div className="col-6">
              <label>Item</label>
              <Dropdown
                options={productOptions}
                value={selectedRow.item}
                optionLabel="name"
                optionValue="value"
                placeholder="Select item"
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

            <div className="col-6">
              <label>Quantity</label>
              <InputText
                value={selectedRow.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeHandler("quantity", e.target.value)
                }
              />
            </div>

            <div className="col-6">
              <label>Estimated unit price</label>
              <InputText
                value={
                  selectedRow.price ? selectedRow.price.replace("₹", "") : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeHandler("price", e.target.value)
                }
              />
            </div>

            <div className="col-6">
              <label>Total estimated</label>
              <InputText
                value={
                  selectedRow.total ? selectedRow.total.replace("₹", "") : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeHandler("total", e.target.value)
                }
              />
            </div>

            <div className="col-6">
              <label>Required date</label>
              <Calendar
                value={selectedRow.date ? new Date(selectedRow.date) : null}
                onChange={(e: any) =>
                  onChangeHandler("date", e.value?.toLocaleDateString() || "")
                }
                dateFormat="dd/mm/yy"
              />
            </div>

            <div className="col-12">
              <label>Justification</label>
              <InputTextarea
                rows={3}
                value={selectedRow.justification}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  onChangeHandler("justification", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Dashboard;
