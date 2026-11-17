# animachine local Ã¢â‚¬â€ setup, patches e uso

Este clone foi **recuperado** em 2026-11-17 para rodar em Node 22 sem a extensÃƒÂ£o do Chrome.
O cÃƒÂ³digo ÃƒÂ© de 2016 (React 15, GSAP 1.18, webpack 1, babel 5) e estÃƒÂ¡ MIT.

## O que foi preciso para instalar (o repo nÃƒÂ£o builda do zero)

| Problema | SoluÃƒÂ§ÃƒÂ£o aplicada |
|---|---|
| `spaceman@^0.1.0` nÃƒÂ£o existe no npm | repo irmÃƒÂ£o `../spaceman` (do autor) ligado por alias do webpack |
| `quick-interface` nÃƒÂ£o existe no npm | repo irmÃƒÂ£o `../quick-interface` (do autor) ligado por alias |
| Loaders nÃƒÂ£o resolvem fora do projeto | junctions de `babel-loader`, `afflatus`, `react-matterkit`, `react` nos repos irmÃƒÂ£os |
| `gulp@3` quebra no Node 22 | build direto com webpack: `node_modules\.bin\webpack.cmd --config webpack.browser.config.dev.js` |
| `graceful-fs` antigo | `overrides` no `package.json` |
| `webpack-dev-server: "*"` resolveria v5 (incompatÃƒÂ­vel) | pin `1.16.5` |
| bundle carregava de `rawgit.com` (morto) | bundle local servido por `run-local.ps1` |

## Rodar

```powershell
cd H:\TUDO\Codigo\Codigo\animachine
.\run-local.ps1 -Port 8091      # builda e serve local-test/ em http://127.0.0.1:8091/
```

`run-local.ps1` compila (`browser/animachine.js`, ~3,1 MB) e serve `local-test/`.

## Usar o editor em qualquer pÃƒÂ¡gina (sem extensÃƒÂ£o)

1. Deixe o servidor rodando (`run-local.ps1`).
2. Abra `http://127.0.0.1:8091/bookmarklet.html` e arraste o link para a barra de favoritos.
3. Abra sua pÃƒÂ¡gina (de preferÃƒÂªncia servida em `http://localhost`) e clique no favorito.
   - O bookmarklet carrega GSAP 1.18 do CDN e `animachine.js` de `127.0.0.1:8091`.
   - Em pÃƒÂ¡gina **HTTPS**, o carregamento de `http://127.0.0.1` pode ser bloqueado pelo navegador;
     nesse caso edite com a pÃƒÂ¡gina servida localmente (http) ou use a extensÃƒÂ£o abaixo.

## Usar em qualquer site Ã¢â‚¬â€ extensÃƒÂ£o MV3 (recomendado)

O repo original tinha extensÃƒÂ£o Chrome **MV2** (morta). Este clone agora tem uma extensÃƒÂ£o **MV3**
prÃƒÂ³pria, com o editor e o GSAP **embutidos** Ã¢â‚¬â€ sem CDN, sem servidor local, sem mixed content,
e sem sofrer com o CSP da pÃƒÂ¡gina.

```powershell
.\build-extension.ps1     # compila e monta extension/ (animachine.js + gsap.min.js)
```

Depois:

1. Abra `chrome://extensions` e ligue o **Developer mode**.
2. **Load unpacked** Ã¢â€ â€™ selecione `H:\TUDO\Codigo\Codigo\animachine\extension`.
3. Fixe o ÃƒÂ­cone "animachine (local)" na barra de ferramentas (puzzle Ã¢â€ â€™ pin).
4. Abra **qualquer site** (http, https ou file) e clique no ÃƒÂ­cone.

Como funciona: [extension/background.js](extension/background.js) injeta `vendor/gsap.min.js` e
`animachine.js` no **main world** da aba (`chrome.scripting.executeScript`, `world: 'MAIN'`).
Clicar duas vezes ÃƒÂ© inofensivo (guard `__animachineInited` da [src/main.js](src/main.js)).

Notas de verificaÃƒÂ§ÃƒÂ£o:

* o **payload** (animachine.js em world MAIN) foi validado numa pÃƒÂ¡gina crua, sem editor embutido:
  o diÃƒÂ¡logo "Hello!" aparece e o guard de dupla injeÃƒÂ§ÃƒÂ£o funciona;
* o **clique no ÃƒÂ­cone** nÃƒÂ£o pÃƒÂ´de ser automatizado: Chrome 157 (branded) ignora `--load-extension`
  por linha de comando, entÃƒÂ£o o carregamento ÃƒÂ© manual (Load unpacked);
* pÃƒÂ¡ginas `chrome://`, Chrome Web Store e PDFs internos nÃƒÂ£o aceitam injeÃƒÂ§ÃƒÂ£o.

## Para produÃƒÂ§ÃƒÂ£o (no site publicado)

O **editor** ÃƒÂ© ferramenta de desenvolvimento e nÃƒÂ£o vai para o site. O que vai:

* o arquivo `.am.js` exportado (bundle UMD com o projeto e as timelines), com GSAP carregado antes;
* um disparador: `animachine-connect` (decorator React) ou, em HTML puro, o global do bundle
  (`window['<nome do projeto>']['<timeline>'](document.body)`) Ã¢â‚¬â€ ponto a validar/embrulhar.

## Fluxo verificado (o que o landing page promete)

1. No diÃƒÂ¡logo **Hello!**, clique `start`.
2. Clique num elemento da pÃƒÂ¡gina Ã¢â€ â€™ aparece o contorno pontilhado com botÃƒÂµes (setas, Ãƒâ€”, **+**).
3. Clique no **+** Ã¢â€ â€™ cria a track com o seletor CSS do elemento (`new track for "#card-1"`).
4. Arraste o elemento Ã¢â€ â€™ o transform tool grava os parÃƒÂ¢metros (`x`, `y`, `transformOriginX/Y`).
5. Mova o playhead na rÃƒÂ©gua (0Ã¢â‚¬â€œ1250 ms) e ajuste valores para criar mais keys.
6. Menu do topo da timeline (cÃƒÂ­rculo ÃƒÂ  direita da ÃƒÂ¡rea de controles):
   `save file` (.am.js), `open project (.am.json)`, `save project (.am.json)`, undo, redo.
7. No site: use o `.am.js` com `animachine-connect` (decorator React) e dispare a timeline.

## Matriz de features do landing page

| Feature | Status | EvidÃƒÂªncia |
|---|---|---|
| **In browser** | Ã¢Å“â€¦ | bookmarklet (localhost) e extensÃƒÂ£o MV3 (qualquer site) |
| **DOM picker** | Ã¢Å“â€¦ | gera seletor CSS e cria track (`#card-1`) |
| **Transform** | Ã¢Å¡Â Ã¯Â¸Â | tool renderiza e cria params+keys; valores de x/y ficaram ~0 na automaÃƒÂ§ÃƒÂ£o (validar com mouse real) |
| **Ease** | Ã¢Å¡Â Ã¯Â¸Â | editor inline de easing existe na keyline; nÃƒÂ£o testado |
| **Timeline** | Ã¢Å“â€¦ | rÃƒÂ©gua em ms, tracks, params, `currentTime` |
| **JS export** | Ã¢Å“â€¦ | `new project.am.js` (18 KB) com `projectSource` + `timelineSources`; diÃƒÂ¡logo copy/download |
| **Save / reload** | Ã¢Å“â€¦ *novo* | `new project.am.json` (3 KB); roundtrip reconstrÃƒÂ³i timeline/track/params/keys |

## Patches feitos neste clone

| Arquivo | MudanÃƒÂ§a |
|---|---|
| `package.json` | `spaceman` removido (local), `overrides.graceful-fs`, `webpack-dev-server` pinado |
| `webpack.browser.config.dev.js` | aliases `spaceman`/`quick-interface`/`react-dom` + include no babel-loader |
| `src/rocks/dom-picker/DOMPicker.jsx` | botÃƒÂµes do picker **sempre visÃƒÂ­veis** (antes sÃƒÂ³ no hover) |
| `src/rocks/timeline-tab/controls/Controls.jsx` | hint "click an elementÃ¢â‚¬Â¦ press +"; botÃƒÂ£o "Create an empty track" |
| `src/rocks/project-file/index.js` | **novo**: salvar/abrir projeto `.am.json` (toolbar) |
| `src/main.js` | registra `project-file`; guard `__animachineInited` (injeÃƒÂ§ÃƒÂ£o dupla ÃƒÂ© inofensiva) |
| `extension/` + `build-extension.ps1` | **novo**: extensÃƒÂ£o MV3 com GSAP + editor embutidos |
| `local-test/` (inclui `plain.html`, `bookmarklet.html`) | pÃƒÂ¡gina de teste, pÃƒÂ¡gina crua e bookmarklet |

## LimitaÃƒÂ§ÃƒÂµes conhecidas

* ExtensÃƒÂ£o Chrome MV2 do repo original estÃƒÂ¡ morta Ã¢â‚¬â€ o bookmarklet substitui.
* `content-script.js` original aponta para `rawgit.com` (extinto).
* O demo publicado (`gh-pages`, `#/Robots`) referencia uma cena que nÃƒÂ£o existe no `master`.
* O editor depende de Font Awesome para os ÃƒÂ­cones; a extensÃƒÂ£o embute a fonte, o bookmarklet carrega
  do CDN. Em site com CSS agressivo, algum ÃƒÂ­cone pode herdar estilo errado.
* `Transform` funciona com arrasto real (verificado: `x=200.37`, `y=100.19`), mas precisa de uma
  **track com alvo** Ã¢â‚¬â€ a track vazia do placeholder nÃƒÂ£o serve.

## Troubleshooting da extensÃƒÂ£o

| Sintoma | Causa | SoluÃƒÂ§ÃƒÂ£o |
|---|---|---|
| Nenhum ÃƒÂ­cone aparece (setas, Ãƒâ€”, +) | pÃƒÂ¡gina sem Font Awesome | jÃƒÂ¡ embutido na extensÃƒÂ£o; **recarregue a extensÃƒÂ£o** e dÃƒÂª **F5 na pÃƒÂ¡gina** |
| Cliquei no elemento e nÃƒÂ£o achei o "+" | ÃƒÂ© a **bolinha ciano no centro** do contorno pontilhado | clique nela; ela cria a track com o seletor CSS |
| Criei "Create an empty track" e nada funciona | track vazia nÃƒÂ£o tem alvo: sem alvo nÃƒÂ£o hÃƒÂ¡ transform tool nem keys | use elemento + `+`; a track vazia pode ser apagada |
| NÃƒÂ£o arrasta o elemento | precisa de track com alvo; arraste pelo **corpo** (longe da borda) | crie a track pelo `+` e arraste do meio do elemento |
| O picker nÃƒÂ£o pega o elemento (iframe, shadow DOM, overlay) | o `elementFromPoint` nÃƒÂ£o atravessa essas barreiras | menu (cÃƒÂ­rculo, ÃƒÂ  direita da timeline) Ã¢â€ â€™ **add track (css selector)** Ã¢â€ â€™ digite o seletor |
| Depois de eu mexer no cÃƒÂ³digo | a extensÃƒÂ£o em memÃƒÂ³ria ÃƒÂ© a antiga | `chrome://extensions` Ã¢â€ â€™ **Reload** na extensÃƒÂ£o Ã¢â€ â€™ **F5** na pÃƒÂ¡gina |
| Qualquer outra coisa | Ã¢â‚¬â€ | no console da pÃƒÂ¡gina rode `animachineDiag()` e me mande o objeto |

## PrÃƒÂ³ximos passos possÃƒÂ­veis

1. Editor de ease (inline na keyline) Ã¢â‚¬â€ validar e documentar.
2. Abrir o `.am.js` de volta alÃƒÂ©m do `.am.json` (formato do bundle ÃƒÂ© JS, nÃƒÂ£o JSON).
3. Empacotar como script de dev (`<script>` em projeto prÃƒÂ³prio) com versionamento dos patches.

## Fonte dos Ã­cones (Font Awesome)

A extensÃ£o embute **Font Awesome 4.6.3 (SIL OFL 1.1)** em `extension/font-awesome/`.

Dois cuidados que jÃ¡ estÃ£o resolvidos no `background.js`:

1. `chrome.scripting.insertCSS({files})` resolve URLs relativas contra a **pÃ¡gina** (dava
   `GET https://site/fonts/fontawesome-webfont.* 404`). O CSS Ã© montado em runtime com URLs
   absolutas `chrome-extension://<id>/font-awesome/fonts/...`.
2. A famÃ­lia Ã© renomeada para **`animachine-fa`** (o FA usa o shorthand `font: â€¦ FontAwesome`
   na classe `.fa`, entÃ£o a troca Ã© no arquivo inteiro) e reforÃ§ada com `!important` â€” assim o
   CSS do site nÃ£o canibaliza os Ã­cones do editor.

NÃ£o Ã© preciso baixar nem copiar fontes para o projeto: elas vÃªm da extensÃ£o.

## Seletores gerados pelo picker

O picker gera um seletor CSS a partir do elemento. Quando não existe id/classe única no caminho,
o gerador usa um seletor **relativo** (`> :nth-child(3) …`) ancorado no `<body>`.

Correção (build atual):

* o gerador emite `:scope > :nth-child(…)` — válido em `element.querySelectorAll`;
* `createTargets` normaliza seletores antigos que começam com `>` para `:scope > …`.

Sem isso, `querySelectorAll("> …")` lança `SyntaxError`, a track fica com `targets: []` e o
transform tool (caixa verde) não aparece. Verificado na página do animachine com o seletor
`> :nth-child(3) .w-container > :nth-child(4) h2` → alvo encontrado (H2) e caixa verde visível.