import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { description, category } = req.body;

  if (!description || !process.env.API_KEY) {
    return res.status(400).json({ error: 'Missing description or API Key' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash";

    const prompt = `
      You are an expert technical architect and productivity consultant.
      
      User Project Description: "${description}"
      Category: ${category}
      
      Your Goal:
      Generate a "Recommended Stack" consisting of curated tools grouped by functional categories required to complete this project.
      
      1. **Project Summary**: 1-2 sentences clarifying the project.
      2. **Grouped Tool Categories**: Create relevant groups based on the project needs.
         - Typical groups: Research, Ideation, Creation, Editing, Project Management, Deployment, Analytics, Growth.
         - **MANDATORY**: You MUST include an "Automation" group if applicable, or find tools that speed up the process.
         - For each group:
           - **Name**: e.g., "Content Creation", "Workflow Automation".
           - **Purpose**: One short sentence explaining why this group exists for this project.
           - **Tools**: Up to 5 high-quality, modern tools.
      3. **Tool Details**: For EVERY tool, provide:
         - **Role**: One short sentence on what role it plays.
         - **URL**: Link to the home page.
         - **Instructions**:
            - *Setup*: 2-5 actionable setup steps.
            - *Usage*: 3-6 specific workflow steps for this project.
      
      Return the response in strict JSON format.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectSummary: { type: Type.STRING },
            toolGroups: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  groupName: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  tools: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        url: { type: Type.STRING },
                        instructions: {
                          type: Type.OBJECT,
                          properties: {
                            setupSteps: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                            },
                            usageSteps: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                            }
                          },
                          required: ["setupSteps", "usageSteps"]
                        }
                      },
                      required: ["name", "role", "url", "instructions"]
                    }
                  }
                },
                required: ["groupName", "purpose", "tools"]
              }
            }
          },
          required: ["projectSummary", "toolGroups"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}