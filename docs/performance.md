# Revisão final de desempenho

## Recursos

| Recurso | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Retrato com transparência | 1.197.945 bytes, PNG | 189.666 bytes, WebP | 84,2% |
| Animação das flores | 2.983.809 bytes, GIF | 1.333.562 bytes, WebP animado | 55,3% |
| Distribuição completa | 12.322.382 bytes | 9.452.821 bytes | 23,3% |

O retrato mantém 1254 × 1254 pixels e alfa. A animação mantém 480 × 480 pixels, ciclo de 6340 ms e repetição; o encoder uniu quadros equivalentes, passando de 95 para 90 quadros. Os arquivos originais ficam em `assets/source/`, fora da pasta publicada.

## Entrada em um contexto novo de navegador

Medição com Chromium, 390 × 844 pixels, sem cache prévio e com movimento reduzido para tornar a comparação mais estável. O relatório é coletado 3,5 segundos depois de abrir a homenagem e inclui a música.

| Medida | Antes | Depois |
| --- | ---: | ---: |
| Solicitações até a abertura | 52 | 28 |
| Bytes transferidos até a abertura | 5.414.465 | 4.279.238 |

Redução de aproximadamente 21% nos bytes transferidos nessa medição. A música original foi mantida e representa a maior parte da transferência restante. Esses valores são uma comparação local, não uma promessa de tempo de carregamento em toda conexão.

Para medir novamente com a prévia em execução:

```sh
npm run measure:performance -- current
```

## Mudanças no código

- A entrada espera apenas retrato, foto da primeira versão, Kuromi da abertura e capa da faixa; o restante chega conforme necessário.
- A música só começa a carregar na interação que libera a homenagem.
- Fotos do mural usam `srcset` e as miniaturas existentes; as fotos ampliadas mantêm a resolução maior.
- A seleção de personagens usa miniaturas próprias, em vez das imagens grandes.
- O progresso da música atualiza apenas o player. O retrato e as demais seções não renderizam a cada evento de tempo do áudio.
- Animações contínuas ficam pausadas quando a seção sai da área próxima da tela.
- Imagens antigas de referência foram guardadas em `assets/archive/`, fora da distribuição.
- Fontes sem uso foram retiradas.
- Caminhos de recursos respeitam `BASE_URL`, para permitir hospedar em subpastas.

## Validação

Compilação de produção, fluxo completo em Chromium, compatibilidade em WebKit, testes com movimento reduzido, telas de 320 a 1440 pixels e recuperação de falha de carregamento. A auditoria de dependências não encontrou vulnerabilidades. A senha “Amoe” continua sendo uma brincadeira local da carta, não autenticação de servidor.
