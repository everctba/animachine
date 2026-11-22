# animachine local — setup, patches e uso

Este clone foi **recuperado** em 2026-11-17 para rodar em Node 22 sem a extensão do Chrome.
O código é de 2016 (React 15, GSAP 1.18, webpack 1, babel 5) e está MIT.

## O que foi preciso para instalar (o repo não builda do zero)

| Problema | Solução aplicada |
|---|---|
| `spaceman@^0.1.0` não existe no npm | repo irmão `../spaceman` (do autor) ligado por alias do webpack |
| `quick-interface` não existe no npm | repo irmão `../quick-interface` (do autor) ligado por alias |
| Loaders não resolvem fora do projeto | junctions de `babel-loader`, `afflatus`, `react-matterkit`, `react` nos repos irmãos |
| `gulp@3` quebra no Node 22 | build direto com webpack: `node_modules\.bin\webpack.cmd --config webpack.browser.config.dev.js` |
| `graceful-fs` antigo | `overrides` no `package.json` |
| `webpack-dev-server: "*"` resolveria v5 (incompatível) | pin `1.16.5` |
| bundle carregava de `rawgit.com` (morto) | bundle local servido por `run-local.ps1` |

## Rodar

```powershell
cd H:\TUDO\Codigo\Codigo\animachine
.\run-local.ps1 -Port 8091      # builda e serve local-test/ em http://127.0.0.1:8091/
```

`run-local.ps1` compila (`browser/animachine.js`, ~3,1 MB) e serve `local-test/`.

## Usar o editor em qualquer página (sem extensão)

1. Deixe o servidor rodando (`run-local.ps1`).
2. Abra `http://127.0.0.1:8091/bookmarklet.html` e arraste o link para a barra de favoritos.
3. Abra sua página (de preferência servida em `http://localhost`) e clique no favorito.
   - O bookmarklet carrega GSAP 1.18 do CDN e `animachine.js` de `127.0.0.1:8091`.
   - Em página **HTTPS**, o carregamento de `http://127.0.0.1` pode ser bloqueado pelo navegador;
     nesse caso edite com a página servida localmente (http) ou use a extensão abaixo.

## Usar em qualquer site — extensão MV3 (recomendado)

O repo original tinha extensão Chrome **MV2** (morta). Este clone agora tem uma extensão **MV3**
própria, com o editor e o GSAP **embutidos** — sem CDN, sem servidor local, sem mixed content,
e sem sofrer com o CSP da página.

```powershell
.\build-extension.ps1     # compila e monta extension/ (animachine.js + gsap.min.js)
```

Depois:

1. Abra `chrome://extensions` e ligue o **Developer mode**.
2. **Load unpacked** → selecione `H:\TUDO\Codigo\Codigo\animachine\extension`.
3. Fixe o ícone "animachine (local)" na barra de ferramentas (puzzle → pin).
4. Abra **qualquer site** (http, https ou file) e clique no ícone.

Como funciona: [extension/background.js](extension/background.js) injeta `vendor/gsap.min.js` e
`animachine.js` no **main world** da aba (`chrome.scripting.executeScript`, `world: 'MAIN'`).
Clicar duas vezes é inofensivo (guard `__animachineInited` da [src/main.js](src/main.js)).

Notas de verificação:

* o **payload** (animachine.js em world MAIN) foi validado numa página crua, sem editor embutido:
  o diálogo "Hello!" aparece e o guard de dupla injeção funciona;
* o **clique no ícone** não pôde ser automatizado: Chrome 157 (branded) ignora `--load-extension`
  por linha de comando, então o carregamento é manual (Load unpacked);
* páginas `chrome://`, Chrome Web Store e PDFs internos não aceitam injeção.

## Usando a animação exportada (GSAP) — em outro site

O **editor** é ferramenta de desenvolvimento e não vai para o site. O que vai é o `.am.js`: um
bundle UMD autocontido que embute os dados do projeto e o runtime que remonta um `TimelineMax`.

```html
<!-- 1) GSAP 1.x primeiro (o bundle usa TimelineMax global) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>

<!-- 2) o export do editor -->
<script src="meu-projeto.am.js"></script>

<script>
  // 3) o nome do PROJETO vira um objeto com uma função por timeline
  var animations = window.__animachine['new project']   // ou window['new project']

  // 4) chame a timeline passando o elemento RAIZ (os seletores são resolvidos dentro dele)
  var tl = animations['new timeline'](document.body)

  // 5) controle normal de TimelineMax
  tl.pause(0)      // para no começo
  tl.play()        // toca
  tl.timeScale(2)  // 2x
  tl.repeat(-1)    // loop
  tl.time(0.5)     // busca 500 ms
</script>
```

Regras importantes:

* **O vínculo é por seletor CSS**, não por projeto: cada track guarda um seletor capturado na
  página e o runtime faz `rootElement.querySelectorAll(seletor)`. Em outro site, a animação só
  afeta elementos que casem com esses seletores — se o HTML for diferente, ela não faz nada
  (silenciosamente). Por isso, prefira seletores estáveis (`#id`, `.classe`) via
  **add track (css selector)** em vez dos caminhos `:nth-child(…)` gerados pelo picker.
* Seletor que começa com `:scope > …` é ancorado nos filhos do `rootElement` — passe
  `document.body` (ou a `<section>` certa), nunca `document`.
* `window.__animachine[projeto][timeline]` é o registro estável; `window[projeto]` continua
  funcionando pela API original; com bundler, `require('./projeto.am.js')` devolve o mesmo mapa.
* React: use `animachine-connect` para tocar as mesmas animações dentro de um componente.

**Reabrir para editar:** menu da timeline (círculo à direita) → **open animation (.am.js)**. O editor
lê o marcador `__ANIMACHINE_BUNDLE__` do arquivo (não executa o JS) e recupera projeto, tracks,
keys e eases. O `.am.json` continua sendo o arquivo de projeto "puro".

**Validado em 0.4.1:** export de 25,8 KB abre com `node --check`, `require()` devolve
`['new timeline']`, e numa página separada com GSAP o `tl` em `t=0` fica em
`translate(120.99px, 70.57px)` e em `t=0.5s` em `rotate(45deg) translate(268.48px, 159.18px)`.

## Editor de easing (inline)

Com uma track que tenha pelo menos duas keys:

1. clique no **segmento da keyline** (a faixa entre as duas keys, na linha do parâmetro);
2. abre o editor inline: curva azul com **dois pontos de controle**;
3. arraste os pontos para ajustar a curva (Bézier) do trecho — o valor é salvo no `ease` da key.

Verificado em 0.4.1 (clique em 250 ms → editor abre para a key de 500 ms, 7 círculos + 1 path na
DOM). Ainda não fecha com clique fora (o código tem um `handleClickAway` comentado).

## Fluxo verificado (o que o landing page promete)

1. No diálogo **Hello!**, clique `start`.
2. Clique num elemento da página → aparece o contorno pontilhado com botões (setas, ×, **+**).
3. Clique no **+** → cria a track com o seletor CSS do elemento (`new track for "#card-1"`).
4. Arraste o elemento → o transform tool grava os parâmetros (`x`, `y`, `transformOriginX/Y`).
5. Mova o playhead na régua (0–1250 ms) e ajuste valores para criar mais keys.
6. Menu do topo da timeline (círculo à direita da área de controles):
   `save file` (.am.js), `open project (.am.json)`, `save project (.am.json)`,
   **`open animation (.am.js)`**, undo, redo.
7. No site: carregue GSAP + o `.am.js` e toque a timeline (seção acima).

## Matriz de features do landing page

| Feature | Status | Evidência |
|---|---|---|
| **In browser** | ✅ | bookmarklet (localhost) e extensão MV3 (qualquer site) |
| **DOM picker** | ✅ | gera seletor CSS e cria track (`#card-1`) |
 | **Transform** | ✅ | tool renderiza, cria params+keys e aplica no elemento (arrasto real: `x=120.99→268.48`, rotação `0→45°`) |
| **Ease** | ✅ | clique no segmento da keyline abre o editor inline (curva + 2 pontos); ver "Editor de easing" |
| **Timeline** | ✅ | régua em ms, tracks, params, `currentTime` |
| **JS export** | ✅ | `new project.am.js` (25,8 KB) válido (`node --check`), idempotente, com marcador `__ANIMACHINE_BUNDLE__`; toca com GSAP em outra página |
| **Save / reload** | ✅ | `.am.json` (projeto) **e** `.am.js` (reabrir animação exportada) |

## Patches feitos neste clone

| Arquivo | Mudança |
|---|---|
| `package.json` | `spaceman` removido (local), `overrides.graceful-fs`, `webpack-dev-server` pinado |
| `webpack.browser.config.dev.js` | aliases `spaceman`/`quick-interface`/`react-dom` + include no babel-loader |
| `src/rocks/dom-picker/DOMPicker.jsx` | botões do picker **sempre visíveis** (antes só no hover) |
| `src/rocks/timeline-tab/controls/Controls.jsx` | hint "click an element… press +"; botão "Create an empty track" |
| `src/rocks/project-file/index.js` | **novo**: salvar/abrir projeto `.am.json` **e abrir animação `.am.js`** (lê o marcador, não executa) |
| `src/rocks/create-bundle-file/*` | export corrigido: bundle sem `eval`, JSON literal, marcador `__ANIMACHINE_BUNDLE__`, UMD root explícito, `_short` normalizado |
| `src/animachine-connect/create-animation-source.js` | não muta mais o documento (rotação `_short` era acumulada a cada leitura) |
| `webpack.bundle.config.js` + `webpack.browser.config.dev.js` | template do export sem `devtool: eval` e **excluído do babel** (babel injetava `'use strict'` e zerava o root do UMD) |
| `src/main.js` | registra `project-file`; guard `__animachineInited` (injeção dupla é inofensiva) |
| `extension/` + `build-extension.ps1` | **novo**: extensão MV3 com GSAP + editor embutidos |
| `local-test/` (inclui `plain.html`, `bookmarklet.html`) | página de teste, página crua e bookmarklet |

## Limitações conhecidas

* Extensão Chrome MV2 do repo original está morta — o bookmarklet substitui.
* `content-script.js` original aponta para `rawgit.com` (extinto).
* O demo publicado (`gh-pages`, `#/Robots`) referencia uma cena que não existe no `master`.
* O editor depende de Font Awesome para os ícones; a extensão embute a fonte, o bookmarklet carrega
  do CDN. Em site com CSS agressivo, algum ícone pode herdar estilo errado.
* `Transform` funciona com arrasto real (verificado: `x=200.37`, `y=100.19`), mas precisa de uma
  **track com alvo** — a track vazia do placeholder não serve.

## Troubleshooting da extensão

| Sintoma | Causa | Solução |
|---|---|---|
| Nenhum ícone aparece (setas, ×, +) | página sem Font Awesome | já embutido na extensão; **recarregue a extensão** e dê **F5 na página** |
| Cliquei no elemento e não achei o "+" | é a **bolinha ciano no centro** do contorno pontilhado | clique nela; ela cria a track com o seletor CSS |
| Criei "Create an empty track" e nada funciona | track vazia não tem alvo: sem alvo não há transform tool nem keys | use elemento + `+`; a track vazia pode ser apagada |
| Não arrasta o elemento | precisa de track com alvo; arraste pelo **corpo** (longe da borda) | crie a track pelo `+` e arraste do meio do elemento |
| O picker não pega o elemento (iframe, shadow DOM, overlay) | o `elementFromPoint` não atravessa essas barreiras | menu (círculo, à direita da timeline) → **add track (css selector)** → digite o seletor |
| Aviso "Mixed Content … list-manage.com" no console | formulário de newsletter do site do animachine (action `http://`) | é do site, não do editor; ignore |
| Track criada mas sem caixa verde | seletor relativo (`> …`) inválido em `querySelectorAll` | corrigido (`:scope > …`); atualize a extensão ou use um seletor estável pelo plano B |
| Depois de eu mexer no código | a extensão em memória é a antiga | `chrome://extensions` → **Reload** na extensão → **F5** na página |
| Qualquer outra coisa | — | no console da página rode `animachineDiag()` e me mande o objeto |

## Seletores gerados pelo picker

O picker gera um seletor CSS a partir do elemento. Quando não existe id/classe única no caminho,
o gerador usa um seletor **relativo** (`> :nth-child(3) …`) ancorado no `<body>`.

Correção (build atual):

* o gerador emite `:scope > :nth-child(…)` — válido em `element.querySelectorAll`;
* `createTargets` normaliza seletores antigos que começam com `>` para `:scope > …`.

Sem isso, `querySelectorAll("> …")` lança `SyntaxError`, a track fica com `targets: []` e o
transform tool (caixa verde) não aparece. Verificado na página do animachine com o seletor
`> :nth-child(3) .w-container > :nth-child(4) h2` → alvo encontrado (H2) e caixa verde visível.

## Fonte dos ícones (Font Awesome)

A extensão embute **Font Awesome 4.6.3 (SIL OFL 1.1)** em `extension/font-awesome/`.

Dois cuidados que já estão resolvidos no `background.js`:

1. `chrome.scripting.insertCSS({files})` resolve URLs relativas contra a **página** (dava
   `GET https://site/fonts/fontawesome-webfont.* 404`). O CSS é montado em runtime com URLs
   absolutas `chrome-extension://<id>/font-awesome/fonts/...`.
2. A família é renomeada para **`animachine-fa`** (o FA usa o shorthand `font: … FontAwesome`
   na classe `.fa`, então a troca é no arquivo inteiro) e reforçada com `!important` — assim o
   CSS do site não canibaliza os ícones do editor.

Não é preciso baixar nem copiar fontes para o projeto: elas vêm da extensão.

## Correções da versão 0.4.1 (export, reabertura e easing)

Três bugs do export foram diagnosticados e corrigidos:

1. **Arquivo `.am.js` com sintaxe inválida.** O nome da track gerado pelo picker contém aspas
   (`new track for "…"`); o bundle era compilado com `devtool: 'eval'` e o JSON era escapado só uma
   vez, quebrando o `eval("…")`. Correção: template sem `eval` (`devtool: false`) e JSON injetado
   como **literal**.
2. **Rotações corrompidas (`_short` repetido).** `makeAllRotationShort` **mutava** os keys do
   documento a cada leitura do `animationSource`; um projeto chegou a ter 1.733 `_short` e sequência
   de 6.942 caracteres (bundle de 18 KB → 40 KB). Correção: transformações puras (cópias) e
   normalização na saída (exatamente um `_short` em rotação; número no projeto).
3. **Global do UMD não era criado no browser.** O wrapper do webpack 1 usa `this` como root, mas o
   **babel aplicava `'use strict'` ao bundle bruto** (o require `raw!` também passa pelo loader de
   JS) e `this` virava `undefined` — a animação existia, mas `window[projeto]` nunca era definido.
   Correção: o diretório do bundle bruto é **excluído do babel** e o export reescreve o root para
   `typeof self !== 'undefined' ? self : window`.

Também nesta versão:

* **reabrir `.am.js`** (menu → open animation): o arquivo carrega um marcador
  `__ANIMACHINE_BUNDLE__` com projeto + timelines, lido sem executar o JS;
* registro estável `window.__animachine[projeto][timeline]` (além do `window[projeto]` original);
* **editor de easing** validado (clique no segmento entre keys → curva + 2 pontos de controle);
* verificação ponta a ponta: export válido (`node --check`), `require()` devolve
  `['new timeline']`, e numa página separada com GSAP o elemento saiu de
  `translate(120.99px, 70.57px)` para `rotate(45deg) translate(268.48px, 159.18px)` em 500 ms;
* reabertura no editor devolveu 1 timeline, 1 track, 5 params e as keys (x, y, rotationZ) intactas.

## Próximos passos possíveis

1. Fechar o editor de easing com clique fora (o `handleClickAway` está comentado no código).
2. Exports antigos (0.4.0 ou anteriores) não podem ser reabertos — o arquivo está sintaticamente
   inválido; reexportar com 0.4.1+.
3. Empacotar como script de dev (`<script>` em projeto próprio) com versionamento dos patches.
