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
  // --------------------------------------------------------
  // TEMPO E VENCIMENTO
  // --------------------------------------------------------
  "termina": "termina vencimento data de vencimento prazo final encerramento",
  "terminar": "terminar vencimento data de vencimento prazo final encerramento",
  "vence": "vence vencimento data de vencimento prazo final",
  "vencer": "vencer vencimento data de vencimento prazo final",
  "fim": "fim vencimento data de vencimento prazo final encerramento",
  "prazo": "prazo vencimento data de vencimento duration prazo médio vigência",
  "vigência": "vigencia vigência prazo vencimento duração contrato",
  "vigencia": "vigencia vigência prazo vencimento duração contrato",
  "quando": "quando data prazo vencimento pagamento evento cronograma",
  "próximo": "próximo proximo próximo pagamento próximo pmt data evento calendário",
  "proximo": "próximo proximo próximo pagamento próximo pmt data evento calendário",
  "calendário": "calendario calendário datas eventos pagamentos cronograma",
  "agenda": "agenda calendário datas eventos pagamentos cronograma",

  // --------------------------------------------------------
  // VALORES E MONTANTES
  // --------------------------------------------------------
  "quanto": "quanto valor montante total emissão saldo volume nominal",
  "valor": "valor valor total emissão emissao valor nominal quantidade debentures debêntures volume",
  "montante": "montante valor total emissão volume nominal debentures debêntures",
  "volume": "volume montante valor total emissão quantidade debentures",
  "emissão": "emissão emissao valor total emissão valor nominal quantidade debentures debêntures",
  "emissao": "emissão emissao valor total emissão valor nominal quantidade debentures debêntures",
  "captação": "captacao captação emissão valor total volume recursos",
  "captacao": "captacao captação emissão valor total volume recursos",
  "série": "serie série emissão tranche quantidade debentures",
  "serie": "serie série emissão tranche quantidade debentures",

  // --------------------------------------------------------
  // PU E PRECIFICAÇÃO
  // --------------------------------------------------------
  "pu": "pu preço unitário preco unitario valor nominal unitário valor nominal atualizado vna saldo devedor cotação",
  "preço unitário": "preço unitário preco unitario valor nominal unitário valor nominal atualizado vna",
  "preco unitario": "preço unitário preco unitario valor nominal unitário valor nominal atualizado vna",
  "pu cheio": "pu cheio preco unitario cheio juros acumulados cotação dirty price",
  "pu vazio": "pu vazio preco unitario vazio clean price sem juros corridos",
  "pu juros": "pu juros juros corridos juros acumulados preco unitario juros",
  "pu amort": "pu amort pu amortizacao preco unitario amortizacao",
  "cotação": "cotacao cotação preço unitário pu cheio pu vazio mercado",
  "cotacao": "cotacao cotação preço unitário pu cheio pu vazio mercado",
  "marcação": "marcacao marcação mercado mtm mark to market precificação valor",
  "mtm": "mtm mark to market marcação mercado precificação valor presente",

  // --------------------------------------------------------
  // SALDO E PRINCIPAL
  // --------------------------------------------------------
  "saldo": "saldo saldo devedor principal valor nominal atualizado vna outstanding",
  "saldo devedor": "saldo devedor valor nominal unitário atualizado valor nominal atualizado amortização outstanding",
  "principal": "principal valor nominal saldo devedor vna amortização outstanding face value",
  "vna": "valor nominal atualizado valor nominal unitário atualizado saldo devedor vna",
  "outstanding": "outstanding saldo devedor valor nominal atualizado principal",
  "face value": "face value valor nominal unitário valor de emissão pu emissão",

  // --------------------------------------------------------
  // JUROS E REMUNERAÇÃO
  // --------------------------------------------------------
  "juros": "juros remuneratorios juros remuneratórios remuneracao remuneração taxa spread coupon",
  "taxa": "taxa juros remuneratorios juros remuneratórios remuneracao remuneração spread",
  "remuneração": "remuneracao remuneração taxa juros spread coupon rendimento",
  "remuneracao": "remuneracao remuneração taxa juros spread coupon rendimento",
  "spread": "spread sobretaxa juros remuneratórios cdi ipca taxa adicional",
  "coupon": "coupon cupom juros remuneratórios taxa pagamento periódico",
  "cupom": "cupom coupon juros remuneratórios taxa pagamento periódico",
  "rendimento": "rendimento taxa juros spread remuneração yield retorno",
  "yield": "yield rendimento taxa juros spread remuneração retorno",
  "accrual": "accrual juros corridos juros acumulados aproprição juros pu juros",
  "juros corridos": "juros corridos juros acumulados accrual pu juros aproprição",

  // --------------------------------------------------------
  // INDEXADORES
  // --------------------------------------------------------
  "ipca": "ipca atualizacao monetaria atualização monetária indice nacional preços consumidor amplo inflação",
  "cdi": "cdi di taxa di remuneracao remuneração certificado depósito interbancário",
  "di": "di cdi taxa di interbancário overnight",
  "indexador": "indexador cdi ipca atualização monetária remuneração índice correção",
  "correção": "correcao correção atualização monetária ipca índice inflação",
  "atualização": "atualizacao atualização monetária ipca índice correção vna",
  "inflação": "inflacao inflação ipca índice preços correção monetária",
  "igpm": "igpm igp-m índice geral preços mercado inflação correção",
  "selic": "selic taxa básica juros banco central referência",

  // --------------------------------------------------------
  // AMORTIZAÇÃO E PAGAMENTOS
  // --------------------------------------------------------
  "amortização": "amortizacao amortização pagamento cronograma anexo fluxo devolução principal",
  "amortizacao": "amortizacao amortização pagamento cronograma anexo fluxo devolução principal",
  "pagamento": "pagamento data de pagamento juros amortização amortizacao cronograma pmt",
  "pmt": "pmt pagamento mensal amortização juros fluxo prestação parcela",
  "parcela": "parcela pmt pagamento prestação amortização juros fluxo",
  "prestação": "prestacao prestação parcela pmt pagamento amortização juros",
  "fluxo": "fluxo fluxo de caixa cronograma pagamentos amortização juros série",
  "cronograma": "cronograma fluxo pagamentos datas amortização juros eventos",
  "carência": "carencia carência período de carência inicio amortização grace period",
  "carencia": "carencia carência período de carência inicio amortização grace period",
  "grace period": "grace period carência período carência inicio amortização",
  "bullet": "bullet pagamento único vencimento amortização final sem amortização periódica",
  "periódico": "periodico periódico semestral anual trimestral amortização juros pagamento",
  "semestral": "semestral seis meses pagamento juros amortização periódico",
  "anual": "anual por ano pagamento amortização juros periodicidade",
  "trimestral": "trimestral três meses pagamento juros amortização periódico",

  // --------------------------------------------------------
  // INSTRUMENTOS E TIPOS
  // --------------------------------------------------------
  "debênture": "debenture debênture instrumento dívida emissora cvm escritura",
  "debenture": "debenture debênture instrumento dívida emissora cvm escritura",
  "cri": "cri certificado de recebíveis imobiliários securitizacao securitizadora lastro imobiliário",
  "cra": "cra certificado de recebíveis do agronegócio securitizacao lastro agronegócio",
  "fii": "fii fundo investimento imobiliário cri lastro imobiliário",
  "título": "titulo título instrumento dívida debênture cri cra emissão",
  "instrumento": "instrumento título dívida debênture cri escritura emissão",
  "paper": "paper título instrumento dívida debênture cri emissão",
  "senior": "senior sênior debenture senior axs goias axs energia ufv goias prioridade pagamento",
  "sênior": "senior sênior debenture senior axs goias axs energia ufv goias prioridade",
  "mezanino": "mezanino mesanino debenture mezanino axs energia unidade 10 cdi subordinado",
  "mesanino": "mezanino mesanino debenture mezanino axs energia unidade 10 cdi subordinado",
  "subordinado": "subordinado mezanino junior prioridade pagamento waterfall",
  "junior": "junior subordinado mezanino prioridade pagamento waterfall",

  // --------------------------------------------------------
  // GARANTIAS
  // --------------------------------------------------------
  "garantia": "garantia garantias fianca fiança alienacao fiduciaria alienação fiduciária cessao fiduciaria cessão fiduciária colateral",
  "garantias": "garantia garantias fianca fiança alienacao fiduciaria alienação fiduciária cessao fiduciaria cessão fiduciária colateral",
  "colateral": "colateral garantia garantias alienacao fiduciaria cessao fiduciaria penhor",
  "alienação fiduciária": "alienacao fiduciaria alienação fiduciária garantia colateral cessão",
  "alienacao fiduciaria": "alienacao fiduciaria alienação fiduciária garantia colateral cessão",
  "cessão fiduciária": "cessao fiduciaria cessão fiduciária garantia recebíveis alienação",
  "cessao fiduciaria": "cessao fiduciaria cessão fiduciária garantia recebíveis alienação",
  "penhor": "penhor garantia colateral alienação fiduciária cessão",
  "fiança": "fianca fiança garantia pessoal avalista garantidor",
  "fianca": "fianca fiança garantia pessoal avalista garantidor",
  "aval": "aval garantia pessoal fiança garantidor avalista",
  "garantidor": "garantidor avalista fiador garantia pessoal fiança aval",
  "recebíveis": "recebiveis recebíveis cessão fiduciária garantia fluxo caixa",
  "recebiveis": "recebiveis recebíveis cessão fiduciária garantia fluxo caixa",

  // --------------------------------------------------------
  // PARTES E AGENTES
  // --------------------------------------------------------
  "quem": "quem emissor emissora cedente securitizadora agente fiduciario trustee partes",
  "emissor": "emissor emissora cedente empresa emitente axs energia partes contrato",
  "emissora": "emissora emissor empresa axs energia unidade partes contrato",
  "agente fiduciário": "agente fiduciario agente fiduciária trustee representante debenturistas",
  "agente fiduciario": "agente fiduciario agente fiduciária trustee representante debenturistas",
  "trustee": "trustee agente fiduciario representante debenturistas fiscalização",
  "debenturista": "debenturista debenturistas investidor credor titular portador",
  "investidor": "investidor debenturista credor titular portador comprador",
  "credor": "credor investidor debenturista titular portador direito pagamento",
  "securitizadora": "securitizadora cedente cri emissão lastro imobiliário",
  "cedente": "cedente securitizadora cri recebíveis cessão originador",
  "coordenador": "coordenador banco coordenador lider distribuição underwriter",
  "escriturador": "escriturador agente escrituração registrador controle custódia",
  "custodiante": "custodiante custódia depositário guarda títulos",

  // --------------------------------------------------------
  // DOCUMENTOS E CONTRATOS
  // --------------------------------------------------------
  "escritura": "escritura escritura de emissão indenture contrato debenturistas termos condições",
  "aditamento": "aditamento aditivo termo aditivo alteração contratual modificação",
  "aditivo": "aditivo aditamento termo aditivo alteração contratual modificação",
  "contrato": "contrato escritura instrumento acordo termos condições",
  "documento": "documento escritura contrato instrumento aditamento",
  "prospecto": "prospecto oferta pública distribuição cvm informações",
  "termo": "termo aditamento acordo contrato instrumento escritura",
  "indenture": "indenture escritura contrato emissão termos condições",
  "registro": "registro cvm b3 cetip registrado regulatório",

  // --------------------------------------------------------
  // COVENANTS E OBRIGAÇÕES
  // --------------------------------------------------------
  "covenant": "covenant obrigação índice financeiro vencimento antecipado icsd restrição",
  "covenants": "covenants obrigações índices financeiros vencimento antecipado icsd restrições",
  "icsd": "icsd índice de cobertura do serviço da dívida indice cobertura servico divida covenant",
  "índice de cobertura": "indice cobertura icsd dscr debt service coverage ratio covenant",
  "dscr": "dscr icsd índice de cobertura do serviço da dívida covenant",
  "inadimplemento": "inadimplemento default evento vencimento antecipado covenant breach",
  "default": "default inadimplemento evento vencimento antecipado covenant breach",
  "obrigação": "obrigacao obrigação covenant clausula restrição dever contratual",
  "vencimento antecipado": "vencimento antecipado default inadimplemento evento aceleração cross default",
  "cross default": "cross default vencimento antecipado inadimplemento cruzado covenant",
  "aceleração": "aceleracao aceleração vencimento antecipado default exigibilidade imediata",
  "evento de inadimplemento": "evento inadimplemento default vencimento antecipado covenant breach",
  "razão": "razao razão cobertura icsd indice financeiro covenant dscr",

  // --------------------------------------------------------
  // FUNDOS RESERVA
  // --------------------------------------------------------
  "fundo": "fundo liquidez fundo de obras fundo de reserva obras manutenção",
  "liquidez": "fundo de liquidez valor minimo fundo de liquidez valor mínimo reserva",
  "reserva": "fundo de reserva reserva liquidez caixa mínimo obrigação contratual",
  "fundo de obras": "fundo obras manutenção capex investimento reserva",
  "dsra": "dsra debt service reserve account fundo reserva serviço dívida liquidez",

  // --------------------------------------------------------
  // MÉTRICAS FINANCEIRAS
  // --------------------------------------------------------
  "duration": "duration prazo médio prazo medio fluxo amortização vencimento sensibilidade",
  "duration modificada": "duration modificada sensibilidade taxa juros risco mercado",
  "tir": "tir taxa interna retorno yield irr rendimento investimento",
  "irr": "irr tir taxa interna retorno yield rendimento",
  "tma": "tma taxa mínima atratividade custo capital hurdle rate",
  "vpl": "vpl valor presente líquido npv fluxo descontado",
  "npv": "npv vpl valor presente líquido fluxo descontado",
  "duration": "duration prazo médio sensibilidade risco mercado taxa juros",
  "convexidade": "convexidade duration risco mercado sensibilidade taxa juros",

  // --------------------------------------------------------
  // CÁLCULO E FÓRMULAS
  // --------------------------------------------------------
  "du": "du dias uteis dias úteis base de calculo convenção",
  "dias úteis": "dias uteis du base calculo convenção pagamento",
  "fator": "fator fator de atualização fator de juros multiplicador capitalização",
  "capitalização": "capitalizacao capitalização fator juros acumulação rendimento",
  "base de cálculo": "base calculo du dias uteis convenção 252 360 365",
  "252": "252 dias uteis base calculo convenção cdi taxa",
  "encargos": "encargos juros remuneratórios mora multa penalidade atraso",
  "mora": "mora juros moratórios multa atraso inadimplência penalidade",
  "multa": "multa mora penalidade atraso inadimplência juros moratórios",

  // --------------------------------------------------------
  // DISTRIBUIÇÃO E MERCADO
  // --------------------------------------------------------
  "oferta pública": "oferta publica distribuição cvm instrução regulatório prospecto",
  "476": "476 icvm 476 oferta restrita esforços restritos qualificado",
  "160": "160 res cvm 160 oferta pública distribuição prospecto",
  "qualificado": "qualificado investidor qualificado oferta restrita 476",
  "profissional": "profissional investidor profissional qualificado acesso oferta",
  "b3": "b3 bolsa balcão cetip negociação registro custódia",
  "cetip": "cetip b3 registro custódia negociação balcão",
  "secondary": "secondary mercado secundário negociação compra venda",
  "liquidez mercado": "liquidez mercado secundário negociação b3 cetip",

  // --------------------------------------------------------
  // OPERAÇÕES AXS
  // --------------------------------------------------------
  "axs 01": "axs 01 unidade 01 axs energia unidade 01 ltda",
  "axs01": "axs 01 unidade 01 axs energia unidade 01 ltda",
  "unidade 01": "unidade 01 axs energia unidade 01 axs 01 ltda",

  "axs 02": "axs 02 unidade 02 axs energia unidade 02 ltda portfólio portfolio",
  "axs02": "axs 02 unidade 02 axs energia unidade 02 ltda portfólio portfolio",
  "unidade 02": "unidade 02 axs energia unidade 02 axs 02 ltda portfólio",
  "portfolio": "portfolio portfólio axs 02 unidade 02 cri",
  "portfólio": "portfolio portfólio axs 02 unidade 02 cri",

  "axs 03": "axs 03 unidade 03 axs energia unidade 03 ltda cri",
  "axs03": "axs 03 unidade 03 axs energia unidade 03 ltda cri",
  "unidade 03": "unidade 03 axs energia unidade 03 axs 03 ltda cri",

  "axs 04": "axs 04 unidade 04 axs energia unidade 04 ltda cri",
  "axs04": "axs 04 unidade 04 axs energia unidade 04 ltda cri",
  "unidade 04": "unidade 04 axs energia unidade 04 axs 04 ltda cri",

  "axs 05": "axs 05 unidade 05 axs energia unidade 05 ltda",
  "axs05": "axs 05 unidade 05 axs energia unidade 05 ltda",
  "unidade 05": "unidade 05 axs energia unidade 05 axs 05 ltda",

  "axs 06": "axs 06 unidade 06 axs energia unidade 06 ltda",
  "axs06": "axs 06 unidade 06 axs energia unidade 06 ltda",
  "unidade 06": "unidade 06 axs energia unidade 06 axs 06 ltda",

  "axs 07": "axs 07 unidade 07 axs energia unidade 07 ltda debenture",
  "axs07": "axs 07 unidade 07 axs energia unidade 07 ltda debenture",
  "unidade 07": "unidade 07 axs energia unidade 07 axs 07 ltda debenture",

  "axs 08": "axs 08 unidade 08 axs energia unidade 08 ltda debenture ipca",
  "axs08": "axs 08 unidade 08 axs energia unidade 08 ltda debenture ipca",
  "unidade 08": "unidade 08 axs energia unidade 08 axs 08 ltda debenture ipca",

  "axs 09": "axs 09 unidade 09 axs energia unidade 09 ltda debenture ipca",
  "axs09": "axs 09 unidade 09 axs energia unidade 09 ltda debenture ipca",
  "unidade 09": "unidade 09 axs energia unidade 09 axs 09 ltda debenture ipca",

  "axs 10": "axs 10 unidade 10 axs energia unidade 10 axs energia ufv goias axs goias ltda cdi",
  "axs10": "axs 10 unidade 10 axs energia unidade 10 axs energia ufv goias axs goias ltda cdi",
  "unidade 10": "unidade 10 axs energia unidade 10 axs 10 axs goias ufv goias ltda cdi",

  "axs goias": "axs goias axs energia ufv goias senior debenture senior mezanino cdi",
  "axs goiás": "axs goias axs energia ufv goias senior debenture senior mezanino cdi",
  "goias": "goias axs energia ufv goias senior debenture senior mezanino",
  "goiás": "goias axs energia ufv goias senior debenture senior mezanino",
  "ufv": "ufv usina fotovoltaica axs goias energia solar geração",

  // --------------------------------------------------------
  // SETOR ENERGIA
  // --------------------------------------------------------
  "energia solar": "energia solar fotovoltaica ufv usina solar geração renovável",
  "fotovoltaica": "fotovoltaica energia solar ufv usina geração renovável",
  "geração": "geracao geração energia elétrica usina fotovoltaica renovável",
  "usina": "usina fotovoltaica geração energia solar renovável",
  "renovável": "renovavel renovável energia limpa solar eólica sustentável",
  "gd": "gd geração distribuída microgeração minigeração energia solar",
  "aneel": "aneel agência reguladora energia elétrica regulação concessão",
  "ppa": "ppa power purchase agreement contrato fornecimento energia",
  "ccve": "ccve contrato compra venda energia fornecimento",
  "receita": "receita faturamento ppa energia venda geração fluxo caixa",

  // --------------------------------------------------------
  // COMPARAÇÕES E CONSOLIDADO
  // --------------------------------------------------------
  "carteira": "carteira portfolio consolidado todas emissões operações total",
  "consolidado": "consolidado carteira total todas emissões operações soma",
  "total": "total consolidado carteira soma todas emissões saldo devedor",
  "todas": "todas todas emissões operações carteira consolidado portfólio",
  "comparar": "comparar comparação operações emissões taxas prazos condições",
  "diferença": "diferenca diferença comparação operações condições taxas",
  "melhor": "melhor comparação operações condições taxas prazo rendimento",
  "maior": "maior comparação operações valor saldo taxa prazo",
  "menor": "menor comparação operações valor saldo taxa prazo"
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

  const MAX_CHARS_POR_CHUNK = 7000;

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
    chunks = buscar(pergunta, 15);
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

1. Responda em português do Brasil, com linguagem clara, objetiva e fácil de entender. Não precisa ser extremamente formal.

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
