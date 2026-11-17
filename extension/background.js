// MV3: injeta o editor na aba ativa, em world MAIN (sem CSP, sem mixed content).
const RUNNABLE = /^(https?|file):/i

async function inject(tabId) {
  // Ícones do editor (o site não tem Font Awesome). insertCSS é privilegiado: CSP da página não bloqueia.
  try {
    await chrome.scripting.insertCSS({
      target: {tabId},
      files: ['vendor/font-awesome/css/font-awesome.min.css'],
    })
  }
  catch (e) {
    console.warn('animachine: nao consegui injetar Font Awesome', e)
  }
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
