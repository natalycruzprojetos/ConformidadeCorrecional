/* ============================================================
   Checklist de Conformidade Correcional — app.js
   ============================================================ */

const STORAGE_PREFIX = "checklist-ri-cnj::";
const JSONBLOB_BASE = "https://jsonblob.com/api/jsonBlob";

let ESTADO = {
  cartorio: "",
  titular: "",
  data: "",
  sessaoId: null,
  responsaveisArea: {},
  respostas: {} // { itemId: { status, detalhes, extra:{}, arquivo:{nome,tipo,tamanho,dados} } }
};

let timerEnvioSessao = null;
let timerPolling = null;

/* ---------------- Utilidades ---------------- */
function totalItens(){ return AREAS.reduce((acc, a) => acc + a.itens.length, 0); }

function escapeHtml(s){
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escapeAttr(s){ return escapeHtml(s).replace(/"/g, "&quot;"); }

function linkify(texto){
  let out = escapeHtml(texto);
  NORMA_LINKS.forEach(({ re, url }) => {
    out = out.replace(re, (m) => `<a href="${url}" target="_blank" rel="noopener">${m}</a>`);
  });
  return out;
}

function horaAtual(){
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarData(iso){
  if(!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/* ---------------- Persistência local ---------------- */
function chaveAtual(){
  const nome = (ESTADO.cartorio || "sem-nome").trim().toLowerCase().replace(/\s+/g, "-");
  return STORAGE_PREFIX + nome;
}

function salvar(){
  try{
    localStorage.setItem(chaveAtual(), JSON.stringify(ESTADO));
    localStorage.setItem(STORAGE_PREFIX + "ultimo", chaveAtual());
    if(ESTADO.cartorio) salvarNomeConhecido(ESTADO.cartorio);
  }catch(e){ console.warn("Não foi possível salvar localmente:", e); }
  atualizarProgresso();
  agendarEnvioSessao();
}

function salvarNomeConhecido(nome){
  try{
    const chave = STORAGE_PREFIX + "cartorios-conhecidos";
    const lista = JSON.parse(localStorage.getItem(chave) || "[]");
    if(!lista.includes(nome)){
      lista.push(nome);
      localStorage.setItem(chave, JSON.stringify(lista));
      montarDatalistCartorios();
    }
  }catch(e){ /* silencioso */ }
}

function montarDatalistCartorios(){
  try{
    const lista = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "cartorios-conhecidos") || "[]");
    const dl = document.getElementById("lista-cartorios");
    dl.innerHTML = lista.map(n => `<option value="${escapeAttr(n)}"></option>`).join("");
  }catch(e){ /* silencioso */ }
}

function carregarPorCartorio(){
  try{
    const raw = localStorage.getItem(chaveAtual());
    if(raw){
      const dados = JSON.parse(raw);
      ESTADO.respostas = dados.respostas || {};
      ESTADO.responsaveisArea = dados.responsaveisArea || {};
      ESTADO.titular = dados.titular || ESTADO.titular;
      ESTADO.data = dados.data || ESTADO.data;
      return true;
    }
  }catch(e){ console.warn(e); }
  return false;
}

function carregarUltimoUsado(){
  try{
    const ultima = localStorage.getItem(STORAGE_PREFIX + "ultimo");
    if(ultima){
      const raw = localStorage.getItem(ultima);
      if(raw) ESTADO = Object.assign(ESTADO, JSON.parse(raw));
    }
  }catch(e){ console.warn(e); }
}

/* ---------------- Sidebar / navegação ---------------- */
function montarNav(){
  const lista = document.getElementById("nav-lista");
  lista.innerHTML = "";
  AREAS.forEach((area, idx) => {
    const li = document.createElement("li");
    li.className = "nav-item";
    const btn = document.createElement("button");
    btn.className = "nav-btn" + (idx === 0 ? " ativo" : "");
    btn.dataset.area = area.id;
    btn.innerHTML = `
      <span class="nav-sigla">${area.sigla}</span>
      <span class="nav-nome">${area.nome}</span>
      <span class="nav-badge" id="badge-${area.id}">0/${area.itens.length}</span>
    `;
    btn.addEventListener("click", () => selecionarArea(area.id));
    li.appendChild(btn);
    lista.appendChild(li);
  });

  const divisor = document.createElement("li");
  divisor.className = "nav-divider";
  lista.appendChild(divisor);

  const liRel = document.createElement("li");
  liRel.className = "nav-item";
  const btnRel = document.createElement("button");
  btnRel.className = "nav-btn relatorio";
  btnRel.innerHTML = `<span class="nav-sigla">✓</span><span class="nav-nome">Gerar relatório</span>`;
  btnRel.addEventListener("click", () => selecionarArea("__relatorio__"));
  liRel.appendChild(btnRel);
  lista.appendChild(liRel);
}

function selecionarArea(areaId){
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("ativo"));
  document.querySelectorAll(".area").forEach(a => a.classList.remove("ativa"));
  document.getElementById("relatorio").classList.remove("ativa");
  document.getElementById("barra").style.display = "flex";

  if(areaId === "__relatorio__"){
    document.querySelector(".nav-btn.relatorio").classList.add("ativo");
    document.getElementById("relatorio").classList.add("ativa");
    document.getElementById("barra").style.display = "none";
    gerarRelatorio();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.querySelector(`.nav-btn[data-area="${areaId}"]`).classList.add("ativo");
  document.getElementById("area-" + areaId).classList.add("ativa");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- Construção das áreas ---------------- */
function montarAreas(){
  const cont = document.getElementById("areas");
  const abertaAntes = document.querySelector(".area.ativa");
  const idAberta = abertaAntes ? abertaAntes.id.replace("area-", "") : AREAS[0].id;

  cont.innerHTML = "";
  AREAS.forEach((area) => {
    const sec = document.createElement("section");
    sec.className = "area" + (area.id === idAberta ? " ativa" : "");
    sec.id = "area-" + area.id;

    const head = document.createElement("div");
    head.className = "area-head";
    head.innerHTML = `<h2>${area.nome}</h2>`;
    sec.appendChild(head);

    const desc = document.createElement("p");
    desc.className = "area-desc";
    desc.textContent = area.descricao;
    sec.appendChild(desc);

    const respBox = document.createElement("div");
    respBox.className = "area-resp";
    respBox.innerHTML = `
      <label for="resp-area-${area.id}">Responsável por este assunto</label>
      <input type="text" id="resp-area-${area.id}" placeholder="Nome / setor responsável por ${area.nome.toLowerCase()}"
        value="${escapeAttr(ESTADO.responsaveisArea[area.id] || "")}">
    `;
    respBox.querySelector("input").addEventListener("input", (e) => {
      ESTADO.responsaveisArea[area.id] = e.target.value;
      salvar();
    });
    sec.appendChild(respBox);

    area.itens.forEach(item => sec.appendChild(montarItem(item)));
    cont.appendChild(sec);
  });

  // religa a nav ao estado ativo, caso a área ativa não seja a primeira
  document.querySelectorAll(".nav-btn[data-area]").forEach(b => b.classList.remove("ativo"));
  const navAtiva = document.querySelector(`.nav-btn[data-area="${idAberta}"]`);
  if(navAtiva) navAtiva.classList.add("ativo");
}

function montarItem(item){
  const card = document.createElement("article");
  card.className = "item";
  card.id = "item-" + item.id;

  const resp = ESTADO.respostas[item.id] || {};

  let extraHtml = "";
  if(item.extra){
    const valorExtra = (resp.extra && resp.extra[item.extra.chave]) || "";
    extraHtml = `
      <div class="campo">
        <label for="extra-${item.id}">${item.extra.label}</label>
        <input type="${item.extra.tipo}" id="extra-${item.id}" placeholder="${escapeAttr(item.extra.placeholder || "")}" value="${escapeAttr(valorExtra)}">
      </div>
    `;
  }

  let resumoHtml = "";
  if(item.resumo){
    resumoHtml = `
      <button type="button" class="saiba-mais-btn" data-toggle="resumo-${item.id}">Saiba mais</button>
      <div class="item-resumo" id="resumo-${item.id}" hidden>${escapeHtml(item.resumo)}</div>
    `;
  }

  card.innerHTML = `
    <div class="item-top">
      <span class="item-id">${item.id}</span>
      <div class="item-pergunta">${item.pergunta}</div>
    </div>
    ${resumoHtml}
    <div class="item-ref"><strong>Referência:</strong> ${linkify(item.referencia)}</div>
    <div class="resposta-row" role="radiogroup" aria-label="Resposta para ${item.id}">
      <div class="resp-opt sim">
        <input type="radio" name="status-${item.id}" id="sim-${item.id}" value="sim" ${resp.status === "sim" ? "checked" : ""}>
        <label for="sim-${item.id}">Sim, atende</label>
      </div>
      <div class="resp-opt parcial">
        <input type="radio" name="status-${item.id}" id="parcial-${item.id}" value="parcial" ${resp.status === "parcial" ? "checked" : ""}>
        <label for="parcial-${item.id}">Parcialmente</label>
      </div>
      <div class="resp-opt nao">
        <input type="radio" name="status-${item.id}" id="nao-${item.id}" value="nao" ${resp.status === "nao" ? "checked" : ""}>
        <label for="nao-${item.id}">Não atende</label>
      </div>
    </div>
    ${extraHtml}
    <div class="campo">
      <label for="det-${item.id}">Detalhes, evidências ou procedimento adotado</label>
      <textarea id="det-${item.id}" placeholder="Descreva o procedimento atual, ou o plano de ação...">${escapeHtml(resp.detalhes || "")}</textarea>
    </div>
    <div class="campo">
      <label>Evidência (opcional)</label>
      <div class="anexo-row" id="anexo-row-${item.id}"></div>
    </div>
  `;

  if(item.resumo){
    const btnSaibaMais = card.querySelector(".saiba-mais-btn");
    btnSaibaMais.addEventListener("click", () => {
      const bloco = card.querySelector(`#resumo-${item.id}`);
      const aberto = !bloco.hidden;
      bloco.hidden = aberto;
      btnSaibaMais.textContent = aberto ? "Saiba mais" : "Ocultar explicação";
      btnSaibaMais.classList.toggle("aberto", !aberto);
    });
  }

  card.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener("change", () => atualizarResposta(item));
  });
  card.querySelector(`#det-${item.id}`).addEventListener("input", () => atualizarResposta(item));
  if(item.extra){
    card.querySelector(`#extra-${item.id}`).addEventListener("input", () => atualizarResposta(item));
  }

  renderAnexoRow(item.id, card);

  return card;
}

function atualizarResposta(item){
  const status = document.querySelector(`input[name="status-${item.id}"]:checked`);
  const detalhes = document.getElementById(`det-${item.id}`).value;
  const anterior = ESTADO.respostas[item.id] || {};
  const novo = { status: status ? status.value : null, detalhes, arquivo: anterior.arquivo || null, extra: anterior.extra || {} };
  if(item.extra){
    const campoExtra = document.getElementById(`extra-${item.id}`);
    novo.extra = { [item.extra.chave]: campoExtra ? campoExtra.value : "" };
  }
  ESTADO.respostas[item.id] = novo;
  salvar();
}

/* ---------------- Anexos ---------------- */
const TAMANHO_MAX_ANEXO = 2 * 1024 * 1024; // 2MB

function renderAnexoRow(itemId, card){
  const row = (card || document).querySelector(`#anexo-row-${itemId}`);
  if(!row) return;
  const resp = ESTADO.respostas[itemId] || {};
  const arquivo = resp.arquivo;

  if(arquivo){
    row.innerHTML = `
      <span class="anexo-chip">📎 ${escapeHtml(arquivo.nome)} <button type="button" title="Remover anexo" data-remover="${itemId}">✕</button></span>
    `;
    row.querySelector("button[data-remover]").addEventListener("click", () => {
      const atual = ESTADO.respostas[itemId] || {};
      atual.arquivo = null;
      ESTADO.respostas[itemId] = atual;
      salvar();
      renderAnexoRow(itemId);
    });
  } else {
    row.innerHTML = `
      <button type="button" class="anexo-btn" data-anexar="${itemId}">📎 Anexar arquivo</button>
      <input type="file" id="file-${itemId}" style="display:none">
      <span class="anexo-aviso">Máx. 2MB — fica salvo neste navegador e é incluído na exportação.</span>
    `;
    row.querySelector("button[data-anexar]").addEventListener("click", () => row.querySelector(`#file-${itemId}`).click());
    row.querySelector(`#file-${itemId}`).addEventListener("change", (e) => {
      const file = e.target.files[0];
      if(!file) return;
      if(file.size > TAMANHO_MAX_ANEXO){
        alert("Arquivo muito grande para anexar (máx. 2MB). Prefira linkar um arquivo externo no campo de detalhes.");
        return;
      }
      const leitor = new FileReader();
      leitor.onload = () => {
        const atual = ESTADO.respostas[itemId] || {};
        atual.arquivo = { nome: file.name, tipo: file.type, tamanho: file.size, dados: leitor.result };
        ESTADO.respostas[itemId] = atual;
        salvar();
        renderAnexoRow(itemId);
      };
      leitor.readAsDataURL(file);
    });
  }
}

/* ---------------- Progresso ---------------- */
function atualizarProgresso(){
  const total = totalItens();
  const respondidos = Object.values(ESTADO.respostas).filter(r => r && r.status).length;
  const pct = total ? Math.round((respondidos / total) * 100) : 0;
  const txt = document.getElementById("progresso-txt");
  const fill = document.getElementById("progresso-fill");
  if(txt) txt.textContent = `${respondidos} de ${total} itens respondidos (${pct}%)`;
  if(fill) fill.style.width = pct + "%";

  AREAS.forEach(area => {
    const badge = document.getElementById(`badge-${area.id}`);
    if(!badge) return;
    const okArea = area.itens.filter(i => ESTADO.respostas[i.id] && ESTADO.respostas[i.id].status).length;
    badge.textContent = `${okArea}/${area.itens.length}`;
    badge.classList.toggle("completo", okArea === area.itens.length);
  });
}

/* ---------------- Capa (identificação global) ---------------- */
function ligarCapa(){
  const inCartorio = document.getElementById("in-cartorio");
  const inTitular = document.getElementById("in-titular");
  const inData = document.getElementById("in-data");

  inCartorio.value = ESTADO.cartorio;
  inTitular.value = ESTADO.titular;
  inData.value = ESTADO.data;

  inCartorio.addEventListener("change", () => {
    ESTADO.cartorio = inCartorio.value;
    if(!ESTADO.sessaoId){
      carregarPorCartorio();
      inTitular.value = ESTADO.titular;
      inData.value = ESTADO.data;
      recarregarTudoNaTela();
    }
    salvar();
  });
  inTitular.addEventListener("input", () => { ESTADO.titular = inTitular.value; salvar(); });
  inData.addEventListener("input", () => { ESTADO.data = inData.value; salvar(); });

  montarDatalistCartorios();
}

function recarregarTudoNaTela(){
  document.getElementById("in-cartorio").value = ESTADO.cartorio || "";
  document.getElementById("in-titular").value = ESTADO.titular || "";
  document.getElementById("in-data").value = ESTADO.data || "";
  montarAreas();
  atualizarProgresso();
  atualizarPainelColab();
}

/* ---------------- Relatório ---------------- */
function calcularEstatisticas(){
  let sim = 0, parcial = 0, nao = 0, pendente = 0;
  const total = totalItens();
  AREAS.forEach(area => area.itens.forEach(item => {
    const r = ESTADO.respostas[item.id];
    if(!r || !r.status) pendente++;
    else if(r.status === "sim") sim++;
    else if(r.status === "parcial") parcial++;
    else if(r.status === "nao") nao++;
  }));
  const respondidos = sim + parcial + nao;
  const score = respondidos ? ((sim * 1 + parcial * 0.5) / total) * 100 : 0;
  return { sim, parcial, nao, pendente, total, score: Math.round(score) };
}

function seloSVG(pct){
  let cor = "#1F8A55", rotulo = "CONFORME";
  if(pct < 60){ cor = "#C0392B"; rotulo = "CRÍTICO"; }
  else if(pct < 85){ cor = "#B7791E"; rotulo = "ATENÇÃO"; }

  return `
  <svg class="selo-svg" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-label="Selo de conformidade: ${pct}%">
    <circle cx="60" cy="60" r="54" fill="none" stroke="#EEF0F5" stroke-width="9"/>
    <circle cx="60" cy="60" r="54" fill="none" stroke="${cor}" stroke-width="9" stroke-linecap="round"
      stroke-dasharray="${2 * Math.PI * 54}" stroke-dashoffset="${2 * Math.PI * 54 * (1 - pct / 100)}"
      transform="rotate(-90 60 60)"/>
    <text x="60" y="58" text-anchor="middle" font-size="24" font-weight="700" fill="${cor}">${pct}%</text>
    <text x="60" y="76" text-anchor="middle" font-size="9" font-weight="600" letter-spacing="1" fill="${cor}">${rotulo}</text>
  </svg>`;
}

function textoConclusao(stats){
  const { pendente, total, score } = stats;
  let nivel, orientacao;
  if(pendente === total){
    nivel = "Checklist ainda não iniciado.";
    orientacao = "Preencha os itens de cada área para gerar um diagnóstico de conformidade.";
  } else if(score >= 85 && pendente === 0){
    nivel = "Situação geral: conforme, com baixo risco correcional.";
    orientacao = "A serventia atende à maior parte dos requisitos identificados no Boletim de Inspeções CNJ. Recomenda-se manter rotina de reavaliação periódica e tratar os itens parciais remanescentes.";
  } else if(score >= 60){
    nivel = "Situação geral: atenção — há pendências relevantes.";
    orientacao = "Existem não conformidades e itens parciais que podem ser objeto de determinação em correição. Recomenda-se priorizar as providências indicadas abaixo, sobretudo as de natureza financeira, PLD/FTP e proteção de dados, que concentram as determinações do Boletim CNJ.";
  } else {
    nivel = "Situação geral: crítica — exposição correcional relevante.";
    orientacao = "O volume de não conformidades identificado é significativo e reproduz padrões apontados como graves na inspeção CNJ (ex.: ausência de segregação de depósito prévio, fragilidades de TI e de PLD/FTP). Recomenda-se plano de saneamento formal, com cronograma, responsáveis e prazos, e comunicação ao Juízo Corregedor Permanente quando cabível.";
  }
  const pendenteTxt = pendente > 0
    ? ` Há ainda ${pendente} item(ns) sem resposta — recomenda-se concluir o preenchimento antes de considerar o diagnóstico definitivo.`
    : "";
  return `<p><b>${nivel}</b></p><p>${orientacao}${pendenteTxt}</p>`;
}

function anexoParaLink(arquivo){
  try{
    const partes = arquivo.dados.split(",");
    const meta = partes[0].match(/data:(.*);base64/);
    const tipo = meta ? meta[1] : "application/octet-stream";
    const bin = atob(partes[1]);
    const bytes = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: tipo });
    return URL.createObjectURL(blob);
  }catch(e){ return null; }
}

function gerarRelatorio(){
  const stats = calcularEstatisticas();

  document.getElementById("rel-cartorio").textContent = ESTADO.cartorio || "Cartório não identificado";
  document.getElementById("rel-titular").textContent = ESTADO.titular ? `Responsável pelo preenchimento: ${ESTADO.titular}` : "";
  document.getElementById("rel-data").textContent = ESTADO.data ? `Data de referência: ${formatarData(ESTADO.data)}` : "";
  document.getElementById("rel-gerado").textContent = `Relatório gerado em ${new Date().toLocaleDateString("pt-BR")}`;

  document.getElementById("selo-container").innerHTML = seloSVG(stats.score);

  document.getElementById("resumo-sim").textContent = stats.sim;
  document.getElementById("resumo-parcial").textContent = stats.parcial;
  document.getElementById("resumo-nao").textContent = stats.nao;
  document.getElementById("resumo-pendente").textContent = stats.pendente;

  document.getElementById("rel-conclusao-corpo").innerHTML = textoConclusao(stats);

  const cont = document.getElementById("rel-areas");
  cont.innerHTML = "";
  AREAS.forEach(area => {
    const pendencias = area.itens.filter(item => {
      const r = ESTADO.respostas[item.id];
      return !r || !r.status || r.status === "nao" || r.status === "parcial";
    });

    const bloco = document.createElement("div");
    bloco.className = "rel-area-bloco";
    const totalArea = area.itens.length;
    const okArea = totalArea - pendencias.length;
    const responsavelArea = ESTADO.responsaveisArea[area.id];
    bloco.innerHTML = `<h3>${area.nome} <span class="tag">${okArea}/${totalArea} conforme</span></h3>` +
      (responsavelArea ? `<p style="font-size:12.5px;color:var(--text-muted);margin:0 0 8px;">Responsável pelo assunto: <b>${escapeHtml(responsavelArea)}</b></p>` : "");

    if(pendencias.length === 0){
      const ok = document.createElement("div");
      ok.className = "sem-pendencia";
      ok.textContent = "Todos os itens desta área foram avaliados como conformes.";
      bloco.appendChild(ok);
    } else {
      pendencias.forEach(item => {
        const r = ESTADO.respostas[item.id];
        const status = r && r.status;
        const div = document.createElement("div");
        div.className = "pendencia" + (status === "parcial" ? " parcial" : "");
        const statusTxt = status === "parcial" ? "Parcialmente atendido" : status === "nao" ? "Não atendido" : "Ainda não avaliado";

        let metaPartes = [];
        if(r && r.detalhes) metaPartes.push(escapeHtml(r.detalhes));
        if(item.extra && r && r.extra && r.extra[item.extra.chave]){
          metaPartes.push(`${item.extra.label}: ${escapeHtml(String(r.extra[item.extra.chave]))}`);
        }
        let anexoHtml = "";
        if(r && r.arquivo){
          const url = anexoParaLink(r.arquivo);
          anexoHtml = url
            ? ` &nbsp;<a href="${url}" target="_blank" rel="noopener">📎 ${escapeHtml(r.arquivo.nome)}</a>`
            : ` &nbsp;📎 ${escapeHtml(r.arquivo.nome)}`;
        }

        div.innerHTML = `
          <div class="p-titulo">${item.id} — ${item.pergunta}</div>
          <div class="p-ref">${linkify(item.referencia)}</div>
          <div class="p-prov"><b>Status:</b> ${statusTxt}. <b>Providência recomendada:</b> ${item.providencia}${anexoHtml}</div>
          ${metaPartes.length ? `<div class="p-meta">${metaPartes.join(" — ")}</div>` : ""}
        `;
        bloco.appendChild(div);
      });
    }
    cont.appendChild(bloco);
  });
}

/* ---------------- Exportar / Importar / Reset ---------------- */
function exportarJSON(){
  const blob = new Blob([JSON.stringify(ESTADO, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const nome = (ESTADO.cartorio || "checklist").trim().replace(/\s+/g, "-").toLowerCase();
  a.href = url;
  a.download = `checklist-${nome || "cartorio"}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importarJSON(file){
  const reader = new FileReader();
  reader.onload = (e) => {
    try{
      const dados = JSON.parse(e.target.result);
      ESTADO = Object.assign({ cartorio: "", titular: "", data: "", sessaoId: ESTADO.sessaoId, responsaveisArea: {}, respostas: {} }, dados);
      recarregarTudoNaTela();
      salvar();
      alert("Respostas importadas com sucesso.");
    }catch(err){
      alert("Não foi possível importar este arquivo. Verifique se é um JSON exportado por este checklist.");
    }
  };
  reader.readAsText(file);
}

function novoChecklist(){
  if(!confirm("Isso vai limpar todas as respostas preenchidas (mantendo o nome do cartório). Confirmar?")) return;
  ESTADO.respostas = {};
  ESTADO.responsaveisArea = {};
  recarregarTudoNaTela();
  salvar();
}

/* ---------------- Sessão colaborativa (jsonblob.com) ---------------- */
function obterSessaoDaURL(){
  const params = new URLSearchParams(window.location.search);
  return params.get("sessao");
}

function atualizarURLSessao(id){
  const url = new URL(window.location);
  if(id) url.searchParams.set("sessao", id);
  else url.searchParams.delete("sessao");
  history.replaceState({}, "", url);
}

function setColabStatus(msg, tipo){
  const el = document.getElementById("colab-status");
  if(!el) return;
  el.textContent = msg;
  el.className = "colab-status" + (tipo ? " " + tipo : "");
}

async function criarSessaoColaborativa(){
  setColabStatus("Criando sessão...");
  try{
    const resp = await fetch(JSONBLOB_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(ESTADO)
    });
    if(!resp.ok) throw new Error("status " + resp.status);
    const loc = resp.headers.get("Location") || resp.headers.get("location");
    if(!loc) throw new Error("sem identificador de sessão retornado");
    const id = loc.split("/").pop();
    ESTADO.sessaoId = id;
    atualizarURLSessao(id);
    iniciarPolling();
    setColabStatus("Sessão criada. Compartilhe o link abaixo.", "ok");
    atualizarPainelColab();
  }catch(err){
    console.warn(err);
    setColabStatus("Não foi possível criar a sessão colaborativa agora. Use exportar/importar JSON como alternativa.", "erro");
  }
}

async function enviarSessao(){
  if(!ESTADO.sessaoId) return;
  try{
    await fetch(`${JSONBLOB_BASE}/${ESTADO.sessaoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ESTADO)
    });
    setColabStatus("Sincronizado às " + horaAtual(), "ok");
  }catch(err){
    setColabStatus("Falha ao sincronizar — verifique a conexão.", "erro");
  }
}

async function receberSessao(silencioso){
  if(!ESTADO.sessaoId) return;
  try{
    const resp = await fetch(`${JSONBLOB_BASE}/${ESTADO.sessaoId}`);
    if(!resp.ok) throw new Error("status " + resp.status);
    const remoto = await resp.json();
    if(JSON.stringify(remoto) !== JSON.stringify(ESTADO)){
      remoto.sessaoId = ESTADO.sessaoId;
      ESTADO = Object.assign({ cartorio: "", titular: "", data: "", responsaveisArea: {}, respostas: {} }, remoto);
      recarregarTudoNaTela();
    }
    if(!silencioso) setColabStatus("Sincronizado às " + horaAtual(), "ok");
  }catch(err){
    if(!silencioso) setColabStatus("Não foi possível sincronizar agora.", "erro");
  }
}

function agendarEnvioSessao(){
  if(!ESTADO.sessaoId) return;
  clearTimeout(timerEnvioSessao);
  timerEnvioSessao = setTimeout(enviarSessao, 1500);
}

function iniciarPolling(){
  clearInterval(timerPolling);
  timerPolling = setInterval(() => receberSessao(true), 20000);
}

function encerrarSessaoColaborativa(){
  ESTADO.sessaoId = null;
  clearInterval(timerPolling);
  atualizarURLSessao(null);
  atualizarPainelColab();
}

function atualizarPainelColab(){
  const painel = document.getElementById("colab-painel");
  if(!painel) return;
  if(ESTADO.sessaoId){
    const link = window.location.origin + window.location.pathname + "?sessao=" + ESTADO.sessaoId;
    painel.innerHTML = `
      <h3>Sessão colaborativa ativa</h3>
      <p>Qualquer pessoa com este link pode preencher o checklist. As respostas são sincronizadas entre todos automaticamente — evite editar o mesmo item ao mesmo tempo que outra pessoa. Ao final, o(a) oficial gera o relatório normalmente.</p>
      <div class="colab-link-row">
        <input type="text" id="colab-link" value="${escapeAttr(link)}" readonly>
        <button class="btn primario" id="btn-copiar-link" type="button">Copiar link</button>
        <button class="btn" id="btn-sincronizar" type="button">Sincronizar agora</button>
        <button class="btn" id="btn-encerrar-sessao" type="button">Encerrar sessão</button>
      </div>
      <div class="colab-status" id="colab-status"></div>
    `;
    document.getElementById("btn-copiar-link").addEventListener("click", () => {
      navigator.clipboard.writeText(link).then(() => setColabStatus("Link copiado.", "ok"));
    });
    document.getElementById("btn-sincronizar").addEventListener("click", () => receberSessao(false).then(enviarSessao));
    document.getElementById("btn-encerrar-sessao").addEventListener("click", () => {
      if(confirm("Encerrar a sessão colaborativa? O link deixará de sincronizar novas respostas.")) encerrarSessaoColaborativa();
    });
  } else {
    painel.innerHTML = `
      <h3>Preenchimento colaborativo</h3>
      <p>Gere um link para que várias pessoas preencham o checklist ao mesmo tempo, cada uma na sua área. Depende de um serviço gratuito externo (jsonblob.com); se preferir não depender dele, use os botões "Exportar" / "Importar" para revezar o preenchimento manualmente.</p>
      <button class="btn primario" id="btn-criar-sessao" type="button">Criar link de preenchimento colaborativo</button>
      <div class="colab-status" id="colab-status"></div>
    `;
    document.getElementById("btn-criar-sessao").addEventListener("click", criarSessaoColaborativa);
  }
}

function alternarPainelColab(){
  const painel = document.getElementById("colab-painel");
  painel.style.display = (painel.style.display === "none" || !painel.style.display) ? "block" : "none";
}

/* ---------------- Inicialização ---------------- */
document.addEventListener("DOMContentLoaded", async () => {
  const sessaoURL = obterSessaoDaURL();

  montarNav();
  ligarCapa();

  if(sessaoURL){
    ESTADO.sessaoId = sessaoURL;
    await receberSessao(true);
    iniciarPolling();
  } else {
    carregarUltimoUsado();
  }

  recarregarTudoNaTela();

  document.getElementById("btn-exportar").addEventListener("click", exportarJSON);
  document.getElementById("btn-importar").addEventListener("click", () => document.getElementById("input-importar").click());
  document.getElementById("input-importar").addEventListener("change", (e) => {
    if(e.target.files[0]) importarJSON(e.target.files[0]);
  });
  document.getElementById("btn-novo").addEventListener("click", novoChecklist);
  document.getElementById("btn-colab").addEventListener("click", alternarPainelColab);
  document.getElementById("btn-relatorio-barra").addEventListener("click", () => selecionarArea("__relatorio__"));
  document.getElementById("btn-imprimir").addEventListener("click", () => window.print());
  document.getElementById("btn-imprimir-2").addEventListener("click", () => window.print());
  document.getElementById("btn-exportar-2").addEventListener("click", exportarJSON);
});
