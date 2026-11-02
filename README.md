# Emanuelle, por Gustavo

Um cantinho para homenagear a Emanuelle: fotos, bilhetes, Kuromis, música e algumas brincadeiras de vocês.

## Rodar no computador

Use Node.js 24 (ou uma versão compatível a partir de 22.12).

```sh
git clone https://github.com/Lekezin/dsfs123.git
cd dsfs123
npm ci
npm run dev
```

Abra http://localhost:5173. Não há variáveis de ambiente obrigatórias nem serviços externos necessários para rodar. Fotos, fontes, música e vídeo estão incluídos no projeto.

## O que tem no site

- Pergunta de entrada: as respostas erradas fogem ao clicar e as que restam se reorganizam. **Mais de 99999** libera a homenagem.
- Abertura inspirada na referência Azizi, com vidro, fotografia recortada, nome em camadas e movimento com o mouse.
- **Dynamite — BTS**, com a capa enviada, volume inicial de 12%, play/pausa, progresso, recomeço, volume e controle no menu.
- Cinco versões da Emanuelle e um mural de 18 fotos ampliáveis.
- Quatro Kuromis recortadas a partir das imagens enviadas: clássica, roxinha, bruxinha e a extraída da imagem com os amigos.
- **Meus concorrentes em 2D**, com os nove personagens escolhidos por ela e comentários do Gustavo.
- O teaser das conversas e um cartão para a sogra com o buquê animado.
- Carta que abre com **Amoe**, preservando o errinho. “Amor” não abre; maiúsculas/minúsculas e espaços nas pontas são tolerados. Depois de abrir, pode guardar e reler na mesma visita.
- Layout de celular, navegação por teclado e respeito à preferência por movimento reduzido.

O MP4 recebido tem 2,6 segundos e mostra uma prévia do WhatsApp. Ele foi incluído como teaser, sem acelerar o arquivo outra vez. O quiz e a palavra da carta são parte da brincadeira, feitos no navegador.

## Personalizar

Edite **`src/content.js`** para mudar carta, palavra de abertura da carta, legendas, personagens e recados. Os textos são a primeira proposta feita com o Gustavo; não foram acrescentadas datas ou memórias específicas que ele não contou.

Os recursos usados pelo site ficam em **`public/`**. Os originais dos recortes e animações ficam em **`assets/`**, fora da distribuição.

## Compilar e conferir

```sh
npm run build
npm run preview
```

A prévia da compilação fica em http://localhost:4173 e os arquivos prontos em `dist/`. Enviar o projeto para o GitHub não ativa automaticamente uma hospedagem.

O projeto também aceita uma base em subpasta, caso seja hospedado em GitHub Pages:

```sh
npm run build -- --base=/dsfs123/
```

## Verificar

Com a prévia ou o servidor de desenvolvimento em execução:

```sh
npx playwright install chromium webkit
npm run test:e2e
npm run test:webkit
```

Os testes usam http://localhost:5173 por padrão. Para testar a compilação em 4173, defina `TEST_URL=http://localhost:4173` no ambiente. Os relatórios e capturas ficam em `test-results/` e não entram no Git.

```sh
npm run optimize:assets
npm run measure:performance -- current
```

A otimização usa apenas os originais já incluídos no repositório; não depende de arquivos temporários da máquina em que a homenagem foi criada.

## Registros

- [Revisão de desempenho](docs/performance.md)
- [Fontes dos elementos visuais](docs/asset-provenance.md)
- [Recortes transparentes da Kuromi e prompts](docs/kuromi-cutouts.md)
- [Vídeo das conversas e buquê](docs/conversations-and-bouquet.md)

Feito com React, Vite, GSAP, Phosphor e fontes locais Outfit, Cormorant Garamond e Mrs Saint Delafield.
