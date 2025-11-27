import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getGeminiChatResponse = async (history: string[], userMessage: string): Promise<string> => {
  if (!apiKey) return "Erro: Chave de API não configurada.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Você é um assistente de suporte útil e amigável para um aplicativo de táxi chamado 'Yango Angola'. 
          Responda em Português de Angola. Seja conciso.
          Histórico da conversa: ${history.join('\n')}
          Usuário: ${userMessage}` }]
        }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Estamos enfrentando dificuldades técnicas. Tente novamente mais tarde.";
  }
};

export const analyzeRideRequest = async (origin: string, destination: string): Promise<string> => {
   if (!apiKey) return "Informação indisponível.";
   
   try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Gere uma curiosidade curta ou dica de trânsito em Luanda, Angola, para uma viagem de ${origin} para ${destination}. Máximo 1 frase.`,
     });
     return response.text || "Boa viagem!";
   } catch (e) {
     return "Viaje com segurança!";
   }
}
