/* eslint-disable @typescript-eslint/no-explicit-any */

import SPServices from "../CommonServices/SPServices";
// import { API_KEY, DEPLOYMENT_NAME, ENDPOINT } from "../config/config";

/**
 * Generic Azure OpenAI caller
 */
const callAI = async (prompt: string): Promise<string> => {
  try {
    const AzureOpenAiDetails = await SPServices.SPReadItems({
      Listname: "OpenAIKeys",
    });

    if (!AzureOpenAiDetails.length)
      throw new Error("No Azure OpenAI details found in SharePoint list.");

    const { APIKEY, ENDPOINT, DEPLOYMENTNAME } = AzureOpenAiDetails[0];

    const response = await fetch(
      `${ENDPOINT}/openai/deployments/${DEPLOYMENTNAME}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": APIKEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an intelligent procurement AI assistant helping with purchasing insights and vendor analysis.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 3000,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`OpenAI HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    return result?.choices?.[0]?.message?.content || "No AI response";
  } catch (error) {
    console.error("Azure OpenAI Error:", error);
    return "AI response unavailable.";
  }
};

/**
 * Basic Information AI Insight
 */
// export const getBasicInfoAI = async (data: any): Promise<string> => {
//   const prompt = `
// Analyze the following Purchase Request and provide a short AI overview.

// PR Details
// PR ID: ${data?.prId}
// Item: ${data?.item}
// Quantity: ${data?.quantity}
// Estimated Unit Price: ${data?.estimatedUnitPrice}
// Total Estimated: ${data?.totalEstimated}
// Justification: ${data?.justification}

// Instructions:
// 1. Explain if the estimated price seems reasonable.
// 2. Suggest approval routing if necessary.
// 3. Mention any procurement risk.
// 4. Limit response to 4 bullet points.
// `;

//   return callAI(prompt);
// };

/**
 * Vendor Comparison AI
 */
export const getVendorComparisonAI = async (
  vendors: any[],
): Promise<string> => {
  const prompt = `
You are a Procurement AI Decision Assistant.

Analyze the vendors and recommend the best one.

Vendor Data:
${JSON.stringify(vendors, null, 2)}

Evaluation Criteria:
- Price (lower is better)
- Delivery Time (faster is better)
- Quality Score (higher is better)
- On-Time Delivery (higher percentage is better)

Instructions:
1. Compare all vendors using the criteria above.
2. Select the best vendor.
3. Provide exactly 4 short bullet points explaining the decision.

Response Rules:
- Return ONLY 4 bullet points.
- Each line must start with "•".
- Do NOT use numbers.
- Do NOT return JSON.
- Do NOT include Id or any object.
- Separate each bullet using \\n.

Example Format:

• Vendor 02 has the lowest price among all vendors
• Both vendors have the same quality score
• Both vendors have the same on-time delivery score
• Vendor 02 is the best choice based on price advantage
`;

  return callAI(prompt);
};

/**
 * Invoice Extraction AI (optional future use)
 */
// export const extractInvoiceAI = async (
//   invoiceText: string,
// ): Promise<string> => {
//   const prompt = `
// Extract structured invoice details from the text below.

// Return ONLY valid JSON with the following format:

// {
// "InvoiceNo":"",
// "InvoiceDate":"",
// "CustomerName":"",
// "DueDate":"",
// "TotalAmount":0,
// "Items":[
// {
// "Product":"",
// "Quantity":0,
// "UnitPrice":0,
// "TotalPrice":0
// }
// ]
// }

// Text:
// ${invoiceText}
// `;

//   return callAI(prompt);
// };
