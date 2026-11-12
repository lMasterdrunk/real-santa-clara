/* ============================================================
   X1 DO SANTA — DADOS DO SITE
   Edite só este arquivo. Vitórias e derrotas são calculadas
   automaticamente a partir dos resultados dos duelos.
   ============================================================ */

/* JOGADORES
   - A chave (ex.: mariojr) é o "id" usado nos duelos.
   - A foto fica em fotos/<id>.jpg (ex.: fotos/mariojr.jpg).
     Sem foto, o site mostra as iniciais no lugar.          */
const jogadores = {
  xavola:   { nome: "Xavola" },
  sato:     { nome: "Sato" },
  binho:    { nome: "Binho" },
  leozinho: { nome: "Leozinho" },
  paizao:   { nome: "Paizão do Rachão" },
  tiga:     { nome: "Tiga" },
  mariojr:  { nome: "Mário Jr" },
  nigeria:  { nome: "Nigéria" },
  ivan:     { nome: "Ivan" },
  tg:       { nome: "TG" },
  bruninho: { nome: "Bruninho" },
  jony:     { nome: "Jony" },
  caio:     { nome: "Caio" },
  luan:     { nome: "Luan" },
  flavio:   { nome: "Flávio" },
  luizinho: { nome: "Luizinho" },
  jo:       { nome: "Jó" },
  nico:     { nome: "Nico" },
  didi:     { nome: "Didi" },
  nene:     { nome: "Nenê" },
};

/* EDIÇÕES ANTERIORES
   vencedor: id de quem ganhou, ou null se ainda não lançou.
   Para adicionar uma edição, copie um bloco { ... } inteiro. */
const edicoes = [
  {
    titulo: "30 de outubro",
    data: "Sexta-feira, 30/10",
    local: "C.D.C. Vila Invernada",
    duelos: [
      { a: "ivan",     b: "tg",       vencedor: null },
      { a: "leozinho", b: "bruninho", vencedor: null },
      { a: "paizao",   b: "jony",     vencedor: null },
      { a: "caio",     b: "luan",     vencedor: null },
      { a: "flavio",   b: "luizinho", vencedor: null },
      { a: "xavola",   b: "mariojr",  vencedor: null },
      { a: "binho",    b: "jo",       vencedor: null },
    ],
  },
  {
    titulo: "07 de agosto",
    data: "Sexta-feira, 07/08 · 19h",
    local: "C.D.C. Vila Invernada",
    duelos: [
      { a: "xavola",  b: "sato",     vencedor: null },
      { a: "binho",   b: "leozinho", vencedor: null },
      { a: "paizao",  b: "tiga",     vencedor: null },
      { a: "mariojr", b: "nigeria",  vencedor: null, principal: true },
    ],
  },
];

/* PRÓXIMO X1 (aparece no topo do site) */
const proximo = {
  mes: "Fevereiro",
  data: "Data a definir",
  local: "CDC Vila Invernada",
  duelos: [
    { a: "nigeria", b: "nico" },
    { a: "paizao",  b: "didi" },
    { a: "ivan",    b: "nene" },
    { a: "caio",    b: "mariojr" },
  ],
};
