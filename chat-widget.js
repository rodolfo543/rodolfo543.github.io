/**
 * chat-widget.js — Widget de chat IA para o site AXS Energia
 *
 * Como usar: adicione ao final do seu HTML, antes de </body>:
 *   <script src="chat-widget.js"></script>
 *
 * Ajuste a variável API_URL abaixo se necessário.
 */

(function () {
  const API_URL = "/api/chat"; // URL da sua Vercel Function
  const MAX_HISTORICO = 10;    // máximo de mensagens mantidas no contexto

  /* ---------- Estado ---------- */
  let historico = [];
  let carregando = false;

  /* ---------- Estilos ---------- */
  const style = document.createElement("style");
  style.textContent = `
    #axs-chat-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #0f4c81;
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      z-index: 9998;
      transition: transform 0.2s, background 0.2s;
    }
    #axs-chat-btn:hover { background: #1565a8; transform: scale(1.07); }
    #axs-chat-btn svg { width: 26px; height: 26px; }

    #axs-chat-box {
      position: fixed;
      bottom: 96px;
      right: 28px;
      width: 360px;
      max-height: 520px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
      z-index: 9999;
      overflow: hidden;
      font-family: Inter, system-ui, sans-serif;
      font-size: 14px;
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
      transition: opacity 0.2s, transform 0.2s;
    }
    #axs-chat-box.aberto {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }

    #axs-chat-header {
      background: #0f4c81;
      color: #fff;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #axs-chat-header span { font-weight: 600; font-size: 15px; }
    #axs-chat-header small { font-size: 11px; opacity: 0.8; display: block; }
    #axs-chat-fechar {
      margin-left: auto;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      opacity: 0.8;
    }
    #axs-chat-fechar:hover { opacity: 1; }

    #axs-chat-msgs {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f5f7fa;
    }

    .axs-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      line-height: 1.5;
      word-break: break-word;
      white-space: pre-wrap;
    }
    .axs-msg.usuario {
      background: #0f4c81;
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }
    .axs-msg.ia {
      background: #fff;
      color: #1a1a2e;
      align-self: flex-start;
      border-bottom-left-radius: 3px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .axs-msg.digitando {
      background: #fff;
      color: #888;
      align-self: flex-start;
      font-style: italic;
    }

    #axs-chat-form {
      display: flex;
      padding: 12px;
      gap: 8px;
      border-top: 1px solid #e5e8ec;
      background: #fff;
    }
    #axs-chat-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #dce1e9;
      border-radius: 8px;
      outline: none;
      font-size: 14px;
      font-family: inherit;
      resize: none;
      max-height: 100px;
      transition: border-color 0.2s;
    }
    #axs-chat-input:focus { border-color: #0f4c81; }
    #axs-chat-enviar {
      background: #0f4c81;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0 14px;
      cursor: pointer;
      font-size: 18px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }
    #axs-chat-enviar:hover:not(:disabled) { background: #1565a8; }
    #axs-chat-enviar:disabled { background: #a0b4c8; cursor: not-allowed; }

    @media (max-width: 420px) {
      #axs-chat-box { width: calc(100vw - 24px); right: 12px; }
    }
  `;
  document.head.appendChild(style);

  /* ---------- HTML ---------- */
  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <button id="axs-chat-btn" title="Assistente de Contratos AXS">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>

    <div id="axs-chat-box">
      <div id="axs-chat-header">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <div>
          <span>Assistente AXS</span>
          <small>Perguntas sobre os contratos e emissões</small>
        </div>
        <button id="axs-chat-fechar">×</button>
      </div>

      <div id="axs-chat-msgs">
        <div class="axs-msg ia">
          Olá! Sou o assistente da AXS Energia. Faça perguntas sobre os contratos, aditamentos e documentos das emissões de dívida.
        </div>
      </div>

      <div id="axs-chat-form">
        <textarea
          id="axs-chat-input"
          placeholder="Digite sua pergunta..."
          rows="1"
        ></textarea>
        <button id="axs-chat-enviar" title="Enviar">➤</button>
      </div>
    </div>
  `
  );

  /* ---------- Referências ---------- */
  const btn     = document.getElementById("axs-chat-btn");
  const box     = document.getElementById("axs-chat-box");
  const fechar  = document.getElementById("axs-chat-fechar");
  const msgs    = document.getElementById("axs-chat-msgs");
  const input   = document.getElementById("axs-chat-input");
  const enviar  = document.getElementById("axs-chat-enviar");

  /* ---------- Abrir / fechar ---------- */
  btn.addEventListener("click", () => {
    box.classList.toggle("aberto");
    if (box.classList.contains("aberto")) input.focus();
  });
  fechar.addEventListener("click", () => box.classList.remove("aberto"));

  /* ---------- Auto-resize do textarea ---------- */
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  });

  /* ---------- Enviar com Enter (Shift+Enter para quebra de linha) ---------- */
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  });
  enviar.addEventListener("click", enviarMensagem);

  /* ---------- Funções ---------- */
  function adicionarMensagem(texto, tipo) {
    const div = document.createElement("div");
    div.className = `axs-msg ${tipo}`;
    div.textContent = texto;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  async function enviarMensagem() {
    const pergunta = input.value.trim();
    if (!pergunta || carregando) return;

    carregando = true;
    enviar.disabled = true;
    input.value = "";
    input.style.height = "auto";

    adicionarMensagem(pergunta, "usuario");
    const digitando = adicionarMensagem("Buscando nos documentos...", "digitando");

    // Adiciona ao histórico
    historico.push({ role: "user", content: pergunta });
    if (historico.length > MAX_HISTORICO) historico = historico.slice(-MAX_HISTORICO);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta,
          historico: historico.slice(0, -1), // histórico sem a pergunta atual
        }),
      });

      const data = await res.json();

      digitando.remove();

      if (data.resposta) {
        adicionarMensagem(data.resposta, "ia");
        historico.push({ role: "assistant", content: data.resposta });
      } else {
        adicionarMensagem("Não consegui obter uma resposta. Tente novamente.", "ia");
        historico.pop();
      }
    } catch (err) {
      digitando.remove();
      adicionarMensagem("Erro de conexão. Verifique sua rede e tente novamente.", "ia");
      historico.pop();
    }

    carregando = false;
    enviar.disabled = false;
    input.focus();
  }
})();
