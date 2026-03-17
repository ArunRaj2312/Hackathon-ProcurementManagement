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
You are an intelligent Procurement AI Assistant.
 
Analyze the purchase request vendor data and generate procurement insights for the buyer.
 
Vendor Data:
${JSON.stringify(vendors, null, 2)}
 
Your task:
Carefully analyze vendor prices, historical comparison, and approval requirements.
 
Generate EXACTLY 4 procurement insights.
 
Each insight must contain:
• A short title
• One concise explanation (1–2 sentences)
• Mention important numbers such as ₹ amount, averages, or thresholds
 
Topics you MUST cover:
 
1️⃣ Approval Routing  
Determine the correct approval authority based on total purchase value.
 
Rules:
- If amount > ₹250,000 → Procurement Manager approval required
- Mention the total amount in ₹
 
2️⃣ 📊 Price Intelligence Insight  
Compare the selected vendor price with vendor pricing patterns from the last 6 months.
 
3️⃣ ⚠ Price Deviation Alert  
Explain whether the selected vendor price is higher or lower than the historical average for similar purchases.
 
4️⃣ Recommendation  
Provide a short procurement recommendation (ex: negotiation, alternative vendors, proceed approval).
 
STRICT RESPONSE FORMAT:
 
Approval Routing Update  
Explain the approval requirement based on the ₹ amount and approval threshold.
 
📊 Price Intelligence Insight  
Explain how the current price compares with vendor pricing from the last 6 months.
 
⚠ Price Deviation Alert  
State whether the price is higher or lower than the historical average.
 
Recommendation  
Provide a short procurement recommendation.
 
Important Rules:
- Do NOT return JSON
- Do NOT return numbered lists
- Do NOT add extra sections
- Keep explanations concise
- Separate each section with one blank line
- Always include ₹ values when mentioning price
 
Example Output Style:
 
Approval Routing Update  
The total amount of ₹400,000 requires routing to the Procurement Manager for approval as it exceeds the ₹250,000 threshold.
 
📊 Price Intelligence Insight  
The current vendor price of ₹400,000 is within the expected range based on the last 6 months of vendor pricing data.
 
⚠ Price Deviation Alert  
This price is higher than the historical average for similar purchases, indicating a potential need for negotiation.
 
Recommendation  
Consider evaluating alternative vendors to ensure competitive pricing before finalizing the purchase.
`;

  return callAI(prompt);
};

/**
 * Vendor Comparison AI
 */
// export const getVendorComparisonAI = async (data: any[]): Promise<string> => {
//   const prompt = `
// You are an AI Procurement Analyst.

// Analyze the following vendor comparison data for a Purchase Request and determine the best vendor based on pricing, delivery time, reliability, and certifications.

// Vendor Data:
// ${JSON.stringify(data, null, 2)}

// Instructions:
// 1. Identify the best vendor using multi-criteria analysis.
// 2. Compare price with the average vendor price.
// 3. Check if delivery time meets the requirement.
// 4. Mention supplier reliability (on-time delivery rate).
// 5. Highlight important certifications or compliance.
// 6. Keep the response concise.

// Output Format (strictly follow this format):

// Vendor <Number> is the optimal choice based on multi-criteria analysis.
// • Competitive pricing (₹<price> vs avg ₹<average_price>)
// • Delivery within requirement (<delivery_days> days)
// • Strong on-time delivery record (<on_time_rate>%)
// • Relevant certifications (<certification list>)

// Do not add explanations outside this format.
// `;

//   return callAI(prompt);
// };

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
