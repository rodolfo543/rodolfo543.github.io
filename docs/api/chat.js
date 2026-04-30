// api/chat.js — CommonJS (sem necessidade de package.json)
const fs = require("fs");
const path = require("path");

let _chunks = null;
function carregarChunks() {
  if (_chunks) return _chunks;
  const filePath = path.join(__dirname, "chunks.json");
  _chunks = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return _chunks;
}

function buscar(pergunta, limite = 6) {
  const chunks = carregarChunks();
  const stopwords = new Set(["de","da","do","das","dos","em","no","na","nos","nas",
    "e","a","o","as","os","um","uma","que","para","com","por","se","ou","ao","aos"]);
  const palavras = pergunta
    .toLowerCase()
    .replace(/[^a-záàãâéêíóõôúç\s]/gi, " ")
    .split(/\s+/)
    .filter(p => p.length > 2 && !stopwords.has(p));

  if (palavras.length === 0) return [];

  return chunks
    .map(chunk => {
      const texto = chunk.conteudo.toLowerCase();
      const score = palavras.reduce((acc, palavra) => {
        return acc + (texto.match(new RegExp(palavra, "g")) || []).length;
      }, 0);
      return { ...chunk, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite);
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { pergunta, historico = [] } = req.body;
  if (!pergunta || pergunta.trim().length < 3) {
    return res.status(400).json({ erro: "Pergunta muito curta." });
  }

  let chunks = [];
  try {
    chunks = buscar(pergunta);
  } catch (err) {
    console.error("Erro ao ler chunks.json:", err.message);
    return res.status(500).json({ erro: "Erro ao ler documentos. Verifique se chunks.json existe." });
  }

  const contexto = chunks.length > 0
    ? chunks.map(c => `[Documento: ${c.arquivo}]\n${c.conteudo}`).join("\n\n---\n\n")
    : "Nenhum trecho relevante encontrado.";

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
Responda de forma clara e objetiva, baseando-se EXCLUSIVAMENTE nos trechos de documentos fornecidos.
Se a informação não estiver nos documentos, diga claramente. Não invente dados ou valores.
Mencione o nome do documento de origem quando citar informações.

TRECHOS DOS DOCUMENTOS:
${contexto}`
          },
          ...historico,
          { role: "user", content: pergunta }
        ]
      })
    });

    const groqData = await groqRes.json();
    if (!groqRes.ok) {
      console.error("Groq error:", JSON.stringify(groqData));
      return res.status(500).json({ erro: "Erro ao consultar a IA." });
    }

    const resposta = groqData?.choices?.[0]?.message?.content ?? "Sem resposta.";
    return res.status(200).json({ resposta });

  } catch (err) {
    console.error("Erro fetch Groq:", err.message);
    return res.status(500).json({ erro: "Erro de conexão com a IA." });
  }
};
