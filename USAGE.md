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
     nesse caso edite com a página servida localmente (http).

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
| **In browser** | ✅ | bundle roda sobre qualquer página; servidor local |
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
| `src/main.js` | registra `project-file` |
| `local-test/`, `run-local.ps1`, `shots/` | página de teste, servidor e capturas |

## Limitações conhecidas

* Extensão Chrome MV2 do repo original está morta — o bookmarklet substitui.
* `content-script.js` original aponta para `rawgit.com` (extinto).
* O demo publicado (`gh-pages`, `#/Robots`) referencia uma cena que não existe no `master`.
* Ícones usam Font Awesome via CDN (incluído na página de teste).
* `Transform` precisa de validação com mouse real (automação headless gera keys, mas com valores ~0).

## Próximos passos possíveis

1. Verificar/corrigir o transform drag (transhand) e o editor de ease.
2. Abrir o `.am.js` de volta além do `.am.json` (formato do bundle é JS, não JSON).
3. Empacotar como script de dev (`<script>` em projeto próprio) com versionamento dos patches.
