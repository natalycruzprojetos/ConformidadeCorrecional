/* ============================================================
   Checklist de Conformidade Correcional — Registro de Imóveis
   Base construída a partir do Boletim de Inspeções CNJ (KollGEN),
   Inspeção ordinária CGJ/SP — 4 a 8 de maio de 2026.
   Cada item traz: pergunta objetiva, referência (item da ata + norma)
   e a providência recomendada quando a resposta for "Não" ou "Parcial".
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
        referencia: "Achado transversal — 13º RI de São Paulo e 29º Subdistrito (Santo Amaro) — Itens CNJ 10.7.8.3; 10.8.13.1.5",
        providencia: "Abrir conta bancária segregada exclusiva para depósitos prévios."
      },
      {
        id: "F5",
        pergunta: "Há procedimento padronizado para devolução de valores de depósito prévio quando o ato não é praticado, retendo apenas a parcela de prenotação?",
        referencia: "Determinações (30/60 dias) — Achado transversal, Boletim CNJ",
        providencia: "Instituir procedimento formal e padronizado de devolução de valores não utilizados."
      },
      {
        id: "F6",
        pergunta: "O provisionamento de verbas trabalhistas de interinos é realizado em duas contas distintas (férias/13º salário e verbas rescisórias, esta judicialmente vinculada)?",
        referencia: "Item 14.7.3 das Normas de Serviço, redação do Provimento CGJ/SP n. 18/2024 — Item CNJ 3.6.10.2.1",
        providencia: "Regularizar o provisionamento em duas contas distintas conforme as Normas de Serviço."
      },
      {
        id: "F7",
        pergunta: "Foi realizado estudo técnico e constituído fundo de provisionamento trabalhista para os colaboradores da serventia, considerando o passivo estimado?",
        referencia: "9º RI de São Paulo (necessidade estimada de R$ 9.000.000,00) — Itens CNJ 10.6.8; 10.6.9 / Rec. 3.6.20.1",
        providencia: "Elaborar estudo técnico e constituir fundo de provisionamento trabalhista compatível com o passivo estimado."
      },
      {
        id: "F8",
        pergunta: "As remunerações de colaboradores respeitam o teto de 90,25% do subsídio de Ministro do STF, ou há autorização fundamentada da CGJ para eventual excesso?",
        referencia: "4º Tabelionato de Notas da Capital — Item 10.5.2 do Código de Normas local e jurisprudência do STF — Item CNJ 10.4.11 / Det. 10.4.13",
        providencia: "Ajustar remunerações ao teto legal ou formalizar justificativa fundamentada perante a Corregedoria."
      },
      {
        id: "F9",
        pergunta: "A escrituração dos livros de depósito prévio e caixa está regular e é comprovável a qualquer momento?",
        referencia: "Itens CNJ 10.4.13; 10.6.8",
        providencia: "Regularizar e manter comprovável a escrituração dos livros de depósito prévio e caixa."
      },
      {
        id: "F10",
        pergunta: "Os valores recebidos de terceiros para notificações extrajudiciais (ex.: purga de mora em alienação fiduciária) são regularmente escriturados em conta própria do RI?",
        referencia: "13º RI de São Paulo; Manual de Orientação Tributária – Cartórios/RFB (29/04/2026) — Item CNJ 10.7.8.3 / Det. 10.7.12.1",
        providencia: "Escriturar de forma segregada e rastreável os valores recebidos para notificações extrajudiciais."
      }
    ]
  },
  {
    id: "rh",
    sigla: "RH",
    nome: "Recursos Humanos e Governança",
    descricao: "Capacitação, integridade, exercício pessoal da delegação e cumprimento de prazos correcionais.",
    itens: [
      {
        id: "RH1",
        pergunta: "Existe programa institucional de capacitação periódica em proteção de dados pessoais (LGPD) para todos os colaboradores e prepostos?",
        referencia: "Det. 3.6.19.3.13 — Item CNJ 3.6.15",
        providencia: "Instituir programa periódico de capacitação em LGPD para magistrados (se aplicável), servidores, delegatário, interinos e prepostos."
      },
      {
        id: "RH2",
        pergunta: "Há programa de capacitação continuada dos escreventes e colaboradores (ex.: modelo tipo 'Escola de Escreventes')?",
        referencia: "Boas práticas — 1º RI, TD e RCPJ de Jundiaí — Item CNJ 10.1",
        providencia: "Estruturar programa contínuo de capacitação interna dos colaboradores."
      },
      {
        id: "RH3",
        pergunta: "São realizadas pesquisas periódicas de clima organizacional com os colaboradores?",
        referencia: "Boas práticas — 1º RI, TD e RCPJ de Jundiaí (97,94% de satisfação em 2025) — Item CNJ 10.1",
        providencia: "Implantar pesquisa periódica de clima organizacional."
      },
      {
        id: "RH4",
        pergunta: "Existe sistema interno de integridade (regimento, código de ética, canal de denúncias, comitê de ética, due diligence de colaboradores e fornecedores)?",
        referencia: "Boas práticas — 1º RI, TD e RCPJ de Jundiaí — Item CNJ 10.1",
        providencia: "Implantar sistema interno de integridade com canal de denúncias e due diligence de colaboradores e fornecedores."
      },
      {
        id: "RH5",
        pergunta: "O(a) oficial(a) registrador(a) exerce pessoalmente a direção, supervisão e gestão da unidade, evitando risco de subdelegação vedada?",
        referencia: "9º RI de São Paulo — Rec. 3.6.20.1",
        providencia: "Reforçar o exercício pessoal da delegação na direção, supervisão e gestão da unidade."
      },
      {
        id: "RH6",
        pergunta: "Há oficial de cumprimento formalmente nomeado para as obrigações de PLD/FTP junto ao SISCOAF/UIF?",
        referencia: "4º Tabelionato de Notas da Capital; 29º Subdistrito (Santo Amaro) — Itens CNJ 10.4.11; 10.8.10",
        providencia: "Nomear formalmente o oficial de cumprimento responsável pelas comunicações ao SISCOAF/UIF."
      },
      {
        id: "RH7",
        pergunta: "A serventia mantém rotina de resposta às determinações da Corregedoria dentro dos prazos fixados (ex.: 30/60/90 dias)?",
        referencia: "Provimento CNJ n. 220/2026 — Item CNJ 3.6.19.1.1",
        providencia: "Instituir controle de prazos para cumprimento e resposta às determinações correcionais."
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
        referencia: "Item 10.5.1 do Tomo II das Normas Locais — 4º Tabelionato de Notas da Capital — Item CNJ 10.4.11 / Det. 10.4.13",
        providencia: "Realizar com urgência a ata de transmissão de acervo e o inventário patrimonial."
      },
      {
        id: "AR2",
        pergunta: "Todos os arquivos, atos e documentos da serventia estão sob guarda no próprio cartório, sem uso de computadores ou equipamentos particulares de escreventes?",
        referencia: "4º Tabelionato de Notas da Capital — Item CNJ 10.4.11",
        providencia: "Adquirir equipamentos próprios e recolher ao cartório todos os arquivos e atos mantidos em máquinas particulares."
      },
      {
        id: "AR3",
        pergunta: "Documentos históricos ou de valor especial sob guarda da serventia possuem proposta formal de preservação, catalogação e destinação institucional adequada?",
        referencia: "29º Subdistrito (Santo Amaro) — Lei Áurea e Carta de Libertação de Escravos — Det. 10.8.13.3.1",
        providencia: "Apresentar ao Juízo Corregedor Permanente proposta formal de preservação, catalogação e destinação dos documentos."
      },
      {
        id: "AR4",
        pergunta: "Há rotina de backup e plano de continuidade para o acervo digital e físico da serventia?",
        referencia: "RCPN do 1º Subdistrito (Sé) — plano de saneamento — Det. 10.3.9",
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
        referencia: "RCPN do 1º Subdistrito (Sé) — Det. 10.3.9",
        providencia: "Substituir/adequar o sistema para garantir log de acesso e trilha de auditoria de todos os atos."
      },
      {
        id: "TI2",
        pergunta: "O cálculo de emolumentos é realizado de forma fidedigna pelo próprio sistema (e não em planilhas paralelas)?",
        referencia: "RCPN do 1º Subdistrito (Sé) — Det. 10.3.9",
        providencia: "Implantar cálculo automatizado e fidedigno de emolumentos no sistema principal."
      },
      {
        id: "TI3",
        pergunta: "Existe plano de atualização ou substituição de sistemas e infraestrutura de TI defasados?",
        referencia: "RCPN do 1º Subdistrito (Sé); 4º Tabelionato de Notas da Capital — Det. 10.3.9; Det. 10.4.13",
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
        referencia: "Item CNJ 3.6.10.3 / Det. 3.6.19.2.3; 9º RI de São Paulo",
        providencia: "Instituir rotina periódica de atualização e conferência dos dados no Justiça Aberta."
      },
      {
        id: "TI8",
        pergunta: "O DPO (Encarregado de Proteção de Dados) está formalmente designado e a política de proteção de dados é divulgada a usuários e colaboradores?",
        referencia: "9º RI de São Paulo — Item CNJ 10.6.8; boas práticas 1º RI de Jundiaí",
        providencia: "Designar formalmente o DPO e divulgar a política de proteção de dados."
      },
      {
        id: "TI9",
        pergunta: "A serventia dispõe de sinalização tátil e demais recursos de acessibilidade física e digital ao público?",
        referencia: "9º RI de São Paulo — Det. 10.6.9",
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
        referencia: "13º RI de São Paulo — Det. 10.7.12.1",
        providencia: "Adotar as providências perante a Municipalidade para obtenção do alvará de localização, comprovando o protocolo."
      },
      {
        id: "IN2",
        pergunta: "Eventuais cessões ou sublocações de áreas do cartório (ex.: estacionamento) estão formalizadas contratualmente e cobertas por seguro?",
        referencia: "4º Tabelionato de Notas da Capital — Item CNJ 10.4.11",
        providencia: "Formalizar contratualmente qualquer cessão de área e providenciar cobertura de seguro."
      },
      {
        id: "IN3",
        pergunta: "O acervo (livros, títulos e documentos) está protegido por seguro contra sinistros?",
        referencia: "RCPN do 1º Subdistrito (Sé) — plano de saneamento — Det. 10.3.9",
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
        pergunta: "A serventia comunica ao COAF/UIF (via SCAF) operações com indícios de lavagem de dinheiro ou financiamento ao terrorismo, com critérios além do mero valor em espécie?",
        referencia: "Item CNJ 3.6.16 / Det. 3.6.19.3.14; 29º Subdistrito (Santo Amaro) — apenas 38 comunicações desde 2020",
        providencia: "Revisar critérios de comunicação ao COAF/UIF, superando o critério único de valor em espécie."
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
        referencia: "29º Subdistrito (Santo Amaro) — fraude em registro de óbito de pessoa viva; boas práticas 1º RI de Jundiaí — Det. 10.8.13",
        providencia: "Formalizar protocolo interno de prevenção, identificação e comunicação de fraudes."
      }
    ]
  },
  {
    id: "processos",
    sigla: "PF",
    nome: "Processos Fins — Registro, Averbação, Certidão e Informação",
    descricao: "Qualificação registral, usucapião, aquisição por estrangeiros e Reurb.",
    itens: [
      {
        id: "PF1",
        pergunta: "Em pedidos de usucapião extrajudicial, há diligência específica para identificar a utilização em série da modalidade em um mesmo empreendimento ou condomínio?",
        referencia: "Art. 410, §2º, do CNN/CN/CNJ-Extra; 1º RI de Campinas — Det. 10.2.9.1.10",
        providencia: "Instituir diligência específica de aferição da utilização em série da usucapião extraordinária."
      },
      {
        id: "PF2",
        pergunta: "Os atos registrais decorrentes de usucapião incluem todos os elementos cadastrais essenciais do imóvel, inclusive o CEP (princípio da especialidade objetiva)?",
        referencia: "Art. 440-AQ, §1º, do CNN/CN/CNJ-Extra — Det. 10.2.9.1.11",
        providencia: "Padronizar a inclusão de todos os elementos cadastrais essenciais, inclusive CEP, no ato registral."
      },
      {
        id: "PF3",
        pergunta: "As atas notariais de usucapião recebidas são qualificadas com rigor, com devolução quando se limitarem a reproduzir declarações das partes?",
        referencia: "9º RI de São Paulo — Itens CNJ 10.6.8; 10.6.9",
        providencia: "Instituir rotina de qualificação rigorosa das atas notariais de usucapião, com nota devolutiva quando cabível."
      },
      {
        id: "PF4",
        pergunta: "Toda aquisição de imóvel rural por estrangeiro é submetida a análise prévia, com sistema e base cartográfica próprios, antes da qualificação registral positiva?",
        referencia: "Item CNJ 3.6.18",
        providencia: "Implantar/manter sistema próprio de análise prévia de aquisição de terras rurais por estrangeiros."
      },
      {
        id: "PF5",
        pergunta: "Havendo indícios de extrapolação dos limites legais de aquisição por estrangeiros, é instaurado Pedido de Providências com remessa ao INCRA e suspensão do registro?",
        referencia: "Item CNJ 3.6.18",
        providencia: "Formalizar fluxo de instauração de Pedido de Providências e remessa ao INCRA em casos de indício de extrapolação."
      },
      {
        id: "PF6",
        pergunta: "A atuação em processos de Regularização Fundiária Urbana (Reurb) se limita à fiscalização e orientação normativa, sem assunção de funções executivas de política pública?",
        referencia: "Item CNJ 3.6.17; itens 297 a 324 das Normas de Serviço",
        providencia: "Reafirmar, em manual interno, os limites da atuação registral em processos de Reurb, sem assunção de função executiva."
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
        pergunta: "Há check-list padronizado de cautelas para atos com pessoas idosas, vulneráveis ou com possível limitação de compreensão, incluindo entrevista reservada?",
        referencia: "Item CNJ 10.8.14.1",
        providencia: "Padronizar check-list de cautelas para atos com pessoas idosas ou vulneráveis, incluindo entrevista reservada."
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
