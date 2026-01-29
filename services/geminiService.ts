
import { GoogleGenAI } from "@google/genai";
import { Stats, Subject, Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMentorshipAdvice = async (stats: Stats, subjects: Subject[], tasks: Task[]) => {
  try {
    const prompt = `
      Aja como um mentor especializado em concursos públicos.
      Analise o desempenho atual do aluno:
      - Percentual de Execução: ${stats.executionRate.toFixed(1)}%
      - Aproveitamento (Acerto de Questões): ${stats.accuracyRate.toFixed(1)}%
      - Metas Cumpridas: ${stats.goalFulfillment.toFixed(1)}%

      Matérias sendo estudadas: ${subjects.map(s => s.name).join(', ')}.

      Com base nestes dados e considerando que as tarefas são blocos de 30-45 min, forneça:
      1. Um diagnóstico rápido.
      2. Uma dica prática para aumentar o aproveitamento na matéria com menor performance aparente.
      3. Uma frase de motivação curta.

      Responda em Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar conselhos no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o foco! Analisaremos seus dados detalhadamente em breve.";
  }
};
