
import { GoogleGenAI } from "@google/genai";

// 使用 window.process 以确保在浏览器环境中的安全性
const getApiKey = () => {
  try {
    return (window as any).process?.env?.API_KEY || "";
  } catch {
    return "";
  }
};

export const polishDescription = async (title: string, rawDescription: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return rawDescription;
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `你是一个专业的社交活动组织者。请帮我润色以下活动内容，使其看起来更专业、更有吸引力。保持亲切的语气，使用适当的Emoji。
      
      活动标题: ${title}
      原始描述: ${rawDescription}
      
      请输出润色后的Markdown格式内容。不要包含多余的解释。`,
      config: { temperature: 0.7 },
    });
    return response.text || rawDescription;
  } catch (error) {
    console.error("Gemini Error:", error);
    return rawDescription;
  }
};

export const generateSuccessMessage = async (activityTitle: string) => {
  const apiKey = getApiKey();
  if (!apiKey) return `恭喜！您参与的“${activityTitle}”已拼团成功！`;
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `用户刚刚参加了一个名为“${activityTitle}”的拼团活动并且拼团成功了。请写一条充满喜悦、活泼且温馨的系统通知，通知用户大家已经集齐，活动即将开始。请包含一些相关的Emoji。字数在40字以内。`,
      config: { temperature: 0.9 },
    });
    return response.text?.trim() || `恭喜！您参与的“${activityTitle}”已拼团成功！`;
  } catch (error) {
    return `恭喜！您参与的“${activityTitle}”已拼团成功！`;
  }
};
