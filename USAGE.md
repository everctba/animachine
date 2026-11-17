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

## Para produção (no site publicado)

O **editor** é ferramenta de desenvolvimento e não vai para o site. O que vai:

* o arquivo `.am.js` exportado (bundle UMD com o projeto e as timelines), com GSAP carregado antes;
* um disparador: `animachine-connect` (decorator React) ou, em HTML puro, o global do bundle
  (`window['<nome do projeto>']['<timeline>'](document.body)`) — ponto a validar/embrulhar.

## Fluxo verificado (o que o landing page promete)

1. No diálogo **Hello!**, clique `start`.
2. Clique num elemento da página → aparece o contorno pontilhado com botões (setas, ×, **+**).
3. Clique no **+** → cria a track com o seletor CSS do elemento (`new track for "#card-1"`).
4. Arraste o elemento → o transform tool grava os parâmetros (`x`, `y`, `transformOriginX/Y`).
5. Mova o playhead na régua (0–1250 ms) e ajuste valores para criar mais keys.
6. Menu do topo da timeline (círculo à direita da área de controles):
   `save file` (.am.js), `open project (.am.json)`, `save project (.am.json)`, undo, redo.
7. No site: use o `.am.js` com `animachine-connect` (decorator React) e dispare a timeline.

## Matriz de features do landing page

| Feature | Status | Evidência |
|---|---|---|
| **In browser** | ✅ | bookmarklet (localhost) e extensão MV3 (qualquer site) |
| **DOM picker** | ✅ | gera seletor CSS e cria track (`#card-1`) |
| **Transform** | ⚠️ | tool renderiza e cria params+keys; valores de x/y ficaram ~0 na automação (validar com mouse real) |
| **Ease** | ⚠️ | editor inline de easing existe na keyline; não testado |
| **Timeline** | ✅ | régua em ms, tracks, params, `currentTime` |
| **JS export** | ✅ | `new project.am.js` (18 KB) com `projectSource` + `timelineSources`; diálogo copy/download |
| **Save / reload** | ✅ *novo* | `new project.am.json` (3 KB); roundtrip reconstrói timeline/track/params/keys |

## Patches feitos neste clone

| Arquivo | Mudança |
|---|---|
| `package.json` | `spaceman` removido (local), `overrides.graceful-fs`, `webpack-dev-server` pinado |
| `webpack.browser.config.dev.js` | aliases `spaceman`/`quick-interface`/`react-dom` + include no babel-loader |
| `src/rocks/dom-picker/DOMPicker.jsx` | botões do picker **sempre visíveis** (antes só no hover) |
| `src/rocks/timeline-tab/controls/Controls.jsx` | hint "click an element… press +"; botão "Create an empty track" |
| `src/rocks/project-file/index.js` | **novo**: salvar/abrir projeto `.am.json` (toolbar) |
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
| Depois de eu mexer no código | a extensão em memória é a antiga | `chrome://extensions` → **Reload** na extensão → **F5** na página |
| Qualquer outra coisa | — | no console da página rode `animachineDiag()` e me mande o objeto |

## Próximos passos possíveis

1. Editor de ease (inline na keyline) — validar e documentar.
2. Abrir o `.am.js` de volta além do `.am.json` (formato do bundle é JS, não JSON).
3. Empacotar como script de dev (`<script>` em projeto próprio) com versionamento dos patches.
