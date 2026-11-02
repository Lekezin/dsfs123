# Registro dos elementos visuais

As 21 fotografias distintas enviadas pelo usuário foram convertidas para WebP e miniaturas com Sharp; conversão de formato apenas, sem geração ou retoque. A última foto de expressão brincalhona também foi incorporada. A repetição exata da fotografia avermelhada foi omitida.

## Recorte transparente

- Modo: ferramenta integrada `image_gen`, edição com imagem de referência e transparência.
- Entrada: `codex-clipboard-ac7bc8cf-95cc-4321-a804-4da5df530ba5.png`.
- Saída usada no site: `public/photos/hero-cutout.webp`.
- Alfa verificado: imagem PNG de 1254 × 1254 pixels com transparência.

Prompt utilizado:

> Use case: background-extraction. Edit target: the attached original photograph. Asset type: transparent person cutout for a layered website hero. Remove ONLY the bedroom wall, shadow on wall, bed, sheets and entire background. Preserve the woman EXACTLY as photographed: identical face, expression, identity, red short curly hair, pose, clothing, body proportions, legs, arms, hand and all natural texture and original lighting. Do not beautify, redraw, stylize, change face, change skin, extend or add any body parts. Keep the same framing. Clean realistic fine hair edges. Deliver genuine transparent alpha background, no drop shadow, no text. This is extraction only.

## Kuromi

A primeira ilustração em SVG foi substituída por um PNG da Sanrio. Depois, a pedido do Gustavo, essa repetição foi substituída pelas quatro artes que ele enviou. `src/Kuromi.jsx` agora escolhe explicitamente a imagem de cada local, sem geração ou redesenho.

- Página oficial consultada: https://www.sanrio.co.jp/characters/kuromi/
- Arquivo de origem: https://www.sanrio.co.jp/wp-content/uploads/2022/06/list-kuromi.png
- Arquivo local: `public/decor/kuromi-sanrio.png`.
- O PNG oficial fica preservado no projeto, mas deixou de ser usado na interface.

Artes originais enviadas pelo usuário, inicialmente convertidas para WebP mantendo a imagem completa. As versões atualmente usadas são os recortes transparentes registrados em `docs/kuromi-cutouts.md`; a tabela abaixo identifica as fontes preservadas:

| Arquivo local | Anexo original | Uso principal |
| --- | --- | --- |
| `public/decor/kuromi-classica.webp` | `codex-clipboard-a8f0e3f7-b5c3-40d2-b69e-76964baef2f9.png` | Pergunta |
| `public/decor/kuromi-amigos.webp` | `codex-clipboard-d0e4455b-2baa-4521-89a9-8795a8ab1e7f.png` | Mural |
| `public/decor/kuromi-bruxinha.webp` | `codex-clipboard-596f9eb3-ab16-48cf-9953-cb2c21026290.png` | Carta e primeira apresentação |
| `public/decor/kuromi-roxinha.webp` | `codex-clipboard-70faa298-31a3-4f71-b843-287b27bff996.png` | Abertura e carregamento |

## Personagens favoritos

As nove imagens são os anexos do Gustavo, convertidos para WebP em `public/characters/`. Não foram geradas imagens substitutas. Os arquivos têm nomes correspondentes aos personagens em `src/content.js`. As imagens de destaque usam o enquadramento da interface; os arquivos locais preservam a composição inteira.

Nomes cadastrados: Hatsune Miku, Sachiko Juraku, Yumeko Jabami, Misa Amane, Toji Fushiguro, Zero Two, Ryomen Sukuna, Eren Yeager e Levi Ackerman. Não foi atribuído um ranking de preferência. Os comentários são brincadeiras propostas para revisão do Gustavo.

Páginas de apoio para os nomes e universos:

- https://kakegurui-twin-anime.com/character/
- https://kakegurui-anime.com/1st/character/
- https://jujutsukaisen.jp/character/category4.php
- https://shueisha-games.com/wp-content/uploads/2024/08/6af92b2d959b77c029b523524aa1eefb.pdf

## Capa de Dynamite

- Entrada fornecida pelo usuário: `codex-clipboard-43753801-8180-4dde-bc91-6574d6fbfba6.png`.
- Arquivo local: `public/artwork/dynamite.webp`.
- Apenas conversão de formato e redução para 256 × 256 pixels, sem alterar a arte.
