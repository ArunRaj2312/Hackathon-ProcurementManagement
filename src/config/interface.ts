export interface ViewScoreBreakdown {
  priceCompetitiveness: string;
  deliveryTimeline: string;
  HistoricalPerformance: string;
  qualityCertification: string;
}

export interface Vendor {
  id: string;
  unit: string;
  days: string;
  finalScore: string;
  ontimeDelivery: string;
  qualityScore: string;
  aiRecommeded: boolean;
  selected: boolean;
  viewScoreBreakdown: ViewScoreBreakdown;
}

export interface BasicInformation {
  id: string | number;
  prId: string;
  item: string;
  quantity: string;
  estimatedUnitPrice: string;
  totalEstimated: string;
  requiredDate: string;
  justification: string;
  requestedBy: string;
  employeeId: string;
  designation: string;
  location: string;
  requesterRequiredDate: string;
}

export interface VendorComparison {
  vendors: Vendor[];
}

export interface Approval {
  selectedVendor: Vendor;
  purchaseSummary: {
    prId: string;
    item: string;
    quantity: string;
    unitPrice: string;
    requiredDate: string;
    submissionDate: string;
    totalAmount: string;
  };
  comments: string;
}

export interface PurchaseOrderLineItem {
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
}

export interface PurchaseOrder {
  poNumber: string;
  prId?: string;
  issueDate: string;
  vendor: {
    name: string;
    code: string;
    gstNumber?: string;
    address?: string;
    contactPerson?: string;
  };
  deliveryDate: string;
  paymentTerms: string;
  lineItems: PurchaseOrderLineItem[];
  subTotal?: string;
  cgst?: string;
  sgst?: string;
  totalAmount?: string;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  vendor: string;
  vendorCode: string;
  gstNumber: string;
  amount: string;
  dueDate: string;
}

export interface ProcurementFormData {
  ActiveTab: number;
  basicInformation: BasicInformation;
  vendorComparison: VendorComparison;
  approval: Approval;
  purchaseOrder: PurchaseOrder;
  invoice: Invoice;
}
