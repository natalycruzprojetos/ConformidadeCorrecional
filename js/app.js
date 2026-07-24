/* ============================================================
   Checklist de Conformidade Correcional — app.js
   ============================================================ */

const STORAGE_PREFIX = "checklist-ri-cnj::";

let ESTADO = {
  cartorio: "",
  titular: "",
  data: "",
  respostas: {} // { itemId: { status: 'sim'|'parcial'|'nao', responsavel, detalhes } }
};

/* ---------------- Persistência ---------------- */
function chaveAtual(){
  const nome = (ESTADO.cartorio || "sem-nome").trim().toLowerCase().replace(/\s+/g, "-");
  return STORAGE_PREFIX + nome;
}

function salvar(){
  try{
    localStorage.setItem(chaveAtual(), JSON.stringify(ESTADO));
    localStorage.setItem(STORAGE_PREFIX + "ultimo", chaveAtual());
  }catch(e){ console.warn("Não foi possível salvar localmente:", e); }
}

function carregarPorCartorio(){
  const chave = chaveAtual();
  try{
    const raw = localStorage.getItem(chave);
    if(raw){
      const dados = JSON.parse(raw);
      ESTADO.respostas = dados.respostas || {};
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
      if(raw){
        const dados = JSON.parse(raw);
        ESTADO = Object.assign(ESTADO, dados);
      }
    }
  }catch(e){ console.warn(e); }
}

/* ---------------- Construção da UI ---------------- */
function totalItens(){
  return AREAS.reduce((acc, a) => acc + a.itens.length, 0);
}

function montarNav(){
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  AREAS.forEach((area, idx) => {
    const btn = document.createElement("button");
    btn.className = "nav-btn" + (idx === 0 ? " ativo" : "");
    btn.dataset.area = area.id;
    btn.innerHTML = `<span class="sigla">${area.sigla}</span> ${area.nome}`;
    btn.addEventListener("click", () => selecionarArea(area.id));
    nav.appendChild(btn);
  });
  const btnRel = document.createElement("button");
  btnRel.className = "nav-btn relatorio";
  btnRel.innerHTML = `<span class="sigla">✓</span> Relatório`;
  btnRel.addEventListener("click", () => selecionarArea("__relatorio__"));
  nav.appendChild(btnRel);
}

function montarAreas(){
  const cont = document.getElementById("areas");
  cont.innerHTML = "";
  AREAS.forEach((area, idx) => {
    const sec = document.createElement("section");
    sec.className = "area" + (idx === 0 ? " ativa" : "");
    sec.id = "area-" + area.id;

    const head = document.createElement("div");
    head.className = "area-head";
    head.innerHTML = `<h2>${area.nome}</h2><span class="contagem">${area.itens.length} itens</span>`;
    sec.appendChild(head);

    const desc = document.createElement("p");
    desc.className = "area-desc";
    desc.textContent = area.descricao;
    sec.appendChild(desc);

    area.itens.forEach(item => sec.appendChild(montarItem(item)));
    cont.appendChild(sec);
  });
}

function montarItem(item){
  const card = document.createElement("article");
  card.className = "item";
  card.id = "item-" + item.id;

  const resp = ESTADO.respostas[item.id] || {};

  card.innerHTML = `
    <div class="item-top">
      <span class="item-id">${item.id}</span>
      <div class="item-pergunta">${item.pergunta}</div>
    </div>
    <div class="item-ref"><b>Referência:</b> ${item.referencia}</div>
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
    <div class="grid-2">
      <div class="campo">
        <label for="resp-${item.id}">Responsável</label>
        <input type="text" id="resp-${item.id}" placeholder="Nome / setor" value="${escapeAttr(resp.responsavel || "")}">
      </div>
      <div class="campo">
        <label for="det-${item.id}">Detalhes / evidências / procedimento adotado</label>
        <textarea id="det-${item.id}" placeholder="Descreva o procedimento atual, evidências ou plano de ação...">${escapeHtml(resp.detalhes || "")}</textarea>
      </div>
    </div>
  `;

  card.querySelectorAll('input[type="radio"]').forEach(r => {
    r.addEventListener("change", () => atualizarResposta(item.id));
  });
  card.querySelector(`#resp-${item.id}`).addEventListener("input", () => atualizarResposta(item.id));
  card.querySelector(`#det-${item.id}`).addEventListener("input", () => atualizarResposta(item.id));

  return card;
}

function atualizarResposta(itemId){
  const status = document.querySelector(`input[name="status-${itemId}"]:checked`);
  const responsavel = document.getElementById(`resp-${itemId}`).value;
  const detalhes = document.getElementById(`det-${itemId}`).value;
  ESTADO.respostas[itemId] = {
    status: status ? status.value : null,
    responsavel,
    detalhes
  };
  salvar();
  atualizarProgresso();
}

function escapeHtml(s){
  return String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}
function escapeAttr(s){
  return escapeHtml(s).replace(/"/g, "&quot;");
}

/* ---------------- Navegação entre abas ---------------- */
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

/* ---------------- Progresso ---------------- */
function atualizarProgresso(){
  const total = totalItens();
  const respondidos = Object.values(ESTADO.respostas).filter(r => r && r.status).length;
  const pct = total ? Math.round((respondidos / total) * 100) : 0;
  document.getElementById("progresso-txt").textContent = `${respondidos} de ${total} itens respondidos (${pct}%)`;
  document.getElementById("progresso-fill").style.width = pct + "%";
}

/* ---------------- Cabeçalho (capa) ---------------- */
function ligarCapa(){
  const inCartorio = document.getElementById("in-cartorio");
  const inTitular = document.getElementById("in-titular");
  const inData = document.getElementById("in-data");

  inCartorio.value = ESTADO.cartorio;
  inTitular.value = ESTADO.titular;
  inData.value = ESTADO.data;

  inCartorio.addEventListener("change", () => {
    ESTADO.cartorio = inCartorio.value;
    carregarPorCartorio();
    inTitular.value = ESTADO.titular;
    inData.value = ESTADO.data;
    recarregarRespostasNaTela();
    salvar();
  });
  inTitular.addEventListener("input", () => { ESTADO.titular = inTitular.value; salvar(); });
  inData.addEventListener("input", () => { ESTADO.data = inData.value; salvar(); });
}

function recarregarRespostasNaTela(){
  AREAS.forEach(area => area.itens.forEach(item => {
    const resp = ESTADO.respostas[item.id] || {};
    document.querySelectorAll(`input[name="status-${item.id}"]`).forEach(r => {
      r.checked = (r.value === resp.status);
    });
    const rEl = document.getElementById(`resp-${item.id}`);
    const dEl = document.getElementById(`det-${item.id}`);
    if(rEl) rEl.value = resp.responsavel || "";
    if(dEl) dEl.value = resp.detalhes || "";
  }));
  atualizarProgresso();
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
  let cor = "#2F5233", rotulo = "CONFORME";
  if(pct < 60){ cor = "#8C2F22"; rotulo = "CRÍTICO"; }
  else if(pct < 85){ cor = "#96691E"; rotulo = "ATENÇÃO"; }

  return `
  <svg class="selo-svg" width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-label="Selo de conformidade: ${pct}%">
    <circle cx="64" cy="64" r="60" fill="none" stroke="${cor}" stroke-width="2.5" stroke-dasharray="2 4"/>
    <circle cx="64" cy="64" r="52" fill="none" stroke="${cor}" stroke-width="1.4"/>
    <path id="arcotxt" d="M 64 12 A 52 52 0 1 1 63.9 12" fill="none"/>
    <text x="64" y="46" text-anchor="middle" font-size="24" font-weight="700" fill="${cor}">${pct}%</text>
    <text x="64" y="64" text-anchor="middle" font-size="9" letter-spacing="1.5" fill="${cor}">${rotulo}</text>
    <text x="64" y="88" text-anchor="middle" font-size="7" letter-spacing="1" fill="${cor}" opacity="0.75">CONFORMIDADE</text>
    <text x="64" y="99" text-anchor="middle" font-size="6.5" letter-spacing=".5" fill="${cor}" opacity="0.6">CORREIÇÃO CNJ</text>
  </svg>`;
}

function textoConclusao(stats){
  const { sim, parcial, nao, pendente, total, score } = stats;
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
  let pendenteTxt = pendente > 0
    ? ` Há ainda ${pendente} item(ns) sem resposta — recomenda-se concluir o preenchimento antes de considerar o diagnóstico definitivo.`
    : "";
  return `<p><b>${nivel}</b></p><p>${orientacao}${pendenteTxt}</p>`;
}

function gerarRelatorio(){
  const stats = calcularEstatisticas();

  document.getElementById("rel-cartorio").textContent = ESTADO.cartorio || "Cartório não identificado";
  document.getElementById("rel-titular").textContent = ESTADO.titular ? `Titular/responsável: ${ESTADO.titular}` : "";
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
    bloco.innerHTML = `<h3>${area.nome} <span class="tag">${okArea}/${totalArea} conforme</span></h3>`;

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
        div.innerHTML = `
          <div class="p-titulo">${item.id} — ${item.pergunta}</div>
          <div class="p-ref">${item.referencia}</div>
          <div class="p-prov"><b>Status:</b> ${statusTxt}. <b>Providência recomendada:</b> ${item.providencia}</div>
          ${(r && (r.responsavel || r.detalhes)) ? `<div class="p-meta">${r.responsavel ? "Responsável indicado: " + escapeHtml(r.responsavel) + ". " : ""}${r.detalhes ? escapeHtml(r.detalhes) : ""}</div>` : ""}
        `;
        bloco.appendChild(div);
      });
    }
    cont.appendChild(bloco);
  });
}

function formatarData(iso){
  if(!iso) return "";
  const [a,m,d] = iso.split("-");
  return `${d}/${m}/${a}`;
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
      ESTADO = Object.assign({ cartorio: "", titular: "", data: "", respostas: {} }, dados);
      document.getElementById("in-cartorio").value = ESTADO.cartorio;
      document.getElementById("in-titular").value = ESTADO.titular;
      document.getElementById("in-data").value = ESTADO.data;
      recarregarRespostasNaTela();
      salvar();
      alert("Respostas importadas com sucesso.");
    }catch(err){
      alert("Não foi possível importar este arquivo. Verifique se é um JSON exportado por este checklist.");
    }
  };
  reader.readAsText(file);
}

function novoChecklist(){
  if(!confirm("Isso vai limpar todas as respostas preenchidas para este cartório (mantendo o nome do cartório). Confirmar?")) return;
  ESTADO.respostas = {};
  recarregarRespostasNaTela();
  salvar();
}

/* ---------------- Inicialização ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  carregarUltimoUsado();
  montarNav();
  montarAreas();
  ligarCapa();
  recarregarRespostasNaTela();

  document.getElementById("btn-exportar").addEventListener("click", exportarJSON);
  document.getElementById("btn-importar").addEventListener("click", () => document.getElementById("input-importar").click());
  document.getElementById("input-importar").addEventListener("change", (e) => {
    if(e.target.files[0]) importarJSON(e.target.files[0]);
  });
  document.getElementById("btn-novo").addEventListener("click", novoChecklist);
  document.getElementById("btn-relatorio").addEventListener("click", () => selecionarArea("__relatorio__"));
  document.getElementById("btn-imprimir").addEventListener("click", () => window.print());
  document.getElementById("btn-imprimir-2").addEventListener("click", () => window.print());
});
