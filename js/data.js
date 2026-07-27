/* ============================================================
   Checklist de Conformidade Correcional — Registro de Imóveis
   Base construída a partir do Boletim de Inspeções CNJ (KollGEN),
   Inspeção ordinária CGJ/SP — 4 a 8 de maio de 2026.

   Cada item traz: pergunta objetiva, referência (item da ata + norma)
   e a providência recomendada quando a resposta for "Não" ou "Parcial".
   As referências não identificam a serventia inspecionada — mantêm
   apenas o número do item correcional e a norma/lei citada na ementa.
   ============================================================ */

const AREAS = [
  {
    id: "financeiro",
    sigla: "F",
    nome: "Financeiro e Fiscal",
    descricao: "Depósito prévio, livro-caixa, provisionamento e teto remuneratório.",
    itens: [
      {
        id: "F1",
        pergunta: "O depósito prévio é escriturado pelo regime de caixa, e não pelo regime de competência?",
        referencia: "Art. 34 do Decreto n. 9.580/2018; Soluções de Consulta Cosit n. 183 e 278/2023; Manual de Orientação Tributária – Cartórios/RFB (04/2026) — Itens CNJ 10.2.5; 10.4.13; 10.6.5; 10.7.8.3; 10.8.13.1.5",
        providencia: "Adequar a escrituração contábil do depósito prévio ao regime de caixa exigido dos delegatários."
      },
      {
        id: "F2",
        pergunta: "Existe e está atualizado o Livro de Controle de Depósito Prévio?",
        referencia: "Art. 188 do Provimento CNJ n. 149/2023 — Itens CNJ 10.2.5; 10.4.13",
        providencia: "Abrir e manter o Livro de Controle de Depósito Prévio, com lançamentos regulares."
      },
      {
        id: "F3",
        pergunta: "Os valores são discriminados de forma detalhada em recibos, selos e no corpo dos atos registrais (e não apenas o número do selo)?",
        referencia: "Art. 14, parágrafo único, da Lei n. 6.015/1973 — Achado transversal, Boletim CNJ",
        providencia: "Padronizar a discriminação detalhada dos valores em recibos, selos e no corpo dos atos."
      },
      {
        id: "F4",
        pergunta: "Existe conta bancária específica e segregada para depósitos prévios, sem confusão patrimonial com recursos próprios da serventia?",
        referencia: "Achado transversal, Boletim CNJ — Itens CNJ 10.7.8.3; 10.8.13.1.5",
        providencia: "Abrir conta bancária segregada exclusiva para depósitos prévios."
      },
      {
        id: "F5",
        pergunta: "Há procedimento padronizado para devolução de valores de depósito prévio quando o ato não é praticado, retendo apenas a parcela de prenotação?",
        referencia: "Determinações (30/60 dias), Achado transversal, Boletim CNJ",
        providencia: "Instituir procedimento formal e padronizado de devolução de valores não utilizados."
      },
      {
        id: "F6",
        pergunta: "A escrituração dos livros de depósito prévio e caixa está regular e é comprovável a qualquer momento?",
        referencia: "Itens CNJ 10.4.13; 10.6.8",
        providencia: "Regularizar e manter comprovável a escrituração dos livros de depósito prévio e caixa."
      },
      {
        id: "F7",
        pergunta: "O provisionamento de verbas trabalhistas de interinos é realizado em duas contas distintas (férias/13º salário e verbas rescisórias, esta judicialmente vinculada)?",
        referencia: "Item 14.7.3 das Normas de Serviço, redação do Provimento CGJ/SP n. 18/2024 — Item CNJ 3.6.10.2.1",
        providencia: "Regularizar o provisionamento em duas contas distintas conforme as Normas de Serviço."
      },
      {
        id: "F8",
        pergunta: "Foi realizado estudo técnico e, se necessário, constituído fundo de provisionamento trabalhista para os colaboradores da serventia, compatível com o passivo estimado?",
        referencia: "Itens CNJ 10.6.8; 10.6.9 / Rec. 3.6.20.1",
        providencia: "Elaborar estudo técnico e constituir fundo de provisionamento trabalhista compatível com o passivo estimado, quando aplicável."
      }
    ]
  },
  {
    id: "rh",
    sigla: "RH",
    nome: "Recursos Humanos e Governança",
    descricao: "Capacitação, integridade, exercício pessoal da delegação, teto remuneratório e prazos correcionais.",
    itens: [
      {
        id: "RH1",
        pergunta: "Existe programa institucional de capacitação periódica em proteção de dados pessoais (LGPD) para todos os colaboradores e prepostos?",
        referencia: "Det. 3.6.19.3.13 — Item CNJ 3.6.15",
        providencia: "Instituir programa periódico de capacitação em LGPD para servidores, delegatário, interinos e prepostos."
      },
      {
        id: "RH2",
        pergunta: "Há programa de capacitação continuada dos escreventes e colaboradores?",
        referencia: "Boas práticas identificadas pela inspeção CNJ — Item CNJ 10.1",
        providencia: "Estruturar programa contínuo de capacitação interna dos colaboradores."
      },
      {
        id: "RH3",
        pergunta: "São realizadas pesquisas periódicas de clima organizacional com os colaboradores?",
        referencia: "Boa prática identificada pela inspeção CNJ (índice de satisfação superior a 95%) — Item CNJ 10.1",
        providencia: "Implantar pesquisa periódica de clima organizacional."
      },
      {
        id: "RH4",
        pergunta: "Existe sistema interno de integridade (regimento, código de ética, canal de denúncias, comitê de ética, due diligence de colaboradores e fornecedores)?",
        referencia: "Boas práticas identificadas pela inspeção CNJ — Item CNJ 10.1",
        providencia: "Implantar sistema interno de integridade com canal de denúncias e due diligence de colaboradores e fornecedores."
      },
      {
        id: "RH5",
        pergunta: "O(a) oficial(a) registrador(a) exerce pessoalmente a direção, supervisão e gestão da unidade, evitando risco de subdelegação vedada?",
        referencia: "Rec. 3.6.20.1",
        providencia: "Reforçar o exercício pessoal da delegação na direção, supervisão e gestão da unidade."
      },
      {
        id: "RH6",
        pergunta: "Há oficial de cumprimento formalmente nomeado para as obrigações de PLD/FTP junto ao SISCOAF/UIF?",
        referencia: "Itens CNJ 10.4.11; 10.8.10",
        providencia: "Nomear formalmente o oficial de cumprimento responsável pelas comunicações ao SISCOAF/UIF."
      },
      {
        id: "RH7",
        pergunta: "A remuneração de colaboradores e a receita líquida do delegatário (titular ou interino) respeitam o teto de subsídio de Ministro do STF, com o excedente recolhido conforme as normas aplicáveis, ou há autorização fundamentada da Corregedoria para eventual excesso?",
        referencia: "Art. 21 da Lei n. 8.935/1994; jurisprudência do STF sobre teto remuneratório de delegatários — Itens CNJ 3.6.10.2; 10.4.11 / Det. 10.4.13",
        providencia: "Ajustar remunerações ao teto legal ou formalizar justificativa fundamentada perante a Corregedoria — aplicável tanto a titulares quanto a interinos."
      },
      {
        id: "RH8",
        pergunta: "A serventia mantém organizados os atos normativos editados ou, na ausência destes, o cronograma e as providências relativas à implementação do Provimento CNJ n. 220/2026, para eventual prestação de informações à Corregedoria?",
        referencia: "Determinação (30 dias): informar à Corregedoria Nacional o estágio de implementação das disposições do Provimento CNJ n. 220/2026, encaminhando os atos normativos editados ou, se pendente a adequação, o cronograma e as providências previstas — Item CNJ 3.6.19.1.1",
        providencia: "Reunir e manter atualizados os atos normativos, ou o cronograma de adequação, referentes ao Provimento CNJ n. 220/2026."
      }
    ]
  },
  {
    id: "arquivo",
    sigla: "AR",
    nome: "Arquivo e Acervo",
    descricao: "Transmissão de acervo, guarda de documentos, preservação e continuidade.",
    itens: [
      {
        id: "AR1",
        pergunta: "Em caso de vacância, foi ou será formalizada ata de transmissão de acervo e inventário patrimonial entre o titular anterior e o interino/sucessor?",
        referencia: "Item 10.5.1 do Tomo II das Normas Locais — Item CNJ 10.4.11 / Det. 10.4.13",
        providencia: "Realizar com urgência a ata de transmissão de acervo e o inventário patrimonial."
      },
      {
        id: "AR2",
        pergunta: "Todos os arquivos, atos e documentos da serventia estão sob guarda no próprio cartório, sem uso de computadores ou equipamentos particulares de escreventes?",
        referencia: "Item CNJ 10.4.11",
        providencia: "Adquirir equipamentos próprios e recolher ao cartório todos os arquivos e atos mantidos em máquinas particulares."
      },
      {
        id: "AR3",
        pergunta: "Documentos históricos ou de valor especial sob guarda da serventia possuem proposta formal de preservação, catalogação e destinação institucional adequada?",
        referencia: "Achado da inspeção CNJ em acervo histórico sob guarda de serventia — Det. 10.8.13.3.1",
        providencia: "Apresentar ao Juízo Corregedor Permanente proposta formal de preservação, catalogação e destinação dos documentos."
      },
      {
        id: "AR4",
        pergunta: "Há rotina de backup e plano de continuidade para o acervo digital e físico da serventia?",
        referencia: "Achado da inspeção CNJ — plano de saneamento — Det. 10.3.9",
        providencia: "Estruturar plano de backup, continuidade e conservação do acervo, com seguro contra sinistros."
      }
    ]
  },
  {
    id: "ti",
    sigla: "TI",
    nome: "Tecnologia da Informação e Proteção de Dados",
    descricao: "Sistemas, selo digital, Justiça Aberta, LGPD e acessibilidade digital.",
    itens: [
      {
        id: "TI1",
        pergunta: "O sistema informatizado da serventia possui log de acesso e trilha de auditoria que identifique o responsável por cada ato praticado ou alterado?",
        referencia: "Det. 10.3.9",
        providencia: "Substituir/adequar o sistema para garantir log de acesso e trilha de auditoria de todos os atos."
      },
      {
        id: "TI2",
        pergunta: "O cálculo de emolumentos é realizado de forma fidedigna pelo próprio sistema (e não em planilhas paralelas)?",
        referencia: "Det. 10.3.9",
        providencia: "Implantar cálculo automatizado e fidedigno de emolumentos no sistema principal."
      },
      {
        id: "TI3",
        pergunta: "Existe plano de atualização ou substituição de sistemas e infraestrutura de TI defasados?",
        referencia: "Det. 10.3.9; Det. 10.4.13",
        providencia: "Elaborar plano de atualização estrutural e de TI, com cronograma e responsáveis."
      },
      {
        id: "TI4",
        pergunta: "O selo digital é gerado com controle centralizado, evitando saltos de numeração ou atos não transmitidos ('selos em branco')?",
        referencia: "Item CNJ 3.6.12 / Det. 3.6.19.3.1 a 3.6.19.3.8",
        providencia: "Avaliar/adotar mecanismo centralizado de pré-reserva e rastreamento de identificadores de selo."
      },
      {
        id: "TI5",
        pergunta: "O prazo de transmissão dos selos e as retificações de atos (até 72h) são acompanhados, com histórico de retificações preservado e visível?",
        referencia: "Item CNJ 3.6.12.1 / Det. 3.6.19.3.5 a 3.6.19.3.7",
        providencia: "Reduzir o prazo de transmissão e preservar/exibir o histórico de retificações."
      },
      {
        id: "TI6",
        pergunta: "Atos transmitidos com valor zerado (dependentes de retificação posterior) são identificados e monitorados por alertas automáticos?",
        referencia: "Det. 3.6.19.3.6",
        providencia: "Desenvolver alertas automáticos para atos zerados, retificações, cancelamentos e exclusões atípicos."
      },
      {
        id: "TI7",
        pergunta: "O Sistema Justiça Aberta é alimentado de forma correta e atualizada (produtividade, situação da delegação, dados cadastrais)?",
        referencia: "Item CNJ 3.6.10.3 / Det. 3.6.19.2.3",
        providencia: "Instituir rotina periódica de atualização e conferência dos dados no Justiça Aberta."
      },
      {
        id: "TI8",
        pergunta: "O DPO (Encarregado de Proteção de Dados) está formalmente designado e a política de proteção de dados é divulgada a usuários e colaboradores?",
        referencia: "Boas práticas e achados da inspeção CNJ — Item CNJ 10.6.8",
        providencia: "Designar formalmente o DPO e divulgar a política de proteção de dados."
      },
      {
        id: "TI9",
        pergunta: "A serventia dispõe de sinalização tátil e demais recursos de acessibilidade física e digital ao público?",
        referencia: "Det. 10.6.9",
        providencia: "Implantar sinalização tátil e demais recursos de acessibilidade."
      }
    ]
  },
  {
    id: "instalacoes",
    sigla: "IN",
    nome: "Instalações e Segurança Predial",
    descricao: "Regularidade predial, cessões de uso e proteção patrimonial do acervo.",
    itens: [
      {
        id: "IN1",
        pergunta: "A serventia possui alvará de localização válido junto à Municipalidade?",
        referencia: "Det. 10.7.12.1",
        providencia: "Adotar as providências perante a Municipalidade para obtenção do alvará de localização, comprovando o protocolo."
      },
      {
        id: "IN2",
        pergunta: "Eventuais cessões ou sublocações de áreas do cartório (ex.: estacionamento) estão formalizadas contratualmente e cobertas por seguro?",
        referencia: "Item CNJ 10.4.11",
        providencia: "Formalizar contratualmente qualquer cessão de área e providenciar cobertura de seguro."
      },
      {
        id: "IN3",
        pergunta: "O acervo (livros, títulos e documentos) está protegido por seguro contra sinistros?",
        referencia: "Det. 10.3.9",
        providencia: "Contratar seguro contra sinistros para proteção do acervo."
      }
    ]
  },
  {
    id: "pldftp",
    sigla: "PLD",
    nome: "PLD/FTP e Prevenção à Fraude",
    descricao: "Comunicações ao COAF/UIF, capacitação e protocolos antifraude.",
    itens: [
      {
        id: "PLD1",
        pergunta: "A serventia comunica ao COAF/UIF (via SCAF) operações com indícios de lavagem de dinheiro ou financiamento ao terrorismo, adotando critérios que vão além do mero valor em espécie?",
        referencia: "Item CNJ 3.6.16 / Det. 3.6.19.3.14",
        providencia: "Revisar os critérios de comunicação ao COAF/UIF, superando o critério único de valor em espécie.",
        extra: { chave: "totalComunicacoes", label: "Total de comunicações ao COAF/UIF realizadas desde 2020", tipo: "number", placeholder: "Ex.: 38" }
      },
      {
        id: "PLD2",
        pergunta: "Há capacitação periódica dos colaboradores em PLD/FTP e nas comunicações obrigatórias ao COAF?",
        referencia: "Det. 3.6.19.3.14",
        providencia: "Promover capacitação periódica em PLD/FTP e comunicações ao COAF."
      },
      {
        id: "PLD3",
        pergunta: "Existe protocolo interno formal de prevenção, identificação e comunicação de fraudes documentais (falsificações, discrepância entre valor declarado e valor de mercado, usurpação de identidade)?",
        referencia: "Achados e boas práticas identificados pela inspeção CNJ — Det. 10.8.13",
        providencia: "Formalizar protocolo interno de prevenção, identificação e comunicação de fraudes."
      }
    ]
  },
  {
    id: "registroimoveis",
    sigla: "RI",
    nome: "Registro de Imóveis — Processos Fins",
    descricao: "Qualificação registral, usucapião, aquisição por estrangeiros, Reurb e notificações extrajudiciais.",
    itens: [
      {
        id: "RI1",
        pergunta: "Em pedidos de usucapião extrajudicial, há diligência específica para identificar a utilização em série da modalidade em um mesmo empreendimento ou condomínio?",
        referencia: "Art. 410, §2º, do CNN/CN/CNJ-Extra — Det. 10.2.9.1.10",
        providencia: "Instituir diligência específica de aferição da utilização em série da usucapião extraordinária."
      },
      {
        id: "RI2",
        pergunta: "Os atos registrais decorrentes de usucapião incluem todos os elementos cadastrais essenciais do imóvel, inclusive o CEP (princípio da especialidade objetiva)?",
        referencia: "Art. 440-AQ, §1º, do CNN/CN/CNJ-Extra — Det. 10.2.9.1.11",
        providencia: "Padronizar a inclusão de todos os elementos cadastrais essenciais, inclusive CEP, no ato registral."
      },
      {
        id: "RI3",
        pergunta: "As atas notariais de usucapião recebidas são qualificadas com rigor, com devolução quando se limitarem a reproduzir declarações das partes?",
        referencia: "Itens CNJ 10.6.8; 10.6.9",
        providencia: "Instituir rotina de qualificação rigorosa das atas notariais de usucapião, com nota devolutiva quando cabível."
      },
      {
        id: "RI4",
        pergunta: "Toda aquisição de imóvel rural por estrangeiro é submetida a análise prévia, com sistema e base cartográfica próprios, antes da qualificação registral positiva?",
        referencia: "Item CNJ 3.6.18",
        providencia: "Implantar/manter sistema próprio de análise prévia de aquisição de terras rurais por estrangeiros."
      },
      {
        id: "RI5",
        pergunta: "Havendo indícios de extrapolação dos limites legais de aquisição por estrangeiros, é instaurado Pedido de Providências com remessa ao INCRA e suspensão do registro?",
        referencia: "Item CNJ 3.6.18",
        providencia: "Formalizar fluxo de instauração de Pedido de Providências e remessa ao INCRA em casos de indício de extrapolação."
      },
      {
        id: "RI6",
        pergunta: "A atuação em processos de Regularização Fundiária Urbana (Reurb) se limita à fiscalização e orientação normativa, sem assunção de funções executivas de política pública?",
        referencia: "Item CNJ 3.6.17; itens 297 a 324 das Normas de Serviço",
        providencia: "Reafirmar, em manual interno, os limites da atuação registral em processos de Reurb, sem assunção de função executiva."
      },
      {
        id: "RI7",
        pergunta: "Os valores recebidos de terceiros para notificações extrajudiciais (ex.: purga de mora em alienação fiduciária) são regularmente escriturados em conta própria do RI?",
        referencia: "Manual de Orientação Tributária – Cartórios/RFB (29/04/2026) — Det. 10.7.12.1",
        providencia: "Escriturar de forma segregada e rastreável os valores recebidos para notificações extrajudiciais."
      }
    ]
  },
  {
    id: "ouvidoria",
    sigla: "OV",
    nome: "Atendimento ao Público e Ouvidoria",
    descricao: "Tratamento e consolidação estatística das manifestações de usuários.",
    itens: [
      {
        id: "OV1",
        pergunta: "As manifestações de usuários (reclamações, sugestões, dúvidas) recebidas pela serventia são registradas e classificadas estatisticamente (natureza, tempo de resposta, providência adotada)?",
        referencia: "Item CNJ 3.6.9 / Det. 3.6.19.2.2",
        providencia: "Implementar rotina de identificação, classificação, consolidação e tratamento estatístico das manifestações de usuários."
      }
    ]
  },
  {
    id: "vulneraveis",
    sigla: "PV",
    nome: "Proteção de Pessoas Vulneráveis",
    descricao: "Prevenção à violência patrimonial em atos que envolvam idosos e pessoas vulneráveis.",
    itens: [
      {
        id: "PV1",
        pergunta: "Existe protocolo de governança por escrito para identificar e coibir atos que possam envolver violência patrimonial contra idosos, mulheres e a população vulnerável em geral?",
        referencia: "Provimento CNJ n. 222/2026 — Item CNJ 10.5.10.3",
        providencia: "Elaborar e formalizar protocolo de governança para identificação e prevenção de violência patrimonial."
      },
      {
        id: "PV2",
        pergunta: "Existe check-list padronizado de cautelas para atendimento ou qualificação de títulos envolvendo pessoas idosas, vulneráveis ou com possível limitação de compreensão, incluindo, quando aplicável, entrevista reservada?",
        referencia: "Item CNJ 10.8.14.1",
        providencia: "Padronizar check-list de cautelas para atos ou atendimentos envolvendo pessoas idosas ou vulneráveis."
      }
    ]
  }
];

/* Metadados da fonte, exibidos no rodapé/relatório */
const FONTE = {
  titulo: "Boletim de Inspeções CNJ (KollGEN)",
  inspecao: "Inspeção ordinária da Corregedoria Nacional de Justiça — Foro Extrajudicial",
  tribunal: "Tribunal de Justiça do Estado de São Paulo",
  periodo: "4 a 8 de maio de 2026"
};

/* Links verificados para normas citadas nas referências.
   Só entram aqui links confirmados — evita apontar para URL incorreta.
   Para adicionar novos, inclua { re: /padrão/gi, url: "https://..." }. */
const NORMA_LINKS = [
  { re: /Provimento CNJ n\.\s?222\/2026/gi, url: "https://atos.cnj.jus.br/atos/detalhar/6882" },
  { re: /Lei n\.\s?6\.015\/1973/gi, url: "https://www.planalto.gov.br/ccivil_03/leis/l6015.htm" },
  { re: /Lei n\.\s?8\.935\/1994/gi, url: "https://www.planalto.gov.br/ccivil_03/leis/l8935.htm" },
  { re: /Decreto n\.\s?9\.580\/2018/gi, url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/decreto/d9580.htm" }
];
