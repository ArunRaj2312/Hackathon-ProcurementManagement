import { ProcurementFormData } from "./interface";

export const API_KEY = "51dba10bffe44152968d18f9cd135e85";
export const ENDPOINT = "https://yasazureopenai.openai.azure.com/";

export const DEPLOYMENT_NAME = "gpt-4o-mini";
export const newData: ProcurementFormData = {
  ActiveTab: 1,
  basicInformation: {
    id: "",
    prId: "",
    item: "",
    quantity: "",
    estimatedUnitPrice: "",
    totalEstimated: "",
    requiredDate: "",
    justification: "",
    requestedBy: "",
    employeeId: "",
    designation: "",
    location: "",
    requesterRequiredDate: "",
  },
  vendorComparison: {
    vendors: [],
  },
  approval: {
    selectedVendor: {
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
      prId: "",
      item: "",
      quantity: "",
      totalAmount: "",
    },
    comments: "",
  },
  purchaseOrder: {
    poNumber: "",
    issueDate: "",
    vendor: { name: "", code: "" },
    deliveryDate: "",
    paymentTerms: "",
    lineItems: [
      {
        description: "",
        quantity: "",
        unitPrice: "",
        amount: "",
      },
    ],
  },
  invoice: {
    invoiceNumber: "",
    invoiceDate: "",
    vendor: "",
    vendorCode: "",
    gstNumber: "",
    amount: "",
    dueDate: "",
  },
};
