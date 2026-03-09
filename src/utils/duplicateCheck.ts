/* eslint-disable @typescript-eslint/no-explicit-any */
interface Invoice {
  InvoiceNo: string;
  TotalAmount: number;
  [key: string]: any;
}

export const checkDuplicateInvoice = (
  newInvoice: Invoice,
  existingInvoices: Invoice[],
): Invoice | undefined => {
  return existingInvoices.find(
    (inv) =>
      inv.InvoiceNo === newInvoice.InvoiceNo &&
      inv.TotalAmount === newInvoice.TotalAmount,
  );
};
