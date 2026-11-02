import { asset } from './assets';

export const photo = (name, thumbnail = false) => asset(`photos/${name}${thumbnail ? '-thumb' : ''}.webp`);

export const littleExtras = {
  video: asset('media/nossas-conversas-50x.mp4'),
  videoPoster: asset('media/conversas-poster.webp'),
  conversationText: 'Um pedacinho das nossas conversas. Em 50×, porque no ritmo normal isso aqui virava uma série. E o assunto ainda não acabou.',
  motherTitle: 'Minha sogra é muito legal.',
  motherNote: 'Então, esse buquê é pela sua gentileza. Obrigado por ser tão legal comigo!',
  motherSignature: 'com carinho, Gustavo',
  bouquet: asset('media/buque-para-sogra.webp'),
  bouquetStill: asset('media/buque-poster.webp'),
};

// As nove imagens abaixo são as que o Gustavo enviou para esta seção.
export const characters = [
  { id: 'hatsune-miku', name: 'Hatsune Miku', series: 'Vocaloid / Piapro', accent: '#8bd7d0', position: '50% 27%', line: 'Ela canta. Eu fiz o site. Cada um com seus talentos.' },
  { id: 'sachiko-juraku', name: 'Sachiko Juraku', series: 'Kakegurui Twin', accent: '#cda0bc', position: '50% 28%', line: 'Eu ia argumentar. Aí vi essa cara e desisti.' },
  { id: 'yumeko-jabami', name: 'Yumeko Jabami', series: 'Kakegurui', accent: '#df9eac', position: '50% 23%', line: 'Eu não jogo nem par ou ímpar com essa.' },
  { id: 'misa-amane', name: 'Misa Amane', series: 'Death Note', accent: '#e0bc85', position: '50% 30%', line: 'O cabelo, o estilo… tá, eu entendi a escolha.' },
  { id: 'toji-fushiguro', name: 'Toji Fushiguro', series: 'Jujutsu Kaisen', accent: '#a3b7c8', position: '50% 26%', line: 'Tá. Esse aqui eu entendi sem explicação.' },
  { id: 'zero-two', name: 'Zero Two', series: 'Darling in the Franxx', accent: '#e6a6bc', position: '50% 34%', line: 'Ela já chama de darling. Vou ter que caprichar nos apelidos.' },
  { id: 'sukuna', name: 'Ryomen Sukuna', series: 'Jujutsu Kaisen', accent: '#dba4a1', position: '50% 30%', line: 'Eu ia reclamar, mas prefiro continuar inteiro.' },
  { id: 'eren-yeager', name: 'Eren Yeager', series: 'Attack on Titan', accent: '#b9c6a1', position: '50% 34%', line: 'Eu só pedi a lista. Veio um elenco inteiro.' },
  { id: 'levi-ackerman', name: 'Levi Ackerman', series: 'Attack on Titan', accent: '#b3accc', position: '50% 34%', line: 'Deixei esse cantinho bem arrumado por respeito.' },
].map((item) => ({ ...item, image: asset(`characters/${item.id}.webp`), thumbnail: asset(`characters/${item.id}-thumb.webp`) }));

// As frases são editáveis aqui. Nenhuma data ou lembrança foi inventada.
export const dedication = {
  from: 'Gustavo',
  to: 'Emanuelle',
  signature: 'com amor, Gustavo',
  letterPassphrase: 'Amoe',
  letter: [
    'Manu,',
    'Eu fui juntando essas fotos e percebi que não ia conseguir escolher só uma. Tem você de cabelo curtinho, de franja, de cachos, platinada… e tem você fazendo careta, que também precisava estar aqui.',
    'Então fiz esse cantinho. Pra guardar um pouquinho do quanto eu gosto de você, das suas mudanças e desse seu jeito de ser tanta coisa ao mesmo tempo.',
    'Tem foto aqui de antes de eu te conhecer. Eu não estava lá, mas hoje olho e penso em como gosto de ter você na minha vida.',
    'Pode mudar o cabelo, inventar outro estilo e arrumar mais uns 99999 apelidos pra mim. Eu vou continuar aqui, gostando de você e querendo te fazer sorrir.',
    'Todas as suas versões. Minha pessoa favorita.',
  ],
};

export const versions = [
  { name: 'Os cachinhos', title: 'Meu ponto fraco.', image: 'cachos-noite', color: '#bd9acb', ink: '#3d2447', background: '#e7dced', note: 'Longos, curtinhos, bagunçados. Eu gosto de todos.', number: '01' },
  { name: 'A platinada', title: 'Você sabia, né?', image: 'platinada-gorro', color: '#a8adc9', ink: '#30364d', background: '#e4e6ef', note: 'Que eu ia ficar olhando essa foto por tempo demais.', number: '02' },
  { name: 'De franjinha', title: 'Outra versão. Você.', image: 'franja-escura', color: '#98b3a6', ink: '#283c34', background: '#dde7df', note: 'Muda a franja. Continua sendo a minha pessoa favorita.', number: '03' },
  { name: 'A vermelhinha', title: 'Como é que pode?', image: 'vermelho-retrato', color: '#bb777a', ink: '#542e38', background: '#f0dedc', note: 'Essa aqui merecia uma página só pra ela.', number: '04' },
  { name: 'Ela sendo ela', title: 'Sim. É por ela.', image: 'ela-sendo-ela', color: '#c99d83', ink: '#57382d', background: '#efe1d6', note: 'A pessoa por quem eu sou apaixonado. Inclusive assim.', number: '05' },
];

export const gallery = [
  { image: 'vermelho-sentada', caption: 'Você, edição de capa.', shape: 'tall', tag: 'difícil escolher uma só' },
  { image: 'ela-sendo-ela', caption: 'Minha favorita fazendo isso.', shape: 'portrait', tag: 'sem condições' },
  { image: 'platinada-retrato', caption: 'Essa versão também mora aqui.', shape: 'square', tag: 'a do gorro' },
  { image: 'cachos-curtinhos', caption: 'Os cachinhos. De novo eles.', shape: 'square', tag: 'meu ponto fraco' },
  { image: 'careta-azul', caption: 'Pra equilibrar as fotos de modelo.', shape: 'portrait', tag: 'tinha que entrar' },
  { image: 'cachos-delineado', caption: 'Esse olhar aqui…', shape: 'square', tag: 'sem palavras' },
  { image: 'capuz-sol', caption: 'De qualquer jeito, você.', shape: 'square', tag: 'um dos seus jeitos' },
  { image: 'gorro-franja', caption: 'Mais uma que eu quis guardar.', shape: 'square', tag: 'coleção particular' },
  { image: 'cachos-noite', caption: 'Uma foto, eu olhando mil vezes.', shape: 'square', tag: 'essa luz' },
  { image: 'curtinho-carro', caption: 'Mudou o cabelo. Gostei de novo.', shape: 'square', tag: 'mais uma versão' },
  { image: 'franja-azul', caption: 'A franjinha tinha que aparecer.', shape: 'square', tag: 'olha ela' },
  { image: 'cachos-acobreados', caption: 'Outro tom. O mesmo carinho.', shape: 'portrait', tag: 'os acobreados' },
  { image: 'capuz-carro', caption: 'Você e esse capuz.', shape: 'square', tag: 'eu guardaria essa' },
  { image: 'cachos-ao-ar-livre', caption: 'Essa também é muito você.', shape: 'portrait', tag: 'um cantinho no mural' },
  { image: 'franja-perfil', caption: 'Até de lado.', shape: 'portrait', tag: 'todas as versões' },
  { image: 'mechas-carro', caption: 'Sim, mais uma favorita.', shape: 'square', tag: 'não vou escolher' },
  { image: 'mechas-capuz', caption: 'Uma coleção dos seus jeitos.', shape: 'square', tag: 'entre tantas' },
  { image: 'capuz-close', caption: 'E ainda caberia mais uma.', shape: 'square', tag: 'com carinho' },
];
