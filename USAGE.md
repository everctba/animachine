# animachine local â€” setup, patches e uso

Este clone foi **recuperado** em 2026-11-17 para rodar em Node 22 sem a extensÃ£o do Chrome.
O cÃ³digo Ã© de 2016 (React 15, GSAP 1.18, webpack 1, babel 5) e estÃ¡ MIT.

## O que foi preciso para instalar (o repo nÃ£o builda do zero)

| Problema | SoluÃ§Ã£o aplicada |
|---|---|
| `spaceman@^0.1.0` nÃ£o existe no npm | repo irmÃ£o `../spaceman` (do autor) ligado por alias do webpack |
| `quick-interface` nÃ£o existe no npm | repo irmÃ£o `../quick-interface` (do autor) ligado por alias |
| Loaders nÃ£o resolvem fora do projeto | junctions de `babel-loader`, `afflatus`, `react-matterkit`, `react` nos repos irmÃ£os |
| `gulp@3` quebra no Node 22 | build direto com webpack: `node_modules\.bin\webpack.cmd --config webpack.browser.config.dev.js` |
| `graceful-fs` antigo | `overrides` no `package.json` |
| `webpack-dev-server: "*"` resolveria v5 (incompatÃ­vel) | pin `1.16.5` |
| bundle carregava de `rawgit.com` (morto) | bundle local servido por `run-local.ps1` |

## Rodar

```powershell
cd H:\TUDO\Codigo\Codigo\animachine
.\run-local.ps1 -Port 8091      # builda e serve local-test/ em http://127.0.0.1:8091/
```

`run-local.ps1` compila (`browser/animachine.js`, ~3,1 MB) e serve `local-test/`.

## Usar o editor em qualquer pÃ¡gina (sem extensÃ£o)

1. Deixe o servidor rodando (`run-local.ps1`).
2. Abra `http://127.0.0.1:8091/bookmarklet.html` e arraste o link para a barra de favoritos.
3. Abra sua pÃ¡gina (de preferÃªncia servida em `http://localhost`) e clique no favorito.
   - O bookmarklet carrega GSAP 1.18 do CDN e `animachine.js` de `127.0.0.1:8091`.
   - Em pÃ¡gina **HTTPS**, o carregamento de `http://127.0.0.1` pode ser bloqueado pelo navegador;
     nesse caso edite com a pÃ¡gina servida localmente (http) ou use a extensÃ£o abaixo.

## Usar em qualquer site â€” extensÃ£o MV3 (recomendado)

O repo original tinha extensÃ£o Chrome **MV2** (morta). Este clone agora tem uma extensÃ£o **MV3**
prÃ³pria, com o editor e o GSAP **embutidos** â€” sem CDN, sem servidor local, sem mixed content,
e sem sofrer com o CSP da pÃ¡gina.

```powershell
.\build-extension.ps1     # compila e monta extension/ (animachine.js + gsap.min.js)
```

Depois:

1. Abra `chrome://extensions` e ligue o **Developer mode**.
2. **Load unpacked** â†’ selecione `H:\TUDO\Codigo\Codigo\animachine\extension`.
3. Fixe o Ã­cone "animachine (local)" na barra de ferramentas (puzzle â†’ pin).
4. Abra **qualquer site** (http, https ou file) e clique no Ã­cone.

Como funciona: [extension/background.js](extension/background.js) injeta `vendor/gsap.min.js` e
`animachine.js` no **main world** da aba (`chrome.scripting.executeScript`, `world: 'MAIN'`).
Clicar duas vezes Ã© inofensivo (guard `__animachineInited` da [src/main.js](src/main.js)).

Notas de verificaÃ§Ã£o:

* o **payload** (animachine.js em world MAIN) foi validado numa pÃ¡gina crua, sem editor embutido:
  o diÃ¡logo "Hello!" aparece e o guard de dupla injeÃ§Ã£o funciona;
* o **clique no Ã­cone** nÃ£o pÃ´de ser automatizado: Chrome 157 (branded) ignora `--load-extension`
  por linha de comando, entÃ£o o carregamento Ã© manual (Load unpacked);
* pÃ¡ginas `chrome://`, Chrome Web Store e PDFs internos nÃ£o aceitam injeÃ§Ã£o.

## Para produÃ§Ã£o (no site publicado)

O **editor** Ã© ferramenta de desenvolvimento e nÃ£o vai para o site. O que vai:

* o arquivo `.am.js` exportado (bundle UMD com o projeto e as timelines), com GSAP carregado antes;
* um disparador: `animachine-connect` (decorator React) ou, em HTML puro, o global do bundle
  (`window['<nome do projeto>']['<timeline>'](document.body)`) â€” ponto a validar/embrulhar.

## Fluxo verificado (o que o landing page promete)

1. No diÃ¡logo **Hello!**, clique `start`.
2. Clique num elemento da pÃ¡gina â†’ aparece o contorno pontilhado com botÃµes (setas, Ã—, **+**).
3. Clique no **+** â†’ cria a track com o seletor CSS do elemento (`new track for "#card-1"`).
4. Arraste o elemento â†’ o transform tool grava os parÃ¢metros (`x`, `y`, `transformOriginX/Y`).
5. Mova o playhead na rÃ©gua (0â€“1250 ms) e ajuste valores para criar mais keys.
6. Menu do topo da timeline (cÃ­rculo Ã  direita da Ã¡rea de controles):
   `save file` (.am.js), `open project (.am.json)`, `save project (.am.json)`, undo, redo.
7. No site: use o `.am.js` com `animachine-connect` (decorator React) e dispare a timeline.

## Matriz de features do landing page

| Feature | Status | EvidÃªncia |
|---|---|---|
| **In browser** | âœ… | bookmarklet (localhost) e extensÃ£o MV3 (qualquer site) |
| **DOM picker** | âœ… | gera seletor CSS e cria track (`#card-1`) |
| **Transform** | âš ï¸ | tool renderiza e cria params+keys; valores de x/y ficaram ~0 na automaÃ§Ã£o (validar com mouse real) |
| **Ease** | âš ï¸ | editor inline de easing existe na keyline; nÃ£o testado |
| **Timeline** | âœ… | rÃ©gua em ms, tracks, params, `currentTime` |
| **JS export** | âœ… | `new project.am.js` (18 KB) com `projectSource` + `timelineSources`; diÃ¡logo copy/download |
| **Save / reload** | âœ… *novo* | `new project.am.json` (3 KB); roundtrip reconstrÃ³i timeline/track/params/keys |

## Patches feitos neste clone

| Arquivo | MudanÃ§a |
|---|---|
| `package.json` | `spaceman` removido (local), `overrides.graceful-fs`, `webpack-dev-server` pinado |
| `webpack.browser.config.dev.js` | aliases `spaceman`/`quick-interface`/`react-dom` + include no babel-loader |
| `src/rocks/dom-picker/DOMPicker.jsx` | botÃµes do picker **sempre visÃ­veis** (antes sÃ³ no hover) |
| `src/rocks/timeline-tab/controls/Controls.jsx` | hint "click an elementâ€¦ press +"; botÃ£o "Create an empty track" |
| `src/rocks/project-file/index.js` | **novo**: salvar/abrir projeto `.am.json` (toolbar) |
| `src/main.js` | registra `project-file`; guard `__animachineInited` (injeÃ§Ã£o dupla Ã© inofensiva) |
| `extension/` + `build-extension.ps1` | **novo**: extensÃ£o MV3 com GSAP + editor embutidos |
| `local-test/` (inclui `plain.html`, `bookmarklet.html`) | pÃ¡gina de teste, pÃ¡gina crua e bookmarklet |

## LimitaÃ§Ãµes conhecidas

* ExtensÃ£o Chrome MV2 do repo original estÃ¡ morta â€” o bookmarklet substitui.
* `content-script.js` original aponta para `rawgit.com` (extinto).
* O demo publicado (`gh-pages`, `#/Robots`) referencia uma cena que nÃ£o existe no `master`.
* O editor depende de Font Awesome para os Ã­cones; a extensÃ£o embute a fonte, o bookmarklet carrega
  do CDN. Em site com CSS agressivo, algum Ã­cone pode herdar estilo errado.
* `Transform` funciona com arrasto real (verificado: `x=200.37`, `y=100.19`), mas precisa de uma
  **track com alvo** â€” a track vazia do placeholder nÃ£o serve.

## Troubleshooting da extensÃ£o

| Sintoma | Causa | SoluÃ§Ã£o |
|---|---|---|
| Nenhum Ã­cone aparece (setas, Ã—, +) | pÃ¡gina sem Font Awesome | jÃ¡ embutido na extensÃ£o; **recarregue a extensÃ£o** e dÃª **F5 na pÃ¡gina** |
| Cliquei no elemento e nÃ£o achei o "+" | Ã© a **bolinha ciano no centro** do contorno pontilhado | clique nela; ela cria a track com o seletor CSS |
| Criei "Create an empty track" e nada funciona | track vazia nÃ£o tem alvo: sem alvo nÃ£o hÃ¡ transform tool nem keys | use elemento + `+`; a track vazia pode ser apagada |
| NÃ£o arrasta o elemento | precisa de track com alvo; arraste pelo **corpo** (longe da borda) | crie a track pelo `+` e arraste do meio do elemento |
| O picker nÃ£o pega o elemento (iframe, shadow DOM, overlay) | o `elementFromPoint` nÃ£o atravessa essas barreiras | menu (cÃ­rculo, Ã  direita da timeline) â†’ **add track (css selector)** â†’ digite o seletor |
| Depois de eu mexer no cÃ³digo | a extensÃ£o em memÃ³ria Ã© a antiga | `chrome://extensions` â†’ **Reload** na extensÃ£o â†’ **F5** na pÃ¡gina |
| Qualquer outra coisa | â€” | no console da pÃ¡gina rode `animachineDiag()` e me mande o objeto |

## PrÃ³ximos passos possÃ­veis

1. Editor de ease (inline na keyline) â€” validar e documentar.
2. Abrir o `.am.js` de volta alÃ©m do `.am.json` (formato do bundle Ã© JS, nÃ£o JSON).
3. Empacotar como script de dev (`<script>` em projeto prÃ³prio) com versionamento dos patches.

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