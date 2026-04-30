// api/chat.js — CommonJS
const fs = require("fs");
const path = require("path");

let _chunks = null;

function carregarChunks() {
  if (_chunks) return _chunks;

  // Deixe uma cópia do chunks.json dentro da pasta /api
  const filePath = path.join(__dirname, "chunks.json");

  _chunks = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return _chunks;
}

function normalizarPergunta(pergunta) {
  let q = String(pergunta || "").toLowerCase();

  const expansoes = {
    "termina": "termina vencimento data de vencimento prazo final",
    "terminar": "terminar vencimento data de vencimento prazo final",
    "vence": "vence vencimento data de vencimento",
    "vencer": "vencer vencimento data de vencimento",
    "fim": "fim vencimento data de vencimento prazo final",

    "axs 01": "axs 01 unidade 01 axs energia unidade 01",
    "axs01": "axs 01 unidade 01 axs energia unidade 01",
    "unidade 01": "unidade 01 axs energia unidade 01",

    "axs 02": "axs 02 unidade 02 axs energia unidade 02",
    "axs02": "axs 02 unidade 02 axs energia unidade 02",
    "unidade 02": "unidade 02 axs energia unidade 02",

    "axs 03": "axs 03 unidade 03 axs energia unidade 03",
    "axs03": "axs 03 unidade 03 axs energia unidade 03",
    "unidade 03": "unidade 03 axs energia unidade 03",

    "axs 04": "axs 04 unidade 04 axs energia unidade 04",
    "axs04": "axs 04 unidade 04 axs energia unidade 04",
    "unidade 04": "unidade 04 axs energia unidade 04",

    "axs 05": "axs 05 unidade 05 axs energia unidade 05",
    "axs05": "axs 05 unidade 05 axs energia unidade 05",
    "unidade 05": "unidade 05 axs energia unidade 05",

    "axs 06": "axs 06 unidade 06 axs energia unidade 06",
    "axs06": "axs 06 unidade 06 axs energia unidade 06",
    "unidade 06": "unidade 06 axs energia unidade 06",

    "axs 07": "axs 07 unidade 07 axs energia unidade 07",
    "axs07": "axs 07 unidade 07 axs energia unidade 07",
    "unidade 07": "unidade 07 axs energia unidade 07",

    "axs 08": "axs 08 unidade 08 axs energia unidade 08",
    "axs08": "axs 08 unidade 08 axs energia unidade 08",
    "unidade 08": "unidade 08 axs energia unidade 08",

    "axs 09": "axs 09 unidade 09 axs energia unidade 09",
    "axs09": "axs 09 unidade 09 axs energia unidade 09",
    "unidade 09": "unidade 09 axs energia unidade 09",

    "axs 10": "axs 10 unidade 10 axs energia unidade 10 axs energia ufv goias axs goias",
    "axs10": "axs 10 unidade 10 axs energia unidade 10 axs energia ufv goias axs goias",
    "unidade 10": "unidade 10 axs energia unidade 10",

    "axs goias": "axs goias axs energia ufv goias senior debenture senior",
    "axs goiás": "axs goias axs energia ufv goias senior debenture senior",
    "goias": "goias axs energia ufv goias senior debenture senior",
    "goiás": "goias axs energia ufv goias senior debenture senior",

    "senior": "senior sênior debenture senior axs goias axs energia ufv goias",
    "sênior": "senior sênior debenture senior axs goias axs energia ufv goias",
    "mezanino": "mezanino mesanino debenture mezanino axs energia unidade 10 cdi",
    "mesanino": "mezanino mesanino debenture mezanino axs energia unidade 10 cdi",

    "garantia": "garantia garantias fianca fiança alienacao fiduciaria alienação fiduciária cessao fiduciaria cessão fiduciária",
    "garantias": "garantia garantias fianca fiança alienacao fiduciaria alienação fiduciária cessao fiduciaria cessão fiduciária",

    "juros": "juros remuneratorios juros remuneratórios remuneracao remuneração taxa",
    "taxa": "taxa juros remuneratorios juros remuneratórios remuneracao remuneração",
    "ipca": "ipca atualizacao monetaria atualização monetária indice nacional preços consumidor amplo",
    "cdi": "cdi di taxa di remuneracao remuneração",

    "valor": "valor valor total emissão emissao valor nominal quantidade debentures debêntures",
    "emissão": "emissão emissao valor total emissão valor nominal quantidade debentures debêntures",
    "emissao": "emissão emissao valor total emissão valor nominal quantidade debentures debêntures",

    "amortização": "amortização amortizacao pagamento cronograma anexo fluxo",
    "amortizacao": "amortização amortizacao pagamento cronograma anexo fluxo",
    "pagamento": "pagamento data de pagamento juros amortização amortizacao cronograma",
    "fundo": "fundo liquidez fundo de obras fundo de reserva obras",
    "liquidez": "fundo de liquidez valor minimo fundo de liquidez valor mínimo"
  };

  for (const [termo, extra] of Object.entries(expansoes)) {
    if (q.includes(termo)) {
      q += " " + extra;
    }
  }

  return q;
}

function detectarOperacao(pergunta) {
  const q = String(pergunta || "").toLowerCase();

  const operacoes = [
    { termos: ["axs 01", "axs01", "unidade 01"], bonus: ["unidade 01", "axs energia unidade 01"] },
    { termos: ["axs 02", "axs02", "unidade 02"], bonus: ["unidade 02", "axs energia unidade 02"] },
    { termos: ["axs 03", "axs03", "unidade 03"], bonus: ["unidade 03", "axs energia unidade 03"] },
    { termos: ["axs 04", "axs04", "unidade 04"], bonus: ["unidade 04", "axs energia unidade 04"] },
    { termos: ["axs 05", "axs05", "unidade 05"], bonus: ["unidade 05", "axs energia unidade 05"] },
    { termos: ["axs 06", "axs06", "unidade 06"], bonus: ["unidade 06", "axs energia unidade 06"] },
    { termos: ["axs 07", "axs07", "unidade 07"], bonus: ["unidade 07", "axs energia unidade 07"] },
    { termos: ["axs 08", "axs08", "unidade 08"], bonus: ["unidade 08", "axs energia unidade 08"] },
    { termos: ["axs 09", "axs09", "unidade 09"], bonus: ["unidade 09", "axs energia unidade 09"] },
    { termos: ["axs 10", "axs10", "unidade 10"], bonus: ["unidade 10", "axs energia unidade 10", "axs energia ufv goias"] },
    { termos: ["axs goias", "axs goiás", "goias", "goiás"], bonus: ["axs energia ufv goias", "axs goias"] }
  ];

  return operacoes.find(op => op.termos.some(t => q.includes(t))) || null;
}

function buscar(pergunta, limite = 8) {
  const chunks = carregarChunks();

  const stopwords = new Set([
    "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas",
    "e", "a", "o", "as", "os", "um", "uma", "que", "para", "com", "por",
    "se", "ou", "ao", "aos", "qual", "quais", "quando", "onde", "como",
    "sobre", "me", "diga", "fale", "favor", "oi", "oie", "tudo", "bem"
  ]);

  const perguntaOriginal = String(pergunta || "").toLowerCase();
  const perguntaExpandida = normalizarPergunta(pergunta);
  const operacao = detectarOperacao(pergunta);

  const palavras = perguntaExpandida
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .split(/\s+/)
    .filter(p => p.length > 2 && !stopwords.has(p));

  if (palavras.length === 0) return [];

  return chunks
    .map(chunk => {
      const textoOriginal = `${chunk.arquivo || ""} ${chunk.conteudo || ""}`.toLowerCase();
      const texto = textoOriginal
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      let score = 0;

      for (const palavra of palavras) {
        const segura = palavra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(segura, "g");
        const ocorrencias = texto.match(regex) || [];
        score += ocorrencias.length;
      }

      if (operacao) {
        for (const termo of operacao.bonus) {
          const termoNorm = termo
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          if (texto.includes(termoNorm)) score += 35;
        }
      }

      if (
        perguntaOriginal.includes("termina") ||
        perguntaOriginal.includes("vence") ||
        perguntaOriginal.includes("vencimento") ||
        perguntaOriginal.includes("fim")
      ) {
        if (texto.includes("data de vencimento")) score += 40;
        if (texto.includes("prazo de vigencia")) score += 25;
        if (texto.includes("vencimento")) score += 15;
      }

      if (
        perguntaOriginal.includes("garantia") ||
        perguntaOriginal.includes("garantias") ||
        perguntaOriginal.includes("fiança") ||
        perguntaOriginal.includes("fianca")
      ) {
        if (texto.includes("garantias")) score += 25;
        if (texto.includes("fianca")) score += 20;
        if (texto.includes("alienacao fiduciaria")) score += 20;
        if (texto.includes("cessao fiduciaria")) score += 20;
      }

      if (
        perguntaOriginal.includes("juros") ||
        perguntaOriginal.includes("taxa") ||
        perguntaOriginal.includes("remuneração") ||
        perguntaOriginal.includes("remuneracao")
      ) {
        if (texto.includes("juros remuneratorios")) score += 30;
        if (texto.includes("remuneracao")) score += 20;
        if (texto.includes("cdi")) score += 15;
        if (texto.includes("ipca")) score += 15;
      }

      if (
        perguntaOriginal.includes("valor") ||
        perguntaOriginal.includes("emissão") ||
        perguntaOriginal.includes("emissao") ||
        perguntaOriginal.includes("quanto")
      ) {
        if (texto.includes("valor total da emissao")) score += 35;
        if (texto.includes("valor nominal unitario")) score += 20;
        if (texto.includes("quantidade total de debentures")) score += 20;
      }

      return { ...chunk, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limite);
}

function montarContexto(chunks) {
  if (!chunks || chunks.length === 0) {
    return "Nenhum trecho relevante encontrado.";
  }

  const MAX_CHARS_POR_CHUNK = 3000;

  return chunks
    .map(c => {
      const conteudo = String(c.conteudo || "").slice(0, MAX_CHARS_POR_CHUNK);
      return `[Documento: ${c.arquivo || "Documento sem nome"} | Posição: ${c.posicao ?? "N/A"}]\n${conteudo}`;
    })
    .join("\n\n---\n\n");
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido. Use POST." });
  }

  const { pergunta, historico = [] } = req.body || {};

  if (!pergunta || pergunta.trim().length < 1) {
    return res.status(400).json({ erro: "Pergunta muito curta." });
  }

  let chunks = [];

  try {
    chunks = buscar(pergunta, 8);
  } catch (err) {
    console.error("Erro ao ler chunks.json:", err.message);
    return res.status(500).json({
      erro: "Erro ao ler documentos. Verifique se chunks.json existe dentro da pasta api."
    });
  }

  const contexto = montarContexto(chunks);

  try {
    const aiRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it",
        max_tokens: 900,
        temperature: 0.2,
        top_p: 0.7,
        stream: false,
        messages: [
          {
            role: "system",
            content: `Você é o Assistente AXS, um assistente especializado em dívidas, debêntures, financiamentos, contratos financeiros e documentos de emissão da AXS Energia.

Seu objetivo é ajudar o usuário a:
- entender os documentos das emissões;
- interpretar informações financeiras do site;
- explicar conceitos como PU, saldo devedor, amortização, CDI, IPCA, spread, vencimento, duration, juros remuneratórios, garantias, covenant, ICSD, fundo de liquidez e vencimento antecipado;
- responder perguntas sobre as operações da AXS Energia com base nos trechos recuperados.

REGRAS IMPORTANTES:

1. Responda em português do Brasil, com linguagem clara, objetiva e fácil de entender.

2. Quando a pergunta for sobre dados específicos de uma operação, como valor, taxa, vencimento, garantia, cronograma, cláusula, fundo, amortização ou obrigação contratual, use os trechos recuperados dos documentos, e se não encontrar use seu conhecimento e dados na web sobre as operações, mas diga que é uma informação online.

3. Quando a pergunta for conceitual ou educativa, você pode usar conhecimento financeiro geral para explicar o conceito, mesmo que o termo não apareça nos trechos recuperados.

4. Se usar conhecimento geral, deixe claro que é uma explicação geral e não uma informação específica de uma emissão.

5. Nunca invente dados específicos das operações da AXS. Se os trechos recuperados não trouxerem uma data, valor, taxa, percentual, cláusula ou condição específica, diga que não encontrou essa informação nos trechos recuperados.

6. Sempre que responder com base nos documentos, cite o nome do documento de origem quando possível.

7. Não use Markdown. Não use asteriscos, negrito, títulos com #, listas com *, nem tabelas. Responda em texto simples.

8. Seja útil para alguém da área financeira: além de responder, ajude a interpretar o impacto prático da informação.

TRECHOS DOS DOCUMENTOS:
${contexto}`
          },
          ...historico,
          { role: "user", content: pergunta }
        ]
      })
    });

    const aiData = await aiRes.json();

    if (!aiRes.ok) {
      console.error("NVIDIA error:", JSON.stringify(aiData));
      return res.status(500).json({
        erro: "Erro ao consultar a IA.",
        detalhes: aiData
      });
    }

    const resposta = aiData?.choices?.[0]?.message?.content ?? "Sem resposta.";
    return res.status(200).json({ resposta });

  } catch (err) {
    console.error("Erro fetch NVIDIA:", err.message);
    return res.status(500).json({ erro: "Erro de conexão com a IA." });
  }
};
