/* ============================================================
   X1 DO SANTA — DADOS DO SITE
   Edite só este arquivo. Vitórias e derrotas são calculadas
   automaticamente a partir dos resultados dos duelos.
   ============================================================ */

/* JOGADORES
   - A chave (ex.: mariojr) é o "id" usado nos duelos.
   - A foto fica em fotos/<id>.jpg (ex.: fotos/mariojr.jpg).
     Sem foto, o site mostra as iniciais no lugar.
   - categoria: "veterano" ou "esporte" (aba do ranking).  */
const jogadores = {
  xavola:   { nome: "Xavola",              categoria: "esporte" },
  sato:     { nome: "Japa Sato (Hideki)",  categoria: "esporte" },
  binho:    { nome: "Edvaldo (Binho)",     categoria: "veterano" },
  leozinho: { nome: "Leozinho",            categoria: "esporte" },
  paizao:   { nome: "Paizão do Rachão",    categoria: "veterano" },
  tiga:     { nome: "TiGa (9 Verdadeiro)", categoria: "veterano" },
  mariojr:  { nome: "Mário Jr",            categoria: "esporte" },
  nigeria:  { nome: "Flávio (Nigéria)",    categoria: "esporte" },
  ivan:     { nome: "Ivan",                categoria: "veterano" },
  bruninho: { nome: "Bruninho",            categoria: "esporte" },
  jony:     { nome: "Jhonny",              categoria: "veterano" },
  caio:     { nome: "Caio CJ",             categoria: "esporte" },
  luan:     { nome: "Luan",                categoria: "esporte" },
  luizinho: { nome: "Luizinho",            categoria: "esporte" },
  jo:       { nome: "Jó",                  categoria: "esporte" },
  nico:     { nome: "Nico",                categoria: "esporte" },
  didi:     { nome: "Didi",                categoria: "veterano" },
  nene:     { nome: "Nenê",                categoria: "esporte" },
  lucasbaroa: { nome: "Lucas Baroa",       categoria: "esporte" },
  joaovictor: { nome: "João Victor",       categoria: "esporte" },
  sarara:   { nome: "Sarará",              categoria: "esporte" },
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
      { a: "ivan",     b: "tiga",     vencedor: "ivan" },
      { a: "leozinho", b: "bruninho", vencedor: "bruninho" },
      { a: "paizao",   b: "jony",     vencedor: "paizao" },
      { a: "caio",     b: "luan",     vencedor: "caio" },
      { a: "nigeria",  b: "luizinho", vencedor: "nigeria" },
      { a: "xavola",   b: "mariojr",  vencedor: "mariojr", principal: true },
      { a: "binho",    b: "jo",       vencedor: "jo" },
    ],
  },
  {
    titulo: "07 de agosto",
    data: "Sexta-feira, 07/08 · 19h",
    local: "C.D.C. Vila Invernada",
    duelos: [
      { a: "xavola",  b: "sato",     vencedor: "xavola" },
      { a: "binho",   b: "leozinho", vencedor: "leozinho" },
      { a: "paizao",  b: "tiga",     vencedor: "paizao" },
      { a: "mariojr", b: "nigeria",  vencedor: "nigeria", principal: true },
    ],
  },
];

/* PRÓXIMO X1 (aparece no topo do site) */
const proximo = {
  mes: "Fevereiro",
  data: "26 de Fevereiro · Início às 19h",
  local: "CDC Vila Invernada",
  endereco: "Rua Raimundo Correia, 131",
  /* cinturões em jogo (aparecem acima dos duelos confirmados) */
  cinturoes: [
    { nome: "X1 Esporte",   imagem: "img/cinturao-esporte.png",  a: "nigeria", b: "nico" },
    { nome: "X1 Veterano",  imagem: "img/cinturao-veterano.png", a: "paizao",  b: "didi" },
  ],
  duelos: [
    { a: "nigeria",    b: "nico" },
    { a: "paizao",     b: "didi" },
    { a: "ivan",       b: "nene" },
    { a: "caio",       b: "mariojr" },
    { a: "xavola",     b: "lucasbaroa" },
    { a: "joaovictor", b: "leozinho" },
    { a: "jo",         b: "sarara" },
  ],
};
