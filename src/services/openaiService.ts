import OpenAI from 'openai';
import type { PlacaVideo } from '../types/PlacaVideo.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function processarDadosPlacas(dadosRaw: string): Promise<PlacaVideo[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em extração de dados de produtos de hardware. 
          Analise os dados fornecidos e extraia informações sobre placas de vídeo NVIDIA.
          Para cada placa encontrada, extraia: modelo, preço, quantidade de RAM e tipo de GDDR.
          
          Regras importantes:
          - Se não conseguir identificar algum campo, use "N/A"
          - Preços devem manter o formato original (ex: "R$ 1.299,99")
          - RAM deve incluir a unidade (ex: "8GB", "16GB")
          - GDDR deve ser o tipo específico (ex: "GDDR6", "GDDR6X")
          - Modelo deve ser o nome completo da placa`
        },
        {
          role: "user",
          content: `Extraia os dados das placas de vídeo NVIDIA dos seguintes dados:

${dadosRaw}

Retorne apenas um array JSON com os objetos das placas encontradas.`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "placas_video",
          strict: true,
          schema: {
            type: "object",
            properties: {
              placas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    modelo: { type: "string" },
                    preco: { type: "string" },
                    ram: { type: "string" },
                    gddr: { type: "string" }
                  },
                  required: ["modelo", "preco", "ram", "gddr"],
                  additionalProperties: false
                }
              }
            },
            required: ["placas"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia da OpenAI');
    }

    const resultado = JSON.parse(content);
    if (resultado && typeof resultado === 'object' && Array.isArray(resultado.placas)) {
      return resultado.placas;
    }
    return [];

  } catch (error) {
    console.error('Erro ao processar dados com OpenAI:', error);
    throw error;
  }
}
