import { GoogleGenAI, Type } from "@google/genai";

export const getFinancialInsight = async (amount: number, currency: string) => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing.");
    return { text: "API Key 缺失，无法生成洞察。", items: [] };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    我今天到目前为止通过上班赚了 ${currency}${amount.toFixed(2)}。
    
    1. 请用中文给我一个风趣、略带讽刺或非常热情的评价（针对这个金额）。
    2. 列出3个在这个金额下（一般物价），我具体能买到的实物（中文）。
    
    请返回 JSON 格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            items: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["text", "items"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "就连 AI 都对你的巨额财富感到无语了。",
      items: ["神秘盲盒", "隐形斗篷", "空气吉他"]
    };
  }
};