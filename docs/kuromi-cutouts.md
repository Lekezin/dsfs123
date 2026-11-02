# Kuromis sem fundo

Quatro edições foram feitas com a ferramenta integrada `image_gen`, em modo de edição com referência e `transparent_background: true`. Os resultados foram inspecionados e integrados ao site. Cada arquivo usado na página possui alfa verificado, com transparência externa e preenchimentos brancos opacos.

Os originais enviados pelo Gustavo e as versões anteriores com fundo foram preservados. Na imagem com os amigos, foi isolada apenas a Kuromi do canto superior esquerdo. Na clássica, o recorte usa a personagem central, sem a área de título abaixo. Não foi usado um desenho em SVG.

| Variante | PNG salvo no projeto | WebP usado na página |
| --- | --- | --- |
| Clássica | `assets/kuromi/classica-sem-fundo.png` | `public/decor/kuromi-classica-sem-fundo.webp` |
| Imagem dos amigos | `assets/kuromi/amigos-sem-fundo.png` | `public/decor/kuromi-amigos-sem-fundo.webp` |
| Bruxinha | `assets/kuromi/bruxinha-sem-fundo.png` | `public/decor/kuromi-bruxinha-sem-fundo.webp` |
| Roxinha | `assets/kuromi/roxinha-sem-fundo.png` | `public/decor/kuromi-roxinha-sem-fundo.webp` |

As dimensões e os caminhos dos arquivos no projeto estão em `assets/kuromi/manifest.json`. As versões WebP já estão incluídas em `public/decor/`, com seus PNGs de origem preservados em `assets/kuromi/`.

## Prompts utilizados

Cada prompt foi composto pelo prefixo, pelo pedido específico da variante e pelas restrições comuns abaixo, nessa ordem.

Prefixo:

> Use case: background-extraction. Edit target: attached image. Asset type: transparent PNG sticker for a romantic website.

Clássica:

> Extract ONLY the complete winking full-body Kuromi character in the center. Remove the plain lavender wallpaper background and separate bottom KUROMI title and small bottom copyright text as part of isolating the central character. Preserve the exact pose, tail, pink skull, facial expression and colors. Frame the full character tightly with a little transparent padding.

Imagem dos amigos:

> Extract ONLY Kuromi, the black jester-hood character in the UPPER LEFT. Discard the other four separate characters and all the white surrounding canvas. Preserve Kuromi's exact visible shape, facial expression, pose, black hood and pink skull and collar details. Keep her white face and white body opaque. Frame this one character tightly with transparent padding.

Bruxinha:

> Extract ONLY the witch-costume Kuromi, including her ENTIRE purple witch hat, pink band, cape wings, dress and hands. Remove pink striped wall, yellow floor and all surrounding scene. Preserve exact original facial features, linework, pose, colors, and shading. Do not crop off the hat or wings. Tight full-character framing with a little transparent padding.

Roxinha:

> Extract ONLY the large seated purple gothic Kuromi with the giant skull bow, ribbons, lace, dress and boots. Remove the lavender wallpaper background, repeating background lettering and little background icons/hearts. Preserve all details attached to the character, including the large hat, ribbons and lace. Preserve original cropped top-of-hat framing, do not invent missing parts. Keep white face and hands solid opaque white.

Restrições comuns:

> STRICT CONSTRAINTS: This is an extraction of the existing raster art, not a new drawing. Keep the original character appearance, outlines, pose, proportions and all original colors EXACTLY. Do not restyle, beautify, simplify, redraw or add details. Remove ONLY the unwanted surrounding scene as specified. Preserve white fills INSIDE the character; do not make them transparent. Deliver real alpha transparency outside the character and in empty gaps. No added text, white sticker outline, shadows, backgrounds, checkerboards or extra elements.
