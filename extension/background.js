// MV3: injeta o editor na aba ativa, em world MAIN (sem CSP, sem mixed content).
const RUNNABLE = /^(https?|file):/i

async function inject(tabId) {
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
