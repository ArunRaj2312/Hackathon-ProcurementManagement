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
export const getBasicInfoAI = async (vendors: any[]): Promise<string> => {
  const prompt = `
You are a Procurement AI Decision Assistant.

Analyze the purchase request vendor data and generate procurement insights.

Vendor Data:
${JSON.stringify(vendors, null, 2)}

Tasks:
1. Compare vendor prices.
2. Identify the lowest price vendor.
3. Estimate the average vendor price.
4. Determine whether the selected vendor price is higher or lower than the average.
5. Provide procurement insights.

Insight Rules:
- Generate exactly 3–4 short insights.
- Each insight should contain a short title and one brief explanation.
- Mention key values like amount, averages, or comparisons.
- Keep each explanation short (1–2 sentences).

Topics to cover if possible:
• Approval routing based on total amount range
• Price intelligence using last 6 months comparison
• Whether the estimate is higher or lower than historical average
• Procurement recommendation or warning

Response Format Example:

Approval Routing Update  
Since the total amount falls between ₹5L–₹25L, this PR should be routed to the Procurement Manager.

📊 Price Intelligence Insight  
Based on vendor data and recent purchases, the estimated price is close to the average market price.

⚠ Price Deviation Alert  
The current estimate is slightly higher than the historical average for similar purchases.

Recommendation  
Review pricing before approval to ensure cost optimization.

Rules:
- Do NOT return JSON.
- Do NOT return bullet numbers.
- Keep the response concise.
- Separate each insight with a new line.
`;

  return callAI(prompt);
};

/**
 * Vendor Comparison AI
 */
export const getVendorComparisonAI = async (data: any[]): Promise<string> => {
  const prompt = `
You are an AI Procurement Analyst.

Analyze the following vendor comparison data for a Purchase Request and determine the best vendor based on pricing, delivery time, reliability, and certifications.

Vendor Data:
${JSON.stringify(data, null, 2)}

Instructions:
1. Identify the best vendor using multi-criteria analysis.
2. Compare price with the average vendor price.
3. Check if delivery time meets the requirement.
4. Mention supplier reliability (on-time delivery rate).
5. Highlight important certifications or compliance.
6. Keep the response concise.

Output Format (strictly follow this format):

Vendor <Number> is the optimal choice based on multi-criteria analysis.
• Competitive pricing (₹<price> vs avg ₹<average_price>)
• Delivery within requirement (<delivery_days> days)
• Strong on-time delivery record (<on_time_rate>%)
• Relevant certifications (<certification list>)

Do not add explanations outside this format.
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
