/* ============================================================
   X1 DO SANTA — DADOS DO SITE
   Edite só este arquivo. Vitórias e derrotas são calculadas
   automaticamente a partir dos resultados dos duelos.
   ============================================================ */

/* JOGADORES
   - A chave (ex.: mariojr) é o "id" usado nos duelos.
   - A foto fica em fotos/<id>.jpg (ex.: fotos/mariojr.jpg).
     Sem foto, o site mostra as iniciais no lugar.
   - categoria: "veterano" ou "esporte" (aba do ranking).
   - frase (opcional): texto do tooltip ao passar o mouse por 2 s
     sobre o nome ou a foto.                                  */
const jogadores = {
  xavola:   { nome: "Xavola",              categoria: "esporte", frase: "Das galáxias para Mossoró! De Mossoró para o Mundo!" },
  sato:     { nome: "Japa Sato (Hideki)",  categoria: "esporte" },
  binho:    { nome: "Edvaldo (Binho)",     categoria: "veterano", frase: "CoRUUUUUUUUUUja" },
  leozinho: { nome: "Leozinho",            categoria: "esporte" },
  paizao:   { nome: "Paizão do Rachão",    categoria: "veterano", frase: "Rei da Cavada - Tempo Ruim o Tempo Todo" },
  tiga:     { nome: "TiGa (9 Verdadeiro)", categoria: "veterano" },
  mariojr:  { nome: "Mário Jr",            categoria: "esporte" },
  nigeria:  { nome: "Flávio (Nigéria)",    categoria: "esporte" },
  ivan:     { nome: "Ivan",                categoria: "veterano" },
  bruninho: { nome: "Bruninho",            categoria: "esporte" },
  jony:     { nome: "Jhonny",              categoria: "veterano", frase: "Que iiiissooo! Ciclovia o Tempo Todo" },
  caio:     { nome: "Caio CJ",             categoria: "esporte" },
  luan:     { nome: "Luan",                categoria: "esporte", frase: "Ao Infinito e Além!" },
  luizinho: { nome: "Luizinho",            categoria: "esporte" },
  jo:       { nome: "Jó",                  categoria: "veterano" },
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
  {
    titulo: "X1 Anteriores",
    /* data e local são opcionais */
    duelos: [
      { a: "binho", b: "tiga", vencedor: "binho" },
    ],
  },
];

/* PRÓXIMO X1 (aparece no topo do site) */
const proximo = {
  mes: "Fevereiro",
  data: "26 de Fevereiro · Início às 19h",
  local: "CDC Vila Invernada",
  endereco: "Rua Raimundo Correia, 131",
  /* texto usado para achar o local no Google Maps e no Waze */
  busca: "CDC Vila Invernada, Rua Raimundo Correia, 131, Vila Invernada, São Paulo - SP",
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
