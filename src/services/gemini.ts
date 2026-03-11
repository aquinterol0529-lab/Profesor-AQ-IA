import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CourseInput, CourseData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Título atractivo del curso" },
    description: { type: Type.STRING, description: "Descripción corta (2-3 frases)" },
    level: { type: Type.STRING },
    duration: { type: Type.STRING },
    targetProfile: { type: Type.STRING },
    learningObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-7 objetivos de aprendizaje"
    },
    units: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING, description: "Título atractivo de la unidad" },
          summary: { type: Type.STRING, description: "Frase resumen muy clara" },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                keyIdea: { type: Type.STRING, description: "Explicación de 4-8 frases" },
                appliedExample: { type: Type.STRING, description: "Ejemplo aplicado a la realidad" },
                practicalActivity: { type: Type.STRING, description: "Consigna clara para actividad práctica" },
                quickTest: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Exactamente 4 opciones"
                      },
                      correctAnswerIndex: { type: Type.INTEGER, description: "Índice de la respuesta correcta (0-3)" }
                    },
                    required: ["question", "options", "correctAnswerIndex"]
                  },
                  description: "3 preguntas tipo test"
                }
              },
              required: ["title", "keyIdea", "appliedExample", "practicalActivity", "quickTest"]
            }
          }
        },
        required: ["title", "summary", "lessons"]
      },
      description: "4 a 6 unidades o rutas de aprendizaje"
    },
    finalEvaluation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctAnswerIndex: { type: Type.INTEGER }
        },
        required: ["question", "options", "correctAnswerIndex"]
      },
      description: "5-8 preguntas sobre todo el temario"
    },
    finalProjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      },
      description: "2 propuestas de proyecto práctico"
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING }
        },
        required: ["title", "url"]
      },
      description: "Lista de fuentes reales usadas (libros, webs, artículos)"
    }
  },
  required: [
    "title", "description", "level", "duration", "targetProfile",
    "learningObjectives", "units", "finalEvaluation", "finalProjects", "sources"
  ]
};

export async function generateCourse(input: CourseInput): Promise<CourseData> {
  const COURSE_BUILDER_PROMPT = `
Actúa como un profesor experto y diseñador instruccional senior en el tema indicado.
Tu objetivo es diseñar un CURSO COMPLETO estructurado para un Aula Virtual.

DATOS DEL CURSO:
- Tema: ${input.tema}
- Nivel del alumno: ${input.nivel}
- Perfil del alumno: ${input.perfil}
- Objetivo principal: ${input.objetivo}
- Tiempo disponible: ${input.tiempo}
- Formato preferido: ${input.formato}

INSTRUCCIONES:
1. Adapta la dificultad, profundidad y número de unidades al NIVEL, PERFIL, OBJETIVO y TIEMPO disponible.
2. Utiliza un tono didáctico, cercano y claro. Evita párrafos gigantes; usa frases cortas y bien puntuadas.
3. Si el tema es complejo, utiliza analogías y ejemplos intuitivos sin perder rigor.
4. NO hables de "modelo" ni de "IA". Exprésate como un profesor humano experto.
5. El idioma SIEMPRE debe ser español latino (Venezuela).
6. Genera de 4 a 6 unidades. Cada unidad debe tener entre 2 y 4 lecciones.
7. Para cada lección, genera:
   - Idea clave: Explicación de 4-8 frases.
   - Ejemplo aplicado: Cómo se ve ese concepto en la realidad.
   - Actividad práctica: Consigna clara para hacer en la vida real o un pequeño ejercicio.
   - Test rápido: 3 preguntas tipo test con 4 opciones.
8. Genera una evaluación final de 5-8 preguntas.
9. Genera 2 propuestas de proyecto final.
10. Incluye fuentes reales basadas en tu conocimiento y búsqueda.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: COURSE_BUILDER_PROMPT,
    config: {
      responseMimeType: "application/json",
      responseSchema: courseSchema,
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No se recibió respuesta del modelo.");
  }

  return JSON.parse(text) as CourseData;
}
