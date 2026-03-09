/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_KEY, DEPLOYMENT_NAME, ENDPOINT } from "../config/config";

/**
 * Generic Azure OpenAI caller
 */
const callAI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      `${ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=2025-01-01-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
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
export const getBasicInfoAI = async (data: any): Promise<string> => {
  const prompt = `
Analyze the following Purchase Request and provide a short AI overview.

PR Details
PR ID: ${data?.prId}
Item: ${data?.item}
Quantity: ${data?.quantity}
Estimated Unit Price: ${data?.estimatedUnitPrice}
Total Estimated: ${data?.totalEstimated}
Justification: ${data?.justification}

Instructions:
1. Explain if the estimated price seems reasonable.
2. Suggest approval routing if necessary.
3. Mention any procurement risk.
4. Limit response to 4 bullet points.
`;

  return callAI(prompt);
};

/**
 * Vendor Comparison AI
 */
export const getVendorComparisonAI = async (
  vendors: any[],
): Promise<string> => {
  const prompt = `
You are a procurement AI decision assistant.

Compare the vendors below and recommend the best option.

Vendor Data:
${JSON.stringify(vendors)}

Rules:
1. Consider price, delivery time, quality score and on-time delivery.
2. Identify the best vendor.
3. Explain your recommendation in 4 short bullet points.
`;

  return callAI(prompt);
};

/**
 * Invoice Extraction AI (optional future use)
 */
export const extractInvoiceAI = async (
  invoiceText: string,
): Promise<string> => {
  const prompt = `
Extract structured invoice details from the text below.

Return ONLY valid JSON with the following format:

{
"InvoiceNo":"",
"InvoiceDate":"",
"CustomerName":"",
"DueDate":"",
"TotalAmount":0,
"Items":[
{
"Product":"",
"Quantity":0,
"UnitPrice":0,
"TotalPrice":0
}
]
}

Text:
${invoiceText}
`;

  return callAI(prompt);
};
