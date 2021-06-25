const { setWorldConstructor } = require('@cucumber/cucumber')

class TemplateWorld {
  constructor() {
    this.searchResults = null
  }

  setTo(result) {
    this.searchResults = result
  }
}

setWorldConstructor(TemplateWorld)
