export default function(rootTarget, selector) {
  if (selector.selectorType === 'css') {
    //TODO throw if rootTarget not a dom element
    if (selector.query === ':root') {
      return [rootTarget]
    }
    else {
      try {
        // seletores relativos ("> :nth-child(3)") são inválidos em querySelectorAll;
        // ancoramos no próprio rootTarget com :scope (funciona em projetos antigos)
        let query = selector.query
        if (query.charAt(0) === '>') {
          query = ':scope ' + query
        }
        return [...rootTarget.querySelectorAll(query)]
      }
      catch (e) {
        console.warn(`error on using css selector  "${selector.query}"`)
        return []
      }
    }
  }
  else if (selector.selectorType === 'react') {
    return rootTarget.findWithCommands(selector.query)
  }
}
