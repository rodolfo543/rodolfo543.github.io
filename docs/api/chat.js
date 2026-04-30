// api/chat.js — Vercel Serverless Function
// Lê chunks.json do disco, faz busca por palavras-chave e chama a Groq.
// Nenhum banco de dados necessário.
//
// Variável de ambiente necessária no Vercel:
//   GROQ_API_KEY

import fs from "fs";
import path from "path";

// Carrega os chunks uma vez por instância (cache em memória)
let _chunks = null;
function carregarChunks() {
  if (_chunks) return _chunks;
  const filePath = path.join(process.cwd(), "chunks.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _chunks = JSON.parse(raw);
  return _chunks;
}

// Busca por palavras-chave — ranqueia chunks pelo número de matches
function buscar(pergunta, limite = 6) {
  const chunks = carregarChunks();

  // Remove palavras curtas e stopwords simples
  const stopwords = new Set(["de","da","do","das","dos","em","no","na","nos","nas",
    "e","a","o","as","os","um","uma","que","para","com","por","se","ou","ao","aos"]);

  const palavras = pergunta
    .toLowerCase()
    .replace(/[^a-záàãâéêíóõôúç\s]/gi, " ")
    .split(/\s+/)
    .filter(p => p.length > 2 && !stopwords.has(p));

  if (palavras.length === 0) return [];

  const ranqueados = chunks.map(chunk => {
    const texto = chunk.conteudo.toLowerCase();
    const score = palavras.reduce((acc, palavra) => {
      const regex = new RegExp(palavra, "g");
      const matches = (texto.match(regex) || []).length;
      return acc + matches;
    }, 0);
    return { ...chunk, score };
  });

  return ranqueados
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { pergunta, historico = [] } = req.body;

  if (!pergunta || pergunta.trim().length < 3) {
    return res.status(400).json({ erro: "Pergunta muito curta." });
  }

  // 1. Busca trechos relevantes no chunks.json
  let chunks;
  try {
    chunks = buscar(pergunta);
  } catch (err) {
    console.error("Erro ao ler chunks.json:", err);
    return res.status(500).json({ erro: "Erro interno ao buscar nos documentos." });
  }

  const contexto =
    chunks.length > 0
      ? chunks.map(c => `[Documento: ${c.arquivo}]\n${c.conteudo}`).join("\n\n---\n\n")
      : "Nenhum trecho relevante encontrado nos documentos para essa pergunta.";

  // 2. Chama a Groq
  let groqData;
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado nos contratos, aditamentos e documentos financeiros da AXS Energia.
Responda de forma clara e objetiva, baseando-se EXCLUSIVAMENTE nos trechos de documentos fornecidos abaixo.
Se a informação não estiver nos documentos, diga claramente que não encontrou essa informação.
Não invente dados, cláusulas ou valores. Quando citar informações, mencione o nome do documento de origem.

TRECHOS RELEVANTES DOS DOCUMENTOS:
${contexto}`,
          },
          ...historico,
          { role: "user", content: pergunta },
        ],
      }),
    });

    groqData = await groqRes.json();
  } catch (err) {
    console.error("Erro ao chamar Groq:", err);
    return res.status(500).json({ erro: "Erro ao consultar a IA." });
  }

  const resposta = groqData?.choices?.[0]?.message?.content ?? "Sem resposta.";
  return res.status(200).json({ resposta });
}
