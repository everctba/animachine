// MV3: injeta o editor na aba ativa, em world MAIN (sem CSP, sem mixed content).
const RUNNABLE = /^(https?|file):/i

let faCssPromise

// O Font Awesome vem embutido na extensÃ£o. Dois detalhes importantes:
//  1) insertCSS({files}) resolve URLs relativas contra a PÃGINA (gerava 404 em
//     https://site/fonts/...), entÃ£o trocamos por URLs absolutas chrome-extension://;
//  2) usamos uma famÃ­lia de fonte prÃ³pria ("animachine-fa") para o CSS do site
//     nÃ£o sobrescrever/canibalizar os Ã­cones do editor.
async function buildFontAwesomeCss() {
  if (!faCssPromise) {
    faCssPromise = (async () => {
      const cssUrl = chrome.runtime.getURL('font-awesome/font-awesome.css')
      const fontsDir = chrome.runtime.getURL('font-awesome/fonts/')
      let css = await (await fetch(cssUrl)).text()

      // familia própria: o FA usa 'font: ... FontAwesome' na classe .fa, então
      // troca o token no arquivo inteiro (não só em font-family)
      css = css.replace(/FontAwesome/g, 'animachine-fa')
      css = css.replace(/url\((['"]?)\.\.\/fonts\//g, (match, quote) => `url(${quote}${fontsDir}`)
      // extensões não precisam de ?v=4.6.3 / #iefix na URL do arquivo
      css = css.replace(/(fontawesome-webfont\.[a-z0-9]+)\?[^'")\s]*/gi, '$1')
      // garante a família mesmo se o CSS da página tentar sobrescrever
      css += '\n.fa,.fa-stack{font-family:animachine-fa!important}\n'

      return css
    })()
  }
  return faCssPromise
}

async function injectFontAwesome(tabId) {
  try {
    const css = await buildFontAwesomeCss()
    await chrome.scripting.insertCSS({target: {tabId}, css})
  }
  catch (e) {
    console.warn('animachine: nao consegui injetar Font Awesome', e)
  }
}

async function inject(tabId) {
  await injectFontAwesome(tabId)
  // GSAP primeiro (o editor usa TimelineMax/TweenMax globais).
  await chrome.scripting.executeScript({
    target: {tabId},
    world: 'MAIN',
    files: ['vendor/gsap.min.js'],
  })
  await chrome.scripting.executeScript({
    target: {tabId},
    world: 'MAIN',
    files: ['animachine.js'],
  })
}

chrome.action.onClicked.addListener(async tab => {
  if (!tab || !tab.id || !RUNNABLE.test(tab.url || '')) {
    console.warn('animachine: esta pagina nao aceita injecao', tab && tab.url)
    return
  }
  try {
    await inject(tab.id)
  }
  catch (e) {
    console.error('animachine: falha ao injetar', e)
  }
})
