/* =====================================================================
   BALAIO DO CERRADO — CONFIGURAÇÕES DO SITE
   Este é o único arquivo de "ajustes". Abra no Bloco de Notas, troque o
   que precisar entre aspas e salve. Não apague as vírgulas nem as aspas.
   ===================================================================== */
window.BALAIO = {

  /* WhatsApp que recebe as mensagens do formulário e do botão flutuante.
     Só números, com 55 + DDD + número. */
  whatsapp: '553432312412',

  /* Texto que já vem escrito quando alguém clica no botão do WhatsApp. */
  whatsappTexto: 'Olá! Vim pelo site da Balaio do Cerrado e gostaria de conversar sobre ______.',

  /* FORMULÁRIO POR E-MAIL (opcional).
     Deixe vazio ('') para o formulário abrir o WhatsApp com a mensagem pronta.
     Para receber por e-mail, crie um formulário grátis em formspree.io e cole aqui o endereço
     que eles dão, no formato  https://formspree.io/f/xxxxxxxx  */
  formspree: '',

  /* GOOGLE ANALYTICS (opcional). Cole o código no formato G-XXXXXXXXXX.
     Vazio = sem medição e sem aviso de cookies. Com código, o aviso de cookies aparece
     e a medição só começa se a pessoa aceitar. */
  ga4: '',

  /* GOOGLE TAG MANAGER (já configurado). Carrega só depois que a pessoa aceita os cookies (LGPD).
     Se preencher, ele é usado no lugar do ga4 acima. */
  gtm: 'GTM-5DMKMC8Z',

  /* REDES SOCIAIS (opcional). Cole o endereço completo de cada uma.
     Só aparecem no site as que estiverem preenchidas. */
  redes: {
    instagram: 'https://www.instagram.com/BALAIODOCERRADO',
    youtube: 'https://www.youtube.com/@BalaiodoCerrado',
    facebook: 'https://www.facebook.com/balaiodocerrado/?locale=pt_BR',
    linkedin: 'https://www.linkedin.com/company/balaio-do-cerrado/home/'
  },

  /* VÍDEO INSTITUCIONAL da página inicial. Cole o link do YouTube (ex.: 'https://youtu.be/AbC123xyz_0').
     Vazio = continua o espaço reservado. */
  videoInstitucional: 'https://www.youtube.com/watch?v=ZKdoFMCJ-dU',

  /* LOGOMARCAS DOS PARCEIROS. Coloque os arquivos na pasta img/parceiros/ e escreva aqui os nomes,
     entre aspas e separados por vírgula. Exemplo: ['auto-forjas.png', 'bauducco.svg']
     parceiros     = lista completa (páginas "Parceiros na história" e "Quem somos")
     parceirosHome = as 12 a 15 que aparecem na faixa da página inicial
     O nome do arquivo vira o nome da empresa (auto-forjas.png -> "Auto Forjas"). */
  parceiros: [],
  parceirosHome: [],

  /* Dicas nos espaços de foto vazios ("Foto: ... → img/fotos/xxx.jpg").
     true  = mostra a dica enquanto a foto não existe (bom para montar o site)
     false = esconde a dica; o espaço continua reservado. Mude para false ao publicar. */
  dicasDeFoto: true
};
